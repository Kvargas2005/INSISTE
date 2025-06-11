import React, { useEffect, useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Input } from '@headlessui/react';
import Swal from 'sweetalert2';
import { router } from '@inertiajs/react';

interface Technician {
    id: number;
    name: string;
    email: string;
    phone: string;
    specialization: string;
}

interface Props {
    technicians: Technician[];
}

export default function ListTech({ technicians }: Props) {
    const { flash } = usePage().props as unknown as { flash: { success?: string; error?: string } };
    const [filteredTechnicians, setFilteredTechnicians] = useState<Technician[]>(technicians);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        setFilteredTechnicians(technicians);
    }, [technicians]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        const filtered = technicians.filter((tech) =>
            tech.name.toLowerCase().includes(term) || tech.email.toLowerCase().includes(term)
        );
        setFilteredTechnicians(filtered);
    };


    useEffect(() => {
        if (flash.success) {
            Swal.fire({
                icon: 'success',
                title: 'Éxito',
                text: flash.success,
                timer: 3000,
                showConfirmButton: false,
            });
        }
        if (flash.error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: flash.error,
                timer: 3000,
                showConfirmButton: false,
            });
        }
    }, [flash]);

    const redirecttoInvTech = (id: number) => {
        // Use Inertia.post to navigate to the warehouse details page
        router.get(route('assingInvTech.listInv', { id }));
    }

    // Filtrar técnicos activos y desactivados
    const activeTechnicians = filteredTechnicians.filter(tech => (tech as any).status === 1 || (tech as any).status === undefined);
    const inactiveTechnicians = filteredTechnicians.filter(tech => (tech as any).status === 2);

    return (
        <AppLayout breadcrumbs={[{ title: 'Asignar Inventario', href: '/assingTech/TechList' }]}>
            <Head title="Lista de Técnicos" />
            <div className="flex justify-between m-4">
                <div className="relative w-1/3">
                    <Input
                        type="text"
                        placeholder="Buscar técnico"
                        value={searchTerm}
                        onChange={handleSearch}
                        className="w-full px-4 py-2 border rounded dark:bg-gray-800 dark:text-white pl-10"
                    />
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-4.35-4.35M16.65 10.65a6 6 0 11-12 0 6 6 0 0112 0z"
                        />
                    </svg>
                </div>

            </div>



            <div className="m-4 text-gray-600/25 dark:text-gray-300/25 text-center font-semibold">
                <p className='text-lg'>Técnicos existentes</p>
                <p className='text-sm'>Para acceder al inventario asignado, haga click en alguno</p>
            </div>

            <div className="m-4 shadow rounded-lg overflow-y-auto pb-[100px] overflow-x-auto max-h-[500px] min-h-[500px]">
                <table className="min-w-[600px] w-full border-collapse text-sm text-gray-500 dark:text-gray-400">
                    <thead className="bg-gray-100 dark:bg-gray-700">
                        <tr>
                            <th className="text-left px-4 py-2">Nombre</th>
                            <th className="text-left px-4 py-2">Correo</th>
                            <th className="text-left px-4 py-2">Teléfono</th>
                            <th className="text-left px-4 py-2">Especialización</th>
                        </tr>
                    </thead>
                    <tbody className="text-left">
                        {activeTechnicians.length > 0 ? (
                            activeTechnicians.map((tech) => (
                                <tr key={tech.id} className="border-t" onClick={() => redirecttoInvTech(tech.id)}>
                                    <td className="px-4 py-2">{tech.name}</td>
                                    <td className="px-4 py-2">{tech.email}</td>
                                    <td className="px-4 py-2">{tech.phone}</td>
                                    <td className="px-4 py-2">{tech.specialization}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="px-4 py-2 text-center">
                                    No se encontraron técnicos
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Técnicos desactivados */}
            <div className="m-4">
                <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">Técnicos desactivados</h2>
                <div className="shadow rounded-lg overflow-y-auto overflow-x-auto max-h-[300px] min-h-[80px]">
                    <table className="min-w-[600px] w-full border-collapse text-sm text-gray-400 dark:text-gray-500">
                        <thead className="bg-gray-100 dark:bg-gray-700">
                            <tr>
                                <th className="text-center px-4 py-2">Nombre</th>
                                <th className="text-center px-4 py-2">Correo</th>
                                <th className="text-center px-4 py-2">Teléfono</th>
                                <th className="text-center px-4 py-2">Especialización</th>
                            </tr>
                        </thead>
                        <tbody className="text-center">
                            {inactiveTechnicians.length > 0 ? (
                                inactiveTechnicians.map((tech) => (
                                    <tr key={tech.id} className="border-t bg-gray-50 dark:bg-gray-800 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700" onClick={() => redirecttoInvTech(tech.id)}>
                                        <td className="px-4 py-2">{tech.name}</td>
                                        <td className="px-4 py-2">{tech.email}</td>
                                        <td className="px-4 py-2">{tech.phone}</td>
                                        <td className="px-4 py-2">{tech.specialization}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="px-4 py-2 text-center">
                                        No hay técnicos desactivados
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}