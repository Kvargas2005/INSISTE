import React, { useEffect, useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button, Input } from '@headlessui/react';
import { ArrowUpDown } from 'lucide-react';
import Swal from 'sweetalert2';

interface Warehouse {
    id: number;
    name: string;
    adress: string;
}

interface Component {
    id: number;
    name: string;
    description: string;
    status: string;
    stock: number;
    assigned_stock: number;
}

interface Props {
    warehouse: Warehouse;
    components: Component[];
}

const ListComponents: React.FC<Props> = ({ warehouse, components }) => {
    const { flash } = usePage().props as unknown as { flash: { success?: string; error?: string } };
    const [filteredComponents, setFilteredComponents] = useState<Component[]>(components);
    const [statusFilter, setStatusFilter] = useState<'none' | 'activeToInactive' | 'inactiveToActive'>('none');

    useEffect(() => {
        setFilteredComponents(components);
    }, [components]);

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const searchTerm = event.target.value.toLowerCase();
        const filtered = components.filter((component) =>
            component.name.toLowerCase().includes(searchTerm) ||
            component.description.toLowerCase().includes(searchTerm)
        );
        setFilteredComponents(filtered);
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

    return (
        <AppLayout breadcrumbs={[{ title: 'Artículos', href: '/components' }]}>
            <Head title={`Almacén: ${warehouse.name}`} />
            <div className="m-4">
                <a href="/warehouseStock/list">
                    <button className="px-4 py-2 rounded text-white bg-black hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50">
                        Volver a bodegas
                    </button>
                </a>

            </div>
            <div className="m-4 text-gray-600/25 dark:text-gray-300/25 font-semibold">
                <p className='text-lg'>Almacén: {warehouse.name}</p>
                <p className='text-sm'>Dirección: {warehouse.adress}</p>
            </div>

            <div className="flex justify-between m-4">
                <div className="relative w-1/3">
                    <Input
                        type="text"
                        placeholder="Buscar artpiculos"
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
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M16.65 10.65a6 6 0 11-12 0 6 6 0 0112 0z" />
                    </svg>
                </div>
            </div>

            <div className="m-4 shadow rounded-lg overflow-y-auto pb-[100px] overflow-x-auto max-h-[500px] min-h-[500px]">
                <table className="min-w-[600px] w-full border-collapse text-sm text-gray-500 dark:text-gray-400">
                    <thead className="bg-gray-100 dark:bg-gray-700">
                        <tr>
                            <th className="text-center px-4 py-2">Nombre</th>
                            <th className="text-center px-4 py-2">Descripción</th>
                            <th className="text-center px-4 py-2">Stock sin Asignar</th>
                            <th className="text-center px-4 py-2">Stock Asignado</th>
                        </tr>
                    </thead>
                    <tbody className="text-center">
                        {filteredComponents.length > 0 ? (
                            filteredComponents.map((component) => (
                                <tr key={component.id} className="border-t">
                                    <td className="px-4 py-2">{component.name}</td>
                                    <td className="px-4 py-2">{component.description}</td>
                                    <td className='px-4 py-2'>{component.stock}</td>
                                    <td className='px-4 py-2'>{component.assigned_stock}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="px-4 py-2 text-center">
                                    No se encontraron artículos
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </AppLayout>
    );
};

export default ListComponents;