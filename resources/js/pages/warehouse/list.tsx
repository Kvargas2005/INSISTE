import React, { useEffect, useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Input } from '@headlessui/react';
import DropdownMenuList from '@/components/dropdownMenu';
import ModalFormCreate from '@/components/ModalFormCreate';
import ModalFormEdit from '@/components/ModalFormEdit';
import { ArrowUpDown } from 'lucide-react';
import Swal from 'sweetalert2';

interface Warehouse {
    id: number;
    name: string;
    adress: string;
    status: number;
}

interface Props {
    warehouses: Warehouse[];
}

export default function WarehouseList({ warehouses }: Props) {
    const { flash } = usePage().props as unknown as { flash: { success?: string; error?: string } };
    const [filteredWarehouses, setFilteredWarehouses] = useState<Warehouse[]>(warehouses);
    const [statusFilter, setStatusFilter] = useState<'none' | 'activeToInactive' | 'inactiveToActive'>('none');
    const [showModalCreate, setShowModalCreate] = useState(false);
    const [showModalEdit, setShowModalEdit] = useState(false); // Estado del modal
    const [selectedId, setSelectedId] = React.useState<number>(0);

    useEffect(() => {
        setFilteredWarehouses(warehouses);
    }, [warehouses]);

    const handleFilterStatus = () => {
        const sorted = [...filteredWarehouses];
        switch (statusFilter) {
            case 'none':
                sorted.sort((a, b) => b.status - a.status);
                setStatusFilter('activeToInactive');
                break;
            case 'activeToInactive':
                sorted.sort((a, b) => a.status - b.status);
                setStatusFilter('inactiveToActive');
                break;
            case 'inactiveToActive':
                setFilteredWarehouses(warehouses);
                setStatusFilter('none');
                break;
        }
        setFilteredWarehouses(sorted);
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const term = e.target.value.toLowerCase();
        const filtered = warehouses.filter((item) =>
            item.name.toLowerCase().includes(term) ||
            item.adress.toLowerCase().includes(term)
        );
        setFilteredWarehouses(filtered);
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
        <>
            <AppLayout breadcrumbs={[{ title: 'Bodegas', href: '/warehouse' }]}>
                <Head title="Bodegas" />
                <div className="flex justify-between m-4">
                    <div className="relative w-1/3">
                        <Input
                            type="text"
                            placeholder="Buscar bodega"
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

                    <button
                        onClick={() => setShowModalCreate(true)}
                        className="px-4 py-2 rounded text-white"
                        style={{ backgroundColor: 'black' }}
                    >
                        Crear
                    </button>
                </div>

                <div className="m-4 shadow rounded-lg overflow-y-auto pb-[100px] overflow-x-auto max-h-[500px] min-h-[500px]">
                    <table className="min-w-[600px] w-full border-collapse text-sm text-gray-500 dark:text-gray-400">
                        <thead className="bg-gray-100 dark:bg-gray-700">
                            <tr>
                                <th className="text-left px-4 py-2">Nombre</th>
                                <th className="text-left px-4 py-2">Dirección</th>
                                <th onClick={handleFilterStatus} className="text-center px-4 py-2 cursor-pointer">
                                    <div className="flex items-center justify-left gap-1">
                                        Estado
                                        <ArrowUpDown />
                                    </div>
                                </th>
                                <th className="px-4 py-2"></th>
                            </tr>
                        </thead>
                        <tbody className="text-left">
                            {filteredWarehouses.length > 0 ? (
                                filteredWarehouses.map((warehouse) => (
                                    <tr key={warehouse.id} className="border-t">
                                        <td className="px-4 py-2">{warehouse.name}</td>
                                        <td className="px-4 py-2">{warehouse.adress}</td>
                                        <td className="px-4 py-2">
                                            <span
                                                className="px-5 py-1 rounded-full"
                                                style={{
                                                    backgroundColor: warehouse.status === 1 ? '#a7d697' : '#d69797',
                                                    color: warehouse.status === 1 ? '#437b30' : '#873535',
                                                    border: `1px solid ${warehouse.status === 1 ? '#437b30' : '#873535'}`,
                                                }}
                                            >
                                                {warehouse.status === 1 ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-2">
                                            <DropdownMenuList
                                                id={warehouse.id}
                                                status={warehouse.status}
                                                routeEdit=""  // Vacío para abrir modal
                                                routeToggle="warehouse.toggleStatus"
                                                onOpenModal={() => {
                                                    setSelectedId(warehouse.id);
                                                    setShowModalEdit(true);
                                                }}
                                            />
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="px-4 py-2 text-center">
                                        No se encontraron bodegas
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </AppLayout>

            {showModalCreate && (
                <ModalFormCreate
                    title="Registrar Bodega"
                    postRoute="warehouse.createWarehouse"
                    inputs={[
                        { name: 'name', label: 'Nombre', type: 'text' },
                        { name: 'adress', label: 'Dirección', type: 'text' },
                    ]}
                    onClose={() => setShowModalCreate(false)}
                />
            )}
            {showModalEdit && (
                <ModalFormEdit
                    id={selectedId}
                    fetchRoute="warehouse.fetchWarehouse" // GET: devuelve { data: { name: 'Adolf', active: true, ... } }
                    postRoute="warehouse.editWarehouse" // POST o PUT
                    title="Editar Bodega"
                    inputs={[
                        { name: 'name', label: 'Nombre', type: 'text' },
                        { name: 'adress', label: 'Dirección', type: 'text' },
                    ]}
                    onClose={() => setShowModalEdit(false)}
                />
            )}
        </>
    );
}
