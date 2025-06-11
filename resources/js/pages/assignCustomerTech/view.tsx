import React, { useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Input } from '@headlessui/react';
import ModalFormEdit from '@/components/ModalFormEdit';
import { Button } from '@/components/ui/button';
import DropdownMenuList from '@/components/dropdownMenu';

interface Assignment {
    id: number;
    id_technician: number;
    id_customer: number;
    comments: string;
    alert_days: number;
    assign_date: string;
    start_date: string | null; // 👈 Agregar esto
    end_date: string | null;   // (opcional)
    tech_status: number;
    status: number;
    technician: { name: string };
    customer: { name: string };
  }
  


interface Technician {
    id: number;
    name: string;
}

interface Customer {
    id: number;
    name: string;
}

interface Props {
    assignments: Assignment[];
    technicians: Technician[];
    customers: Customer[];
}

export default function ViewAssignments({ assignments, customers, technicians }: Props) {
    const [filteredAssignments, setFilteredAssignments] = useState<Assignment[]>(assignments);
    const [showModalEdit, setShowModalEdit] = useState(false);
    const [selectedId, setSelectedId] = useState<number>(0);



    useEffect(() => {
        setFilteredAssignments(assignments);
    }, [assignments]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const term = e.target.value.toLowerCase();
        const filtered = assignments.filter((a) =>
            a.customer.name.toLowerCase().includes(term) ||
            a.technician.name.toLowerCase().includes(term)
        );
        setFilteredAssignments(filtered);
    };

    return (
        <>
            <AppLayout breadcrumbs={[{ title: 'Asignaciones', href: '/assignCustomerTech/view' }]}>
                <Head title="Asignaciones" />

                {/* BARRA DE NAVEGACION: ASIGNAR / ASIGNADAS */}
                <div className="m-4 flex space-x-8 border-b pb-2">
                    <a
                        href="/assignCustomerTech"
                        className={`text-sm font-medium ${window.location.pathname === '/assignCustomerTech'
                            ? 'text-blue-600 border-b-2 border-blue-600 pb-1'
                            : 'text-gray-500 hover:text-blue-600'
                            }`}
                    >
                        Asignar
                    </a>
                    <a
                        href="/assignCustomerTech/view"
                        className={`text-sm font-medium ${window.location.pathname === '/assignCustomerTech/view'
                            ? 'text-blue-600 border-b-2 border-blue-600 pb-1'
                            : 'text-gray-500 hover:text-blue-600'
                            }`}
                    >
                        Asignadas
                    </a>
                </div>

                {/* BUSCADOR */}
                <div className="m-4 flex justify-start">
                    <div className="relative w-1/3">
                        <Input
                            type="text"
                            placeholder="Buscar asignación"
                            onChange={handleSearch}
                            className="w-full px-4 py-2 border rounded dark:bg-gray-800 dark:text-white pl-10"
                        />
                    </div>
                </div>

                {/* TABLA */}
                <div className="m-4 shadow rounded-lg overflow-x-auto max-h-[500px] min-h-[500px]">
                    <table className="min-w-[800px] w-full border-collapse text-sm text-gray-500 dark:text-gray-400">
                        <thead className="bg-gray-100 dark:bg-gray-700">
                            <tr>
                                <th className="text-left px-4 py-2">Cliente</th>
                                <th className="text-left px-4 py-2">Técnico</th>
                                <th className="text-left px-4 py-2">Fecha de Asignación</th>
                                <th className="text-left px-4 py-2">Fecha Inicio</th>
                                <th className="text-left px-4 py-2">Notas</th>
                                <th className="text-left px-4 py-2">Estado</th>
                                <th className="text-left px-4 py-2">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="text-left">
                            {filteredAssignments.length > 0 ? (
                                filteredAssignments.map((assignment) => (
                                    <tr key={assignment.id} className="border-t">
                                        <td className="px-4 py-2">{assignment.customer.name}</td>
                                        <td className="px-4 py-2">{assignment.technician.name}</td>
                                        <td className="px-4 py-2">
                                            {new Date(assignment.assign_date).toLocaleString()}
                                        </td>
                                        <td className="px-4 py-2">
                                            {assignment.start_date
                                                ? new Date(assignment.start_date).toLocaleString()
                                                : 'Sin iniciar'}
                                        </td>
                                        <td className="px-4 py-2">{assignment.comments || '—'}</td>
                                        <td className="px-4 py-2">
                                            {assignment.status === 2 ? (
                                                <span className="px-4 py-1 rounded-full text-red-700 bg-red-100 text-xs font-semibold">
                                                    Cancelado
                                                </span>
                                            ) : assignment.tech_status === 1 ? (
                                                <span className="px-4 py-1 rounded-full text-green-700 bg-green-100 text-xs font-semibold">
                                                    Pendiente
                                                </span>
                                            ) : assignment.tech_status === 2 ? (
                                                <span className="px-4 py-1 rounded-full text-yellow-700 bg-yellow-100 text-xs font-semibold">
                                                    En curso
                                                </span>
                                            ) : (
                                                <span className="px-4 py-1 rounded-full text-pink-700 bg-pink-100 text-xs font-semibold">
                                                    Finalizado
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-2">
                                            <DropdownMenuList
                                                id={assignment.id}
                                                status={assignment.status}
                                                routeEdit=""
                                                routeToggle="assignCustomerTech.toggleStatus"
                                                onOpenModal={() => {
                                                    setSelectedId(assignment.id);
                                                    setShowModalEdit(true);
                                                }}
                                            />
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-4 py-2">No hay asignaciones</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

            </AppLayout>

            {/* MODAL PARA EDITAR */}
            {showModalEdit && (
                <ModalFormEdit
                    id={selectedId}
                    fetchRoute="assignCustomerTech.fetch"
                    postRoute="assignCustomerTech.edit"
                    title="Editar Asignación"
                    inputs={[
                        {
                            name: 'id_customer',
                            label: 'Cliente',
                            type: 'select',
                            options: customers.map((customer) => ({
                                value: customer.id,
                                label: customer.name,
                            })),
                        },
                        {
                            name: 'id_technician',
                            label: 'Técnico',
                            type: 'select',
                            options: technicians.map((technician) => ({
                                value: technician.id,
                                label: technician.name,
                            })),
                        },
                        { name: 'assign_date', label: 'Fecha de asignación', type: 'datetime-local' },
                        { name: 'comments', label: 'Notas', type: 'textarea' }, // 👈 NUEVO CAMPO
                    ]}
                    onClose={() => setShowModalEdit(false)}
                />

            )}
        </>
    );
}
