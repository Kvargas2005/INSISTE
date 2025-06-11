import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Input } from '@headlessui/react';
import ModalFormCreate from '@/components/ModalFormCreate';
import { Button } from '@/components/ui/button';

interface Customer {
    id: number;
    name: string;
    phone: string;
    parent_company: string;
    status_label: string;
    is_late?: boolean; // <- AÑADIR ESTA LÍNEA
}

interface Technician {
    id: number;
    name: string;
}

interface Props {
    customers: Customer[];
    technicians: Technician[];
}

export default function AssignCustomerTech({ customers, technicians }: Props) {
    const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>(customers);
    const [selectedCustomers, setSelectedCustomers] = useState<number[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [individualCustomerId, setIndividualCustomerId] = useState<number | null>(null);

    useEffect(() => {
        setFilteredCustomers(customers);
    }, [customers]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const term = e.target.value.toLowerCase();
        const filtered = customers.filter((c) =>
            c.name.toLowerCase().includes(term) ||
            c.parent_company.toLowerCase().includes(term)
        );
        setFilteredCustomers(filtered);
    };

    const toggleSelectCustomer = (id: number) => {
        setSelectedCustomers(prev =>
            prev.includes(id) ? prev.filter(cid => cid !== id) : [...prev, id]
        );
    };

    return (
        <>
            <AppLayout breadcrumbs={[{ title: 'Asignar Clientes a Técnico', href: '/assignCustomerTech' }]}>               <Head title="Asignar Clientes" />

                <div className="flex justify-between m-4">
                    <div className="flex border-b mb-4 space-x-4">
                        <a
                            href="/assignCustomerTech"
                            className={`pb-2 border-b-2 text-sm font-medium ${window.location.pathname === '/assignCustomerTech'
                                ? 'border-blue-600 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-blue-600'
                                }`}
                        >
                            Asignar
                        </a>
                        <a
                            href="/assignCustomerTech/view"
                            className={`pb-2 border-b-2 text-sm font-medium ${window.location.pathname === '/assignCustomerTech/view'
                                ? 'border-blue-600 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-blue-600'
                                }`}
                        >
                            Asignadas
                        </a>
                    </div>
                    <div className="relative w-1/3">
                        <Input
                            type="text"
                            placeholder="Buscar cliente"
                            onChange={handleSearch}
                            className="w-full px-4 py-2 border rounded dark:bg-gray-800 dark:text-white pl-10"
                        />
                    </div>

                    <Button
                        onClick={() => {
                            setShowModal(true);
                            setIndividualCustomerId(null);
                        }}
                        className="bg-blue-600 text-white"
                        disabled={selectedCustomers.length === 0}
                    >
                        Asignar
                    </Button>
                </div>

                <div className="m-4 shadow rounded-lg overflow-x-auto max-h-[500px] min-h-[500px]">
                    <table className="min-w-[1000px] w-full border-collapse text-sm text-gray-500 dark:text-gray-400">
                        <thead className="bg-gray-100 dark:bg-gray-700">
                            <tr>
                                <th className="text-left px-4 py-2">Seleccionar</th>
                                <th className="text-left px-4 py-2">Cliente</th>
                                <th className="text-left px-4 py-2">Casa Matriz</th>
                                <th className="text-left px-4 py-2">Teléfono</th>
                                <th className="text-left px-4 py-2">Estado</th>
                                <th className="text-left px-4 py-2">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="text-left">
                            {filteredCustomers.length > 0 ? (
                                filteredCustomers.map((customer) => (
                                    <tr key={customer.id} className="border-t">
                                        <td className="px-4 py-2">
                                            <input
                                                type="checkbox"
                                                checked={selectedCustomers.includes(customer.id)}
                                                onChange={() => toggleSelectCustomer(customer.id)}
                                            />
                                        </td>
                                        <td className="px-4 py-2">{customer.name}</td>
                                        <td className="px-4 py-2">{customer.parent_company}</td>
                                        <td className="px-4 py-2">{customer.phone}</td>
                                        <td className="px-4 py-2">
                                            {customer.is_late ? (
                                                <span className="px-4 py-1 rounded-full text-red-700 bg-red-100 text-xs font-semibold">
                                                    Atrasado
                                                </span>
                                            ) : customer.status_label === 'Asignado' ? (
                                                <span className="px-4 py-1 rounded-full text-yellow-700 bg-yellow-100 text-xs font-semibold">
                                                    Asignado
                                                </span>
                                            ) : (
                                                <span className="px-4 py-1 rounded-full text-green-700 bg-green-100 text-xs font-semibold">
                                                    Sin asignar
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-2">
                                            <Button
                                                className="bg-blue-600 text-white"
                                                onClick={() => {
                                                    setShowModal(true);
                                                    setIndividualCustomerId(customer.id);
                                                }}
                                            >
                                                Asignar
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-4 py-2">No se encontraron clientes</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </AppLayout>

            {showModal && (
                <ModalFormCreate
                    title="Asignar Técnico"
                    postRoute="assignCustomerTech.create"
                    inputs={[
                        {
                            name: 'id_technician',
                            label: 'Técnico',
                            type: 'select',
                            options: technicians.map(t => ({ value: t.id, label: t.name }))
                        },
                        { name: 'alert_days', label: 'Aviso de alerta (días)', type: 'text' },
                        { name: 'assign_date', label: 'Fecha de asignación', type: 'datetime-local' },
                        { name: 'comments', label: 'Notas (opcional)', type: 'textarea' }, // ✅ NUEVO
                    ]}
                    extraData={{ selectedCustomers: individualCustomerId ? [individualCustomerId] : selectedCustomers }}
                    onClose={() => {
                        setShowModal(false);
                        setSelectedCustomers([]);
                        setIndividualCustomerId(null);
                    }}
                />

            )}
        </>
    );
}
