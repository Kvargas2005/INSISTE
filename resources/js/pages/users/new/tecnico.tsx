import { Head, router } from '@inertiajs/react';
import { LoaderCircle, UploadCloud } from 'lucide-react';
import React, { useState, useRef, useEffect, FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { type BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import AdressForm from '@/components/AdressForm';
import SignatureCanvas from 'react-signature-canvas';
import { showError } from '@/components/SwalUtils';



const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Nuevo Tecnico', href: '/users/new/tecnico' },
];

type RegisterForm = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    rol: number;
    provincia: string;
    canton: string;
    distrito: string;
    adress: string;
    phone: string;
    specialization: string;
    hiringdate: string;
    technician_signature: string;
    code: string;
    driver_license: string;
    vehicle_brand: string;
    vehicle_plate: string;
    social_security: string;
    personal_email: string;
    tech_type: string;
};


export default function Register() {
    const [data, setData] = useState<RegisterForm>({
        name: '',
        email: '',
        password: '12345678',
        password_confirmation: '12345678',
        rol: 3,
        provincia: '',
        canton: '',
        distrito: '',
        adress: '',
        phone: '',
        technician_signature: '',
        specialization: '',
        hiringdate: new Date().toISOString().split('T')[0],
        code: '',
        driver_license: '',
        vehicle_brand: '',
        vehicle_plate: '',
        social_security: '',
        personal_email: '',
        tech_type: '',
    });


    const techSigRef = useRef<SignatureCanvas>(null);

    const [files, setFiles] = useState<FileList | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [processing, setProcessing] = useState(false);

    const [newFiles, setNewFiles] = useState<File[]>([]);
    const [newFilesPreview, setNewFilesPreview] = useState<string[]>([]);
    const dropRef = useRef<HTMLDivElement>(null);

    const signatureDataTech = () => {
        if (!techSigRef.current || techSigRef.current.toData().length === 0) {
            showError('Falta firma del técnico');
            return;
        }
        const sig = JSON.stringify(techSigRef.current.toData());
        setData((prev) => ({ ...prev, technician_signature: sig }));
    };


    const getInitials = (value: string): string => {
        const initials = value
            .trim()
            .split(' ')
            .filter(Boolean)
            .slice(0, 3)
            .map((word) => word.charAt(0).toUpperCase())
            .join('');
        setData((prev) => ({ ...prev, code: initials }));
        return initials;
    };

    // ✅ FIX: función para manejar cambios del componente AdressForm
    const handleAdressChange = (field: string, value: string) => {
        setData((prev) => ({ ...prev, [field]: value }));
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
                setNewFiles((prev: File[]) => [...prev, ...Array.from(e.dataTransfer.files ?? [])]);
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

    // Cambiar handleFilesChange para agregar archivos
    const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setNewFiles((prev: File[]) => [...prev, ...Array.from(e.target.files ?? [])]);
        }
    };

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

    const submit: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        if (!data.technician_signature) {
            return showError('Falta la firma');
        } else {
            const formData = new FormData();
            Object.entries(data).forEach(([key, value]) => {
                formData.append(key, String(value));
            });
            newFiles.forEach((file: File) => formData.append('files[]', file));
            setProcessing(true);
            router.post(route('register'), formData, {
                onError: (e) => {
                    setErrors(e);
                    setProcessing(false);
                },
                onFinish: () => setProcessing(false),
                onSuccess: (page) => {
                    setErrors({});
                },
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Crear Usuario" />
            <div className="p-4">
                <h1 className="text-2xl font-bold mb-4">Registrar Técnico</h1>
                <form onSubmit={submit} className="grid grid-cols-2 gap-x-6 gap-y-4">
                    <div>
                        <Label htmlFor="name">Nombre Completo</Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => {
                                setData({ ...data, name: e.target.value });
                                getInitials(e.target.value);
                            }}
                            placeholder="Juan Perez"
                        />
                        <InputError message={errors.name} />
                    </div>

                    <div>
                        <Label htmlFor="email">Correo</Label>
                        <Input
                            id="email"
                            value={data.email}
                            onChange={(e) => setData({ ...data, email: e.target.value })}
                            placeholder="email@example.com"
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div>
                        <Label htmlFor="phone">Teléfono</Label>
                        <Input
                            id="phone"
                            value={data.phone}
                            onChange={(e) => setData({ ...data, phone: e.target.value })}
                            placeholder="8888-8888"
                        />
                        <InputError message={errors.phone} />
                    </div>

                    <div>
                        <Label htmlFor="specialization">Especialización</Label>
                        <Input
                            id="specialization"
                            value={data.specialization}
                            onChange={(e) => setData({ ...data, specialization: e.target.value })}
                            placeholder="Especialista en Refrigeración"
                        />
                        <InputError message={errors.specialization} />
                    </div>

                    <div>
                        <Label htmlFor="driver_license">Licencia de Conducir</Label>
                        <Input
                            id="driver_license"
                            value={data.driver_license}
                            onChange={(e) => setData({ ...data, driver_license: e.target.value })}
                            placeholder="C1234567"
                        />
                        <InputError message={errors.driver_license} />
                    </div>

                    <div>
                        <Label htmlFor="vehicle_brand">Marca del Vehículo</Label>
                        <Input
                            id="vehicle_brand"
                            value={data.vehicle_brand}
                            onChange={(e) => setData({ ...data, vehicle_brand: e.target.value })}
                            placeholder="Toyota"
                        />
                        <InputError message={errors.vehicle_brand} />
                    </div>

                    <div>
                        <Label htmlFor="vehicle_plate">Placa del Vehículo</Label>
                        <Input
                            id="vehicle_plate"
                            value={data.vehicle_plate}
                            onChange={(e) => setData({ ...data, vehicle_plate: e.target.value })}
                            placeholder="ABC-123"
                        />
                        <InputError message={errors.vehicle_plate} />
                    </div>

                    <div>
                        <Label htmlFor="social_security">Número de Seguro Social</Label>
                        <Input
                            id="social_security"
                            value={data.social_security}
                            onChange={(e) => setData({ ...data, social_security: e.target.value })}
                            placeholder="123456789"
                        />
                        <InputError message={errors.social_security} />
                    </div>

                    <div>
                        <Label htmlFor="personal_email">Correo Personal</Label>
                        <Input
                            id="personal_email"
                            value={data.personal_email}
                            onChange={(e) => setData({ ...data, personal_email: e.target.value })}
                            placeholder="correo@gmail.com"
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
                            values={{
                                provincia: data.provincia,
                                canton: data.canton,
                                distrito: data.distrito,
                            }}
                            onChange={handleAdressChange}
                            errors={errors}
                        />
                    </div>

                    <div className="col-span-2">
                        <Label htmlFor="adress">Dirección</Label>
                        <Input
                            id="adress"
                            value={data.adress}
                            onChange={(e) => setData({ ...data, adress: e.target.value })}
                            placeholder="100 metros al norte de la escuela"
                        />
                        <InputError message={errors.adress} />
                    </div>

                    <div>
                        <Label htmlFor="hiring_date">Fecha de Contratación</Label>
                        <input
                            type="date"
                            id="hiring_date"
                            value={data.hiringdate}
                            onChange={(e) => setData({ ...data, hiringdate: e.target.value })}
                            className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <InputError message={errors.hiringdate} />
                    </div>

                    <div>
                        <Label htmlFor="code">Código</Label>
                        <Input
                            id="code"
                            value={data.code}
                            onChange={(e) => setData({ ...data, code: e.target.value })}
                            placeholder="JP"
                        />
                        <InputError message={errors.code} />
                    </div>

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

                    <div className="col-span-2">
                        <Label className="mb-2 block">Documentos (CV, títulos, etc.)</Label>
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
                                <p className="text-xs text-gray-400">Formatos permitidos: PDF, JPG, PNG, DOCX, etc.</p>
                            </div>
                            <input
                                id="files"
                                type="file"
                                multiple
                                onChange={handleFilesChange}
                                className="hidden"
                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                            />
                        </div>
                        <InputError message={errors['files.*']} />
                    </div>
                    {newFiles.length > 0 && (
                        <div className="col-span-2">
                            <h4 className="font-semibold text-gray-700 mb-2">Archivos seleccionados:</h4>
                            <ul className="grid grid-cols-4 gap-4">
                                {newFiles.map((file: File, index: number) => (
                                    <li key={index} className="flex flex-col items-center gap-1 bg-gray-50 p-2 rounded shadow-sm relative">
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveNewFile(index)}
                                            className="absolute top-1 right-1 text-red-500 hover:text-red-700"
                                        >
                                            ❌
                                        </button>
                                        {file.type.startsWith('image/') ? (
                                            <img
                                                src={newFilesPreview[index]}
                                                alt={file.name}
                                                className="w-16 h-16 object-cover rounded"
                                            />
                                        ) : file.name.match(/\.(pdf)$/i) ? (
                                            <div className="w-16 h-16 bg-red-100 text-red-600 flex items-center justify-center rounded">PDF</div>
                                        ) : file.name.match(/\.(doc|docx)$/i) ? (
                                            <div className="w-16 h-16 bg-blue-100 text-blue-600 flex items-center justify-center rounded">DOC</div>
                                        ) : (
                                            <div className="w-16 h-16 bg-gray-200 text-center text-sm flex items-center justify-center rounded">📄</div>
                                        )}
                                        <span className="text-xs text-center max-w-[80px] truncate">{file.name}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className="col-span-2 mt-4 grid grid-cols-2 gap-x-6 gap-y-4">
                        <a href="/users/tecnicos">
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
            </div>
        </AppLayout>
    );
}
