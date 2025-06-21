import React, { useRef, useEffect, useState, FormEventHandler } from 'react';
import { useForm, router, Head } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Select from 'react-select';
import SignatureCanvas from 'react-signature-canvas';
import { showError } from '@/components/SwalUtils';
import { type BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Actas', href: '/actas/list' },
  { title: 'Editar Acta', href: '#' },
];

// Tipos reutilizados
// Puedes ajustar estos tipos según tu backend
interface User { id: number; name: string; }
interface Options { value: number; label: string; }
interface ComponentStock {
  id_component: number;
  description: string;
  quantity: number;
  warehouse_name: string;
  id_warehouse: number;
}
interface FormValues {
  [key: string]: any;
  technician_id?: number;
  id_for: number;
  contact: string;
  project: string;
  service_location: string;
  phone: string;
  delivery_class: number[];
  delivery_class_detail: string;
  job_type: number[];
  job_type_detail: string;
  delivery_scope: string;
  description: string;
  visit_type: string;
  technician_signature: string;
  client_signature: string;
  notes: string;
  is_open: boolean;
  components: { id_component: number; description: string; quantity: number; warehouse_name: string; }[];
  services: number[];
  service_detail: string;
}

interface Props {
  acta: FormValues;
  users: User[];
  services: Options[];
  techStock: ComponentStock[];
  technicians: User[];
  deliverys: Options[];
  jobs: Options[];
}

