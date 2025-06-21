import React, { useState, useRef, useEffect, FormEventHandler, use } from 'react';
import axios from 'axios';
import { useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Select from 'react-select';
import { type BreadcrumbItem } from '@/types';
import { showError } from '@/components/SwalUtils';
import SignatureCanvas from 'react-signature-canvas';
import ListInvTech from '../assingInvTech/listInvTech';


const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Actas', href: '/actas/list' },
  { title: 'Crear Acta', href: '/actas/create' },
];

// —————— TIPOS ——————
type Option = { value: string; label: string };

interface User {
  id: number;
  name: string;
  contact?: string;
  adress?: string;
  phone?: string;
}
interface Options {
  value: number;
  label: string;
}
interface ComponentStock {
  id_component: number;
  component_name: string;
  quantity: number;
  warehouse_name: string;
  id_warehouse: number
}
interface FormValues {
  [key: string]: any;    // ← permite cualquier clave
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
  components: { id_component: number; component_name: string; quantity: number; warehouse_name: string; }[];
  services: number[];
  service_detail: string;
}


interface Props {
  id_tech: number
  tech_sig?: string; // opcional, si se usa en el componente
  users: User[];
  services: Options[];
  techStock: ComponentStock[];
  id_assignment?: number; // opcional, si se usa en el componente
  technicians: User[];
  deliverys: Options[];
  jobs: Options[];
  assignment_services?: number[]; // <-- nuevo
}

