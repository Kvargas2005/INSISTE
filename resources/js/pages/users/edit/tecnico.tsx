import { Head, router } from '@inertiajs/react';
import { LoaderCircle, UploadCloud } from 'lucide-react';
import React, { FormEventHandler, useState, useEffect, useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { type BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import AdressForm from '@/components/AdressForm';
import { showError } from '@/components/SwalUtils';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Editar Técnico', href: '/users/edit/tecnico' },
];

interface Role {
  id: number;
  name: string;
  color: string;
  text_color: string;
}

interface UserFile {
  id: number;
  filename: string;
  path: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  id_role: number;
  provincia: string;
  canton: string;
  distrito: string;
  adress: string;
  phone: string;
  specialization: string;
  tech_signature: string;
  hiringdate: string;
  code: string;
  driver_license: string;
  vehicle_brand: string;
  vehicle_plate: string;
  social_security: string;
  personal_email: string;
  tech_type: string;
  files: UserFile[];
}


type RegisterForm = {
  name: string;
  email: string;
  rol: number;
  provincia: string;
  canton: string;
  distrito: string;
  adress: string;
  phone: string;
  specialization: string;
  tech_signature: string;
  hiringdate: string;
  code: string;
  driver_license: string;
  vehicle_brand: string;
  vehicle_plate: string;
  social_security: string;
  personal_email: string;
  tech_type: string;
  files?: File[]; // Cambiado de FileList | null a File[]
  deleted_files?: number[];
};


interface Props {
  user: User;
  roles: Role[];
}

export default function EditTecnico({ user, roles }: Props) {
  const [data, setData] = useState<RegisterForm>({
    name: user.name,
    email: user.email,
    rol: user.id_role,
    provincia: user.provincia,
    canton: user.canton,
    distrito: user.distrito,
    adress: user.adress,
    phone: user.phone,
    specialization: user.specialization,
    tech_signature: user.tech_signature,
    hiringdate: user.hiringdate,
    code: user.code,
    driver_license: user.driver_license,
    vehicle_brand: user.vehicle_brand,
    vehicle_plate: user.vehicle_plate,
    social_security: user.social_security,
    personal_email: user.personal_email,
    tech_type: user.tech_type,
    files: [], // Cambiado de null a []
    deleted_files: [],
  });


  const [existingFiles, setExistingFiles] = useState<UserFile[]>(user.files || []);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [processing, setProcessing] = useState(false);

  const sigPadRefTech = useRef<SignatureCanvas | null>(null);

  useEffect(() => {
    if (sigPadRefTech.current && data.tech_signature) {
      sigPadRefTech.current.clear();
      sigPadRefTech.current.fromData(JSON.parse(data.tech_signature));
    }
  }, [data.tech_signature]);

  const handleRemoveExistingFile = (fileId: number) => {
    setExistingFiles(existingFiles.filter(f => f.id !== fileId));
    setData(prev => ({
      ...prev,
      deleted_files: [...(prev.deleted_files ?? []), fileId],
    }));
  };

  const signatureDataTech = () => {
    if (!sigPadRefTech.current || sigPadRefTech.current.toData().length === 0) {
      showError('Falta firma del técnico');
      return;
    }

    const sig = JSON.stringify(sigPadRefTech.current.toData());

    setData((prev) => ({ ...prev, tech_signature: sig }));
  };

  // Estados para archivos nuevos y previews
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [newFilesPreview, setNewFilesPreview] = useState<string[]>([]);
  const dropRef = useRef<HTMLDivElement>(null);

  // Cambiar handleNewFilesChange para agregar archivos
  const handleNewFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewFiles((prev: File[]) => [...prev, ...Array.from(e.target.files as FileList)]);
    }
  };

  // Drag and drop para archivos nuevos (agregar, no reemplazar)
  useEffect(() => {
    const dropArea = dropRef.current;
    if (!dropArea) return;

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      dropArea.classList.add('ring-2', 'ring-blue-400');
    };
    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      dropArea.classList.remove('ring-2', 'ring-blue-400');
    };
    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      dropArea.classList.remove('ring-2', 'ring-blue-400');
      if (e.dataTransfer && e.dataTransfer.files) {
        setNewFiles((prev: File[]) => [...prev, ...Array.from(e.dataTransfer!.files)]);
      }
    };
    dropArea.addEventListener('dragover', handleDragOver);
    dropArea.addEventListener('dragleave', handleDragLeave);
    dropArea.addEventListener('drop', handleDrop);
    return () => {
      dropArea.removeEventListener('dragover', handleDragOver);
      dropArea.removeEventListener('dragleave', handleDragLeave);
      dropArea.removeEventListener('drop', handleDrop);
    };
  }, []);

  // Eliminar archivo nuevo antes de guardar
  const handleRemoveNewFile = (idx: number) => {
    setNewFiles((prev: File[]) => prev.filter((_, i) => i !== idx));
  };

  // Previsualización de archivos nuevos
  useEffect(() => {
    if (!newFiles.length) {
      setNewFilesPreview([]);
      return;
    }
    const urls = newFiles.map((file: File) => {
      if (file.type.startsWith('image/')) {
        return URL.createObjectURL(file);
      }
      return '';
    });
    setNewFilesPreview(urls);
    return () => {
      urls.forEach((url: string) => url && URL.revokeObjectURL(url));
    };
  }, [newFiles]);

  const handleAdressChange = (field: string, value: string) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const submit: FormEventHandler = (e) => {
    e.preventDefault();

    console.log('data', data);

    if (
      !data.name || !data.email || !data.rol || !data.provincia || !data.canton ||
      !data.distrito || !data.adress || !data.phone || !data.specialization ||
      !data.hiringdate || !data.code
    ) {
      showError('Por favor, complete todos los campos requeridos.');
      return;
    }

    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('email', data.email);
    formData.append('rol', data.rol.toString());
    formData.append('provincia', data.provincia);
    formData.append('canton', data.canton);
    formData.append('distrito', data.distrito);
    formData.append('adress', data.adress);
    formData.append('phone', data.phone);
    formData.append('specialization', data.specialization);
    formData.append('tech_signature', data.tech_signature);
    formData.append('hiringdate', data.hiringdate);
    formData.append('code', data.code);
    formData.append('driver_license', data.driver_license);
    formData.append('vehicle_brand', data.vehicle_brand);
    formData.append('vehicle_plate', data.vehicle_plate);
    formData.append('social_security', data.social_security);
    formData.append('personal_email', data.personal_email);
    formData.append('tech_type', data.tech_type);


    newFiles.forEach((file: File) => formData.append('files[]', file));

    (data.deleted_files ?? []).forEach(id => formData.append('deleted_files[]', id.toString()));

    setProcessing(true);
    router.post(route('users.editSaveTecnico', { id: user.id }), formData, {
      forceFormData: true,
      onError: (errs) => {
        setErrors(errs);
        setProcessing(false);
      },
      onFinish: () => setProcessing(false),
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Editar Técnico" />

      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Editar Técnico</h1>

        <form onSubmit={submit} encType="multipart/form-data" className="grid grid-cols-2 gap-x-6 gap-y-4">
          <div>
            <Label htmlFor="name">Nombre</Label>
            <Input id="name" value={data.name} onChange={e => setData({ ...data, name: e.target.value })} />
            <InputError message={errors.name} />
          </div>

          <div>
            <Label htmlFor="email">Correo</Label>
            <Input id="email" value={data.email} onChange={e => setData({ ...data, email: e.target.value })} />
            <InputError message={errors.email} />
          </div>

          <div>
            <Label htmlFor="phone">Teléfono</Label>
            <Input id="phone" value={data.phone} onChange={e => setData({ ...data, phone: e.target.value })} />
            <InputError message={errors.phone} />
          </div>

          <div>
            <Label htmlFor="rol">Rol</Label>
            <select
              id="rol"
              value={data.rol}
              onChange={e => setData({ ...data, rol: Number(e.target.value) })}
              className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Seleccione un rol</option>
              {roles.map(role => (
                <option key={role.id} value={role.id}>{role.name}</option>
              ))}
            </select>
            <InputError message={errors.rol} />
          </div>

          <div>
            <Label htmlFor="specialization">Especialización</Label>
            <Input
              id="specialization"
              value={data.specialization}
              onChange={e => setData({ ...data, specialization: e.target.value })}
            />
            <InputError message={errors.specialization} />
          </div>

          <div>
            <Label htmlFor="driver_license">Licencia de Conducir</Label>
            <Input
              id="driver_license"
              value={data.driver_license}
              onChange={e => setData({ ...data, driver_license: e.target.value })}
            />
            <InputError message={errors.driver_license} />
          </div>

          <div>
            <Label htmlFor="vehicle_brand">Marca del Vehículo</Label>
            <Input
              id="vehicle_brand"
              value={data.vehicle_brand}
              onChange={e => setData({ ...data, vehicle_brand: e.target.value })}
            />
            <InputError message={errors.vehicle_brand} />
          </div>

          <div>
            <Label htmlFor="vehicle_plate">Placa del Vehículo</Label>
            <Input
              id="vehicle_plate"
              value={data.vehicle_plate}
              onChange={e => setData({ ...data, vehicle_plate: e.target.value })}
            />
            <InputError message={errors.vehicle_plate} />
          </div>

          <div>
            <Label htmlFor="social_security">Número Seguro Social</Label>
            <Input
              id="social_security"
              value={data.social_security}
              onChange={e => setData({ ...data, social_security: e.target.value })}
            />
            <InputError message={errors.social_security} />
          </div>

          <div>
            <Label htmlFor="personal_email">Correo Personal</Label>
            <Input
              id="personal_email"
              value={data.personal_email}
              onChange={e => setData({ ...data, personal_email: e.target.value })}
            />
            <InputError message={errors.personal_email} />
          </div>

          <div>
            <Label htmlFor="tech_type">Tipo Técnico</Label>
            <select
              id="tech_type"
              value={data.tech_type}
              onChange={(e) => setData({ ...data, tech_type: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Seleccione una opción</option>
              <option value="Interno">Interno</option>
              <option value="Externo">Externo</option>
            </select>
            <InputError message={errors.tech_type} />
          </div>



          <div className="col-span-2 mt-4">
            <AdressForm
              values={{ provincia: data.provincia, canton: data.canton, distrito: data.distrito }}
              onChange={handleAdressChange}
              errors={errors}
            />
          </div>

          <div className="col-span-2">
            <Label htmlFor="adress">Dirección</Label>
            <Input id="adress" value={data.adress} onChange={e => setData({ ...data, adress: e.target.value })} />
            <InputError message={errors.adress} />
          </div>

          <div>
            <Label htmlFor="hiring_date">Fecha de Contratación</Label>
            <input
              type="date"
              id="hiring_date"
              value={data.hiringdate ? new Date(data.hiringdate).toISOString().split('T')[0] : ''}
              onChange={e => setData({ ...data, hiringdate: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <InputError message={errors.hiringdate} />
          </div>

          <div>
            <Label htmlFor="code">Código</Label>
            <Input id="code" value={data.code} onChange={e => setData({ ...data, code: e.target.value })} />
            <InputError message={errors.code} />
          </div>



          <div className="flex flex-col gap-2 items-center">
            <Label className='text-gray-400'>Firma del Cliente</Label>
            <div className="relative border w-full">
              <SignatureCanvas
                ref={sigPadRefTech}
                canvasProps={{ className: 'w-full h-32' }}
              />
              <button
                type="button"
                onClick={() => sigPadRefTech.current?.clear()}
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
            <InputError message={errors.client_signature} />
          </div>

          {/* Archivos existentes */}
          <div className="col-span-2 mt-6">
            <Label>Archivos actuales</Label>
            {existingFiles.length === 0 && <p>No hay archivos cargados</p>}
            <ul>
              {existingFiles.map(file => (
                <li key={file.id} className="flex items-center justify-between py-1 gap-4">
                  <div className="flex items-center gap-2">
                    {/* Vista previa segun tipo */}
                    {file.filename.match(/\.(jpg|jpeg|png)$/i) ? (
                      <img
                        src={`/storage/${file.path}`}
                        alt={file.filename}
                        className="w-12 h-12 object-cover rounded border"
                      />
                    ) : file.filename.match(/\.(pdf)$/i) ? (
                      <span className="w-12 h-12 flex items-center justify-center bg-red-100 text-red-600 rounded border">
                        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-file-text"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                      </span>
                    ) : file.filename.match(/\.(doc|docx)$/i) ? (
                      <span className="w-12 h-12 flex items-center justify-center bg-blue-100 text-blue-600 rounded border">
                        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-file-text"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                      </span>
                    ) : (
                      <span className="w-12 h-12 flex items-center justify-center bg-gray-100 text-gray-600 rounded border">
                        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-file"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                      </span>
                    )}
                    <a href={`/storage/${file.path}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                      {file.filename}
                    </a>
                  </div>
                  <button
                    type="button"
                    className="ml-4 text-red-600 hover:text-red-800"
                    onClick={() => handleRemoveExistingFile(file.id)}
                  >
                    Eliminar
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Subir archivos nuevos */}
          <div className="col-span-2 mt-4">
            <Label className="mb-2 block">Agregar nuevos archivos</Label>
            <div
              ref={dropRef}
              className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition"
              onClick={() => document.getElementById('files')?.click()}
              style={{ position: 'relative' }}
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <UploadCloud className="w-10 h-10 mb-3 text-gray-400" />
                <p className="mb-2 text-sm text-gray-500 text-center">
                  <span className="font-semibold">Haz clic para subir</span> o arrastra y suelta archivos aquí
                </p>
                <p className="text-xs text-gray-400">PDF, DOCX, JPG, PNG, etc.</p>
              </div>
              <input
                id="files"
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={handleNewFilesChange}
                className="hidden"
              />
            </div>
            {/* Previsualización de archivos nuevos */}
            {newFiles.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-4">
                <ul className="grid grid-cols-4 gap-4 w-full">
                  {newFiles.map((file: File, idx: number) => (
                    <li key={idx} className="flex flex-col items-center gap-1 bg-gray-50 p-2 rounded shadow-sm relative">
                      {file.type.startsWith('image/') ? (
                        <img src={newFilesPreview[idx]} alt={file.name} className="w-16 h-16 object-cover rounded" />
                      ) : file.name.match(/\.(pdf)$/i) ? (
                        <div className="w-16 h-16 bg-red-100 text-red-600 flex items-center justify-center rounded">PDF</div>
                      ) : file.name.match(/\.(doc|docx)$/i) ? (
                        <div className="w-16 h-16 bg-blue-100 text-blue-600 flex items-center justify-center rounded">DOC</div>
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 text-center text-sm flex items-center justify-center rounded">📄</div>
                      )}
                      <span className="text-xs text-center max-w-[80px] truncate">{file.name}</span>
                      <button
                        type="button"
                        className="absolute -top-2 -right-2 bg-white border border-gray-300 rounded-full w-6 h-6 flex items-center justify-center text-red-600 shadow group-hover:visible visible"
                        onClick={() => handleRemoveNewFile(idx)}
                        title="Eliminar archivo"
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <InputError message={errors['files.*']} />
          </div>

          <div className="col-span-2 mt-6 grid grid-cols-2 gap-x-6 gap-y-4">
            <a href="/users/tecnicos">
              <Button className="w-full" type="button">Cancelar</Button>
            </a>
            <Button type="submit" disabled={processing}>
              {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
              Guardar
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