export default function EditActa({ acta, users, services, techStock, technicians, deliverys, jobs }: Props) {
  const { data, setData, put, processing, errors } = useForm<FormValues>({ ...acta });

  // Signature pads
  const techSigRef = useRef<SignatureCanvas>(null);
  const clientSigRef = useRef<SignatureCanvas>(null);

  // Multi-selects
  const [selectedServices, setSelectedServices] = useState<Options[]>(
    services.filter(s => data.services?.includes(s.value))
  );
  const [selectedDeliverys, setSelectedDeliverys] = useState<Options[]>(
    deliverys.filter(d => data.delivery_class?.includes(d.value))
  );
  const [selectedJobs, setSelectedJobs] = useState<Options[]>(
    jobs.filter(j => data.job_type?.includes(j.value))
  );
  const [selectedComponents, setSelectedComponents] = useState<ComponentStock[]>(
    (data.components || []).map((c: any) => ({
      ...c,
      id_warehouse: c.id_warehouse ?? 0,
    }))
  );


  useEffect(() => {
    setData('job_type', selectedJobs.map(j => j.value));
    setData('delivery_class', selectedDeliverys.map(d => d.value));
    setData('services', selectedServices.map(s => s.value));
    setData('components', selectedComponents.map(c => ({
      id_component: c.id_component,
      description: c.description,
      quantity: c.quantity,
      warehouse_name: c.warehouse_name,
    })));
  }, [selectedJobs, selectedDeliverys, selectedServices, selectedComponents]);

  // Cargar firmas si existen
  useEffect(() => {
    if (data.technician_signature && techSigRef.current) {
      try {
        techSigRef.current.fromData(JSON.parse(data.technician_signature));
      } catch {}
    }
    if (data.client_signature && clientSigRef.current) {
      try {
        clientSigRef.current.fromData(JSON.parse(data.client_signature));
      } catch {}
    }
  }, []);

  const signatureDataTech = () => {
    if (!techSigRef.current || techSigRef.current.isEmpty()) {
      showError('Falta firma del técnico');
      return;
    }
    setData('technician_signature', JSON.stringify(techSigRef.current.toData()));
  };
  const signatureDataCliente = () => {
    if (!clientSigRef.current || clientSigRef.current.isEmpty()) {
      showError('Falta firma del cliente');
      return;
    }
    setData('client_signature', JSON.stringify(clientSigRef.current.toData()));
  };

  const submit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (!data.technician_signature || !data.client_signature) {
      return showError('Faltan firmas');
    }
    put(`/actas/update/${acta.id}`);
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Editar Acta" />
      <form className="flex flex-col gap-6 m-4" onSubmit={submit}>
        <div className="grid grid-cols-2 gap-6">
          {/* Técnico (solo admins) */}
          {technicians.length > 0 && (
            <div className="grid gap-2">
              <Label htmlFor="technician_id">Técnico responsable</Label>
              <select
                id="technician_id"
                value={data.technician_id}
                onChange={e => setData('technician_id', parseInt(e.target.value, 10))}
                className="w-full border rounded p-2 bg-white"
                disabled={processing}
              >
                <option value={0}>Seleccione técnico…</option>
                {technicians.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
              <InputError message={errors.technician_id} />
            </div>
          )}
          <div className="grid gap-2">
            <Label htmlFor="id_for">Cliente</Label>
            <select
              id="id_for"
              value={data.id_for}
              onChange={e => setData('id_for', parseInt(e.target.value, 10))}
              disabled={processing}
              className="w-full border rounded p-2 bg-white"
            >
              <option value={0}>Seleccione...</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>
            <InputError message={errors.id_for} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="contact">Contacto</Label>
            <Input id="contact" value={data.contact} onChange={e => setData('contact', e.target.value)} disabled={processing} />
            <InputError message={errors.contact} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="project">Proyecto</Label>
            <Input id="project" value={data.project} onChange={e => setData('project', e.target.value)} disabled={processing} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="service_location">Dirección</Label>
            <Input id="service_location" value={data.service_location} onChange={e => setData('service_location', e.target.value)} disabled={processing} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone">Teléfono</Label>
            <Input id="phone" value={data.phone} onChange={e => setData('phone', e.target.value)} disabled={processing} />
          </div>
          <div className="col-span-2 grid gap-2">
            <Label htmlFor="description">Descripción</Label>
            <Input id="description" value={data.description} onChange={e => setData('description', e.target.value)} disabled={processing} />
            <InputError message={errors.description} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="grid gap-2">
            <Label>Trabajo a Realizar</Label>
            <Select isMulti options={jobs} value={selectedJobs} onChange={selected => setSelectedJobs(selected as Options[])} isDisabled={processing} />
            <InputError message={errors.services} />
          </div>
          {data.job_type?.includes(7) && (
            <div className="grid gap-2">
              <Label htmlFor="job_type_detail">Detalle Trabajo</Label>
              <Input id="job_type_detail" value={data.job_type_detail} onChange={e => setData('job_type_detail', e.target.value)} disabled={processing} />
              <InputError message={errors.job_type_detail} />
            </div>
          )}
          <div className="grid gap-2">
            <Label htmlFor="visit_type">Tipo de Visita</Label>
            <select id="visit_type" value={data.visit_type} onChange={e => setData('visit_type', e.target.value)} className="w-full border rounded p-2 bg-white" disabled={processing}>
              <option value="Facturar">Facturar</option>
              <option value="Garantia">Garantia</option>
              <option value="No Facturar">No Facturar</option>
            </select>
            <InputError message={errors.visit_type} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="grid gap-2">
            <Label>Clase de Entrega</Label>
            <Select isMulti options={deliverys} value={selectedDeliverys} onChange={selected => setSelectedDeliverys(selected as Options[])} isDisabled={processing} />
            <InputError message={errors.services} />
          </div>
          {data.delivery_class?.includes(7) && (
            <div className="grid gap-2">
              <Label htmlFor="delivery_class_detail">Detalle Entrega</Label>
              <Input id="delivery_class_detail" value={data.delivery_class_detail} onChange={e => setData('delivery_class_detail', e.target.value)} disabled={processing} />
              <InputError message={errors.delivery_class_detail} />
            </div>
          )}
          <div className="grid gap-2">
            <Label htmlFor="delivery_scope">Alcance de Entrega</Label>
            <select id="delivery_scope" value={data.delivery_scope} onChange={e => setData('delivery_scope', e.target.value)} className="w-full border rounded p-2 bg-white" disabled={processing}>
              <option value="">Seleccione...</option>
              <option value="Total">Total</option>
              <option value="Parcial">Parcial</option>
            </select>
            <InputError message={errors.delivery_scope} />
          </div>
        </div>
        <div className="grid gap-2">
          <Label>Servicios</Label>
          <Select isMulti options={services} value={selectedServices} onChange={selected => setSelectedServices(selected as Options[])} isDisabled={processing} />
          <InputError message={errors.services} />
        </div>
        {data.services?.includes(0) && (
          <div className="grid gap-2">
            <Label htmlFor="service_detail">Detalle Entrega</Label>
            <Input id="service_detail" value={data.service_detail} onChange={e => setData('service_detail', e.target.value)} disabled={processing} />
            <InputError message={errors.service_detail} />
          </div>
        )}
        {/* Tabla de componentes seleccionados (editable) */}
        {selectedComponents.length > 0 && (
          <div className="grid gap-2">
            <Label>Artículos Seleccionados</Label>
            <table className="table-auto w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-center px-4 py-2">Artículos</th>
                  <th className="text-center px-4 py-2">Cantidad</th>
                  <th className="text-center px-4 py-2">Acción</th>
                </tr>
              </thead>
              <tbody>
                {selectedComponents.map((item, idx) => (
                  <tr key={idx}>
                    <td className="border text-center px-4 py-2">{item.description}</td>
                    <td className="border text-center px-4 py-2">
                      <Input
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={e => {
                          const qty = parseInt(e.target.value, 10);
                          setSelectedComponents(sc => sc.map((c, i) => i === idx ? { ...c, quantity: qty } : c));
                        }}
                        disabled={processing}
                        className="w-20"
                      />
                    </td>
                    <td className="border text-center px-4 py-2">
                      <Button type="button" onClick={() => setSelectedComponents(sc => sc.filter((_, i) => i !== idx))}>
                        Eliminar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="grid gap-2 ">
          <Label htmlFor="notes">Notas adicionales</Label>
          <textarea id="notes" value={data.notes} onChange={e => setData('notes', e.target.value)} className="border rounded w-full min-h-[80px]" disabled={processing} />
        </div>
        <div className="flex items-center gap-2">
          <input id="is_open" type="checkbox" checked={data.is_open} onChange={e => setData('is_open', e.target.checked)} disabled={processing} className="h-4 w-4" />
          <Label htmlFor="is_open" className="ml-2">¿Dejar abierta el acta? (Solo en caso de quedar algo pendiente)</Label>
        </div>
        <div className="grid md:grid-cols-2 grid-cols-1 gap-6">
          <div className="flex flex-col gap-2 items-center">
            <Label>Firma del Técnico</Label>
            <div className="relative border w-full">
              <SignatureCanvas ref={techSigRef} canvasProps={{ className: 'w-full h-32' }} />
              <button type="button" onClick={() => techSigRef.current?.clear()} className="absolute top-1 right-1 text-xs bg-white px-2 py-1 rounded shadow">Limpiar</button>
              <button type="button" onClick={signatureDataTech} className="absolute bottom-1 right-1 text-xs bg-blue-500 text-white px-2 py-1 rounded shadow">Confirmar</button>
            </div>
            <InputError message={errors.technician_signature} />
          </div>
          <div className="flex flex-col gap-2 items-center">
            <Label>Firma del Cliente</Label>
            <div className="relative border w-full">
              <SignatureCanvas ref={clientSigRef} canvasProps={{ className: 'w-full h-32' }} />
              <button type="button" onClick={() => clientSigRef.current?.clear()} className="absolute top-1 right-1 text-xs bg-white px-2 py-1 rounded shadow">Limpiar</button>
              <button type="button" onClick={signatureDataCliente} className="absolute bottom-1 right-1 text-xs bg-blue-500 text-white px-2 py-1 rounded shadow">Confirmar</button>
            </div>
            <InputError message={errors.client_signature} />
          </div>
        </div>
        <div className="col-span-2 mt-4 grid grid-cols-2 gap-x-6 gap-y-4">
          <a href="/actas/list">
            <Button className="w-full" type="button">Cancelar</Button>
          </a>
          <Button type="submit" disabled={processing}>{processing && <LoaderCircle className="h-4 w-4 animate-spin" />} Guardar</Button>
        </div>
      </form>
    </AppLayout>
  );
}