export default function CreateActa({
  id_tech,
  tech_sig,
  users,
  services,
  techStock,
  technicians,
  id_assignment, // opcional, si se usa en el componente
  deliverys,
  jobs,
  assignment_services // <-- nuevo
}: Props) {
  const { data, setData, post, processing, errors, reset } = useForm<FormValues>({
    technician_id: technicians.length > 0 ? 0 : id_tech,
    id_for: 0,
    contact: '',
    project: '',
    service_location: '',
    phone: '',
    delivery_class_detail: '',
    job_type_detail: '',
    service_detail: '',
    delivery_scope: '',
    description: '',
    visit_type: 'Facturar',
    technician_signature: '',
    client_signature: '',
    notes: '',
    is_open: false,
    components: [],
    services: [],
    delivery_class: [],
    job_type: [],
    id_assignment: id_assignment || null,
  });

  // — Signature pads
  const techSigRef = useRef<SignatureCanvas>(null);
  const clientSigRef = useRef<SignatureCanvas>(null);

  // — Components inventory & selection
  const [availableComponents, setAvailableComponents] = useState<ComponentStock[]>(techStock);
  const [selectedComponents, setSelectedComponents] = useState<ComponentStock[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [quantityInputs, setQuantityInputs] = useState<Record<string, number>>({});

  // — Services multi-select
  const [selectedServices, setSelectedServices] = useState<Options[]>([]);
  const [selectedDeliverys, setselectedDeliverys] = useState<Options[]>([]);
  const [selectedJobs, setselectedJobs] = useState<Options[]>([]);

  // Mostrar firma inicial si tech_sig viene
  useEffect(() => {
    if (tech_sig && techSigRef.current) {
      try {
        const sigData = JSON.parse(tech_sig);
        techSigRef.current.fromData(sigData);
        setData('technician_signature', tech_sig);
      } catch (e) {
        // Si no es JSON válido, ignorar
      }
    }
  }, []);


  // — Load technician stock if admin
  useEffect(() => {

    if (technicians.length > 0 && data.technician_id) {
      axios
        .get(route('assingInvTech.getTechStock'), {
          params: { id_technician: data.technician_id },
        })
        .then((res) => setAvailableComponents(res.data))
        .catch(() => showError('No se pudo cargar inventario'));

      axios
        .get(route('users.techcode'), {
          params: { id_technician: data.technician_id },
        })
        .then((res) => {
          // Set signature to techSigRef if exists
          if (res.data && res.data[0]?.signature && techSigRef.current) {
            try {
              const sigData = JSON.parse(res.data[0].signature);
              techSigRef.current.fromData(sigData);
            } catch (e) {
              console.error('Error parsing technician signature', e);
            }
          }
        });
    } else if (technicians.length > 0 && data.technician_id === 0) {
      setAvailableComponents([]);
      setSelectedComponents([]);
      if (techSigRef.current) {
        techSigRef.current.clear();
      }
      setData('technician_signature', '');
    }
  }, [data.technician_id]);

  useEffect(() => {
    setData('job_type', selectedJobs.map(j => j.value));
    setData('delivery_class', selectedDeliverys.map(d => d.value));
    setData('services', selectedServices.map(s => s.value));
    setData('components', selectedComponents.map(c => ({
      id_component: c.id_component,
      component_name: c.component_name,
      quantity: c.quantity,
      warehouse_name: c.warehouse_name,
    })));
  }, [selectedJobs, selectedDeliverys, selectedServices, selectedComponents]);


  const signatureDataTech = () => {
    if (techSigRef.current.toData() == '' || techSigRef.current.toData() == undefined) {
      showError('Falta firma del técnico');
      return;
    }

    const data = JSON.stringify(techSigRef.current.toData())

    setData('technician_signature', data);
  };

  const signatureDataCliente = () => {
    if (clientSigRef.current.toData() == '' || clientSigRef.current.toData() == undefined) {
      showError('Falta firma del cliente');
      return;
    }

    const data = JSON.stringify(clientSigRef.current.toData())

    setData('client_signature', data);
  };


  // — Bloqueo de check y notas obligatorias si alcance es Parcial
  const isParcial = data.delivery_scope === 'Parcial';

  const submit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (!data.technician_signature || !data.client_signature) {
      return showError('Faltan firmas');
    }
    if (isParcial && !data.notes) {
      return showError('Las notas adicionales son obligatorias para entregas parciales.');
    }
    post(route('actas.store'));
  };

  // — Fetch client data
  const handleUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = parseInt(e.target.value, 10);
    if (id === 0) {
      // No hacer nada si es 0
      return;
    }
    setData('id_for', id);
    axios
      .get(route('users.getData', id))
      .then((res) => {
        const u = res.data as Pick<User, 'name' | 'contact' | 'adress' | 'phone'>;
        setData('contact', u.contact || '');
        setData('project', u.name);
        setData('service_location', u.adress || '');
        setData('phone', u.phone || '');
      })
      .catch(() => {
        showError('No se pudo cargar datos del cliente');
        setData('contact', '');
        setData('project', '');
        setData('service_location', '');
        setData('phone', '');
      });
  };

  // — Select unique client if id_assignment is present
  useEffect(() => {
    if (id_assignment && users.length === 1) {
      setData('id_for', users[0].id);
      const id = users[0].id;
      axios
        .get(route('users.getData', id))
        .then((res) => {
          const u = res.data as Pick<User, 'name' | 'contact' | 'adress' | 'phone'>;
          setData('contact', u.contact || '');
          setData('project', u.name);
          setData('service_location', u.adress || '');
          setData('phone', u.phone || '');
        })
        .catch(() => {
          showError('No se pudo cargar datos del cliente');
          setData('contact', '');
          setData('project', '');
          setData('service_location', '');
          setData('phone', '');
        });
    }
  }, [id_assignment, users, setData]);


  // — Quantity inputs
  const handleQuantityChange = (key: string, qty: number) =>
    setQuantityInputs((prev) => ({ ...prev, [key]: qty }));

  // — Add component
  const handleAddComponent = (comp: ComponentStock) => {
    const key = `${comp.warehouse_name}_${comp.component_name}`;
    let qty = quantityInputs[key] || 0;
    if (qty <= 0) qty = 1;

    // Check if the same component from the same warehouse is already selected
    const existing = selectedComponents.find(
      (c) => c.id_component === comp.id_component && c.id_warehouse === comp.id_warehouse
    );
    const sumQty = existing ? existing.quantity + qty : qty;

    if (sumQty > comp.quantity)
      return showError(`Máximo disponible ${comp.quantity}, ya seleccionaste ${existing?.quantity || 0}`);

    const updated = existing
      ? selectedComponents.map((c) =>
        c.id_component === comp.id_component && c.id_warehouse === comp.id_warehouse
          ? { ...c, quantity: sumQty }
          : c
      )
      : [...selectedComponents, { ...comp, quantity: qty }];

    setSelectedComponents(updated);
    setQuantityInputs((prev) => ({ ...prev, [key]: 0 }));
  };

  // Forzar el valor de is_open en el form si es Parcial
  useEffect(() => {
    if (isParcial && !data.is_open) {
      setData('is_open', true);
    }
    if (!isParcial && data.is_open) {
      // No forzar a false, el usuario puede decidir
    }
  }, [isParcial]);

  // Forzar el valor de visit_type en el form si es Parcial
  useEffect(() => {
    if (isParcial && data.visit_type !== 'No Facturar') {
      setData('visit_type', 'No Facturar');
    }
  }, [isParcial]);

  // Preseleccionar servicios si vienen de la asignación
  useEffect(() => {
    if (id_assignment && assignment_services && assignment_services.length > 0) {
      const preselected = services.filter(s => assignment_services.includes(s.value));
      setSelectedServices(preselected);
    }
  }, [id_assignment, assignment_services, services]);

  return (
    <form className="flex flex-col gap-6 m-4" onSubmit={submit}>
      <div className="grid grid-cols-2 gap-6">

        {/* 1) Selección de técnico para admins */}
        {technicians.length > 0 && (
          <div className="grid gap-2">
            <Label htmlFor="technician_id" className='text-gray-400'>Técnico responsable</Label>
            <select
              id="technician_id"
              value={data.technician_id}
              onChange={e => setData('technician_id', parseInt(e.target.value, 10))}
              className="w-full border rounded p-2 bg-white"
              disabled={processing}
            >
              <option value={0}>Seleccione técnico…</option>
              {technicians.map(t => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
            <InputError message={errors.technician_id} />
          </div>
        )}

        <div className="grid gap-2">
          <Label htmlFor="id_for" className='text-gray-400'>Cliente</Label>
          <select
            id="id_for"
            value={data.id_for}
            onChange={handleUserChange}
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
          <Label htmlFor="contact" className='text-gray-400'>Contacto</Label>
          <Input
            id="contact"
            value={data.contact}
            onChange={(e) => setData('contact', e.target.value)}
            disabled={processing}
          />
          <InputError message={errors.contact} />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="project" className='text-gray-400'>Proyecto</Label>
          <Input id="project" value={data.project} disabled />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="service_location" className='text-gray-400'>Dirección</Label>
          <Input id="service_location" value={data.service_location} disabled />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="phone" className='text-gray-400'>Teléfono</Label>
          <Input id="phone" value={data.phone} disabled />
        </div>

        <div className="col-span-2 grid gap-2">
          <Label htmlFor="description" className='text-gray-400'>Descripción</Label>
          <Input
            id="description"
            value={data.description}
            onChange={(e) => setData('description', e.target.value)}
            disabled={processing}
          />
          <InputError message={errors.description} />
        </div>
      </div>

      <div className="grid gap-2">
        <div className="grid gap-2">
          <Label className='text-gray-400'>Trabajo a Realizar</Label>
          <Select
            isMulti
            options={jobs}
            value={selectedJobs}
            onChange={(selected) => setselectedJobs(selected as Options[])}
            isDisabled={processing}
          />
          <InputError message={errors.services} />
        </div>
        {data.job_type.includes(7) && (
          <div className="grid gap-2">
            <Label htmlFor="job_type_detail" className='text-gray-400'>Detalle otro trabajo a realizar</Label>
            <Input
              id="job_type_detail"
              value={data.job_type_detail}
              onChange={e => setData('job_type_detail', e.target.value)}
              disabled={processing}
            />
            <InputError message={errors.job_type_detail} />
          </div>
        )}


      </div>

      <div className="grid gap-2">
        <Label className='text-gray-400'>Tipo de Servicios</Label>
        <Select
          isMulti
          options={services}
          value={selectedServices}
          onChange={(selected) => setSelectedServices(selected as Options[])}
          isDisabled={processing}
        />
        <InputError message={errors.services} />
      </div>

      {data.services.includes(0) && (
        <div className="grid gap-2">
          <Label htmlFor="service_detail" className='text-gray-400'>Detalle otro tipo de servicios</Label>
          <Input
            id="service_detail"
            value={data.service_detail}
            onChange={e => setData('service_detail', e.target.value)}
            disabled={processing}
          />
          <InputError message={errors.service_detail} />
        </div>
      )}


      <div className="grid grid-cols-12 gap-6">
        {/* Tipo de Entrega */}
        <div className="col-span-4 grid gap-2">
          <Label className='text-gray-400'>Tipo de Entrega</Label>
          <Select
            isMulti
            options={deliverys}
            value={selectedDeliverys}
            onChange={(selected) => setselectedDeliverys(selected as Options[])}
            isDisabled={processing}
          />
          <InputError message={errors.services} />
        </div>
       

        {/* Alcance de Entrega */}
        <div className="col-span-4 grid gap-2">
          <Label htmlFor="delivery_scope" className='text-gray-400'>Alcance de Entrega</Label>
          <select
            id="delivery_scope"
            value={data.delivery_scope}
            onChange={(e) => setData('delivery_scope', e.target.value)}
            className="w-full border rounded p-2 bg-white"
            disabled={processing}
          >
            <option value="">Seleccione...</option>
            <option value="Total">Total</option>
            <option value="Parcial">Parcial</option>
          </select>
          <InputError message={errors.delivery_scope} />
        </div>

         {/* Tipo de Visita solo No Facturar si es Parcial */}
        <div className="col-span-4 grid gap-2">
          <Label htmlFor="visit_type" className='text-gray-400'>Tipo de Visita</Label>
          <select
            id="visit_type"
            value={data.visit_type}
            onChange={(e) => setData('visit_type', e.target.value)}
            className="w-full border rounded p-2 bg-white"
            disabled={processing || isParcial}
          >
            {isParcial ? (
              <option value="No Facturar">No Facturar</option>
            ) : (
              <>
                <option value="Facturar">Facturar</option>
                <option value="Garantia">Garantia</option>
                <option value="No Facturar">No Facturar</option>
              </>
            )}
          </select>
          <InputError message={errors.visit_type} />
        </div>

      </div>

      {/* Detalle Entrega solo si corresponde */}
      {data.delivery_class.includes(7) && (
        <div className="grid gap-2 mt-2">
          <Label htmlFor="delivery_class_detail" className='text-gray-400'>Detalle otro tipo de entrega</Label>
          <Input
            id="delivery_class_detail"
            value={data.delivery_class_detail}
            onChange={e => setData('delivery_class_detail', e.target.value)}
            disabled={processing}
          />
          <InputError message={errors.delivery_class_detail} />
        </div>
      )}

      {/* Sección de artículos solo si delivery_class NO incluye 2 ni 3 */}
      {data.delivery_class.some(dc => dc !== 2 && dc !== 3) && (
        <>
          <div className="grid gap-2">
            <Label htmlFor="search_component" className='text-gray-400'>Buscar Artículo</Label>
            <Input
              id="search_component"
              placeholder="Escribe para buscar..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="mb-2"
            />

            <div className="m-4 shadow rounded-lg overflow-y-auto overflow-x-auto">
              <table className="min-w-[900px] w-full border-collapse text-sm text-gray-500 dark:text-gray-400">
                <thead className="bg-gray-100 dark:bg-gray-700">
                  <tr >
                    <th className="text-left px-4 py-2">Artículo</th>
                    <th className="text-left px-4 py-2">Disponible</th>
                    <th className="text-left px-4 py-2">Cantidad</th>
                    <th className="text-left px-4 py-2">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {availableComponents
                    .filter(c => c.component_name.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map(comp => {
                      const key = `${comp.warehouse_name}_${comp.component_name}`;
                      return (
                        <tr key={key} className="border-t">
                          <td className=" px-4 py-2">{comp.component_name}</td>
                          <td className="text-left px-4 py-2">{comp.quantity}</td>
                          <td className="flex justify-left px-4 py-2">
                            <Input
                              type="number"
                              min={0}
                              max={comp.quantity}
                              value={quantityInputs[key] || 0}
                              onChange={e => handleQuantityChange(key, parseInt(e.target.value, 10))}
                              disabled={processing}
                              className="w-20"
                            />
                          </td>
                          <td className="text-left px-4 py-2">
                            <Button type="button" onClick={() => handleAddComponent(comp)} disabled={processing}>
                              Agregar
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Selected components table */}
          {selectedComponents.length > 0 && (
            <div className="grid gap-2">
              <Label>Artículos Seleccionados</Label>
              <table className="table-auto w-full border-collapse">
                <thead>
                  <tr>
                    <th className="text-left px-4 py-2">Artículos</th>
                    <th className="text-left px-4 py-2">Cantidad</th>
                    <th className="text-left px-4 py-2">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedComponents.map((item, idx) => (
                    <tr key={idx}>
                      <td className="border text-left px-4 py-2">{item.component_name}</td>
                      <td className="border text-left px-4 py-2">{item.quantity}</td>
                      <td className="border text-left px-4 py-2">
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
        </>
      )}

      {/* Notas adicionales (obligatorias si Parcial) */}
      <div className="grid gap-2 ">
        <Label htmlFor="notes" className='text-gray-400'>Notas adicionales {isParcial && <span className="text-red-500">*</span>}</Label>
        <textarea
          id="notes"
          value={data.notes}
          onChange={e => setData('notes', e.target.value)}
          className="border rounded w-full min-h-[80px]"
          disabled={processing}
          required={isParcial}
        />
        {isParcial && !data.notes && <InputError message="Este campo es obligatorio en entregas parciales." />}
      </div>

      {/* Check dejar abierta (forzado y bloqueado si Parcial) */}
      <div className="flex items-center gap-2">
        <input
          id="is_open"
          type="checkbox"
          checked={isParcial ? true : data.is_open}
          onChange={e => setData('is_open', isParcial ? true : e.target.checked)}
          disabled={processing || isParcial}
          className="h-4 w-4"
        />
        <Label htmlFor="is_open" className="ml-2">
          ¿Dejar abierta el acta? (Solo en caso de quedar algo pendiente)
        </Label>
      </div>

      <div className="grid md:grid-cols-2 grid-cols-1 gap-6">
        <div className="flex flex-col gap-2 items-center">
          <Label className='text-gray-400'>Firma del Técnico</Label>
          <div className="relative border w-full">
            <SignatureCanvas
              ref={techSigRef}
              canvasProps={{ className: 'w-full h-32' }}
            />
            <button
              type="button"
              onClick={() => techSigRef.current?.clear()}
              className="absolute top-1 right-1 text-xs bg-white px-2 py-1 rounded shadow"
            >
              Limpiar
            </button>
            <button
              type="button"
              onClick={signatureDataTech}
              className="absolute bottom-1 right-1 text-xs bg-blue-500 text-white px-2 py-1 rounded shadow"
            >
              Confirmar
            </button>
          </div>
          <InputError message={errors.technician_signature} />
        </div>

        <div className="flex flex-col gap-2 items-center">
          <Label className='text-gray-400'>Firma del Cliente</Label>
          <div className="relative border w-full">
            <SignatureCanvas
              ref={clientSigRef}
              canvasProps={{ className: 'w-full h-32' }}
            />
            <button
              type="button"
              onClick={() => clientSigRef.current?.clear()}
              className="absolute top-1 right-1 text-xs bg-white px-2 py-1 rounded shadow"
            >
              Limpiar
            </button>
            <button
              type="button"
              onClick={signatureDataCliente}
              className="absolute bottom-1 right-1 text-xs bg-blue-500 text-white px-2 py-1 rounded shadow"
            >
              Confirmar
            </button>
          </div>
          <InputError message={errors.client_signature} />
        </div>
      </div>



      <div className="col-span-2 mt-4 grid grid-cols-2 gap-x-6 gap-y-4">
        <a href="/actas/list">
          <Button className="w-full" type="button">
            Cancelar
          </Button>
        </a>
        <Button type="submit" disabled={processing}>
          {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
          Guardar
        </Button>
      </div>
    </form>
  );
}
