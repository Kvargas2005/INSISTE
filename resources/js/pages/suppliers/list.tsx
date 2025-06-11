import React, { useEffect, useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Input } from '@headlessui/react';
import DropdownMenuList from '@/components/dropdownMenu';
import ModalFormCreate from '@/components/ModalFormCreate';
import ModalFormEdit from '@/components/ModalFormEdit';
import { ArrowUpDown } from 'lucide-react';
import Swal from 'sweetalert2';

interface Supplier {
    id: number;
    name: string;
    contact: string;
    tax_id?: string;
    assigned_seller?: string;
    sales_code?: string;
    email?: string;
    address?: string;
    status: number;
    description: string;
}

interface Props {
    suppliers: Supplier[];
}

export default function SupplierList({ suppliers }: Props) {
    const { flash } = usePage().props as unknown as { flash: { success?: string; error?: string } };
    const [filteredSuppliers, setFilteredSuppliers] = useState<Supplier[]>(suppliers);
    const [statusFilter, setStatusFilter] = useState<'none' | 'activeToInactive' | 'inactiveToActive'>('none');
    const [showModalCreate, setShowModalCreate] = useState(false);
    const [showModalEdit, setShowModalEdit] = useState(false);
    const [selectedId, setSelectedId] = useState<number>(0);

    useEffect(() => {
        setFilteredSuppliers(suppliers);
    }, [suppliers]);

    const handleFilterStatus = () => {
        const sorted = [...filteredSuppliers];
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
                setFilteredSuppliers(suppliers);
                setStatusFilter('none');
                return;
        }
        setFilteredSuppliers(sorted);
    };

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const term = event.target.value.toLowerCase();
        const filtered = suppliers.filter(s =>
            s.name.toLowerCase().includes(term) ||
            s.contact.toLowerCase().includes(term)
        );
        setFilteredSuppliers(filtered);
    };

    useEffect(() => {
        if (flash.success) {
            Swal.fire({ icon: 'success', title: 'Éxito', text: flash.success, timer: 3000, showConfirmButton: false });
        }
        if (flash.error) {
            Swal.fire({ icon: 'error', title: 'Error', text: flash.error, timer: 3000, showConfirmButton: false });
        }
    }, [flash]);

    return (
        <>
            <AppLayout breadcrumbs={[{ title: 'Proveedores', href: '/suppliers' }]}>
                <Head title="Proveedores" />
                <div className="flex justify-between m-4">
                    <div className="relative w-1/3">
                        <Input
                            type="text"
                            placeholder="Buscar proveedor"
                            onChange={handleSearch}
                            className="w-full px-4 py-2 border rounded dark:bg-gray-800 dark:text-white pl-10"
                        />
                    </div>
                    <button
                        onClick={() => setShowModalCreate(true)}
                        className="px-4 py-2 rounded text-white"
                        style={{ backgroundColor: 'black' }}
                    >
                        Crear
                    </button>
                </div>

                <div className="m-4 shadow rounded-lg overflow-x-auto pb-[100px] max-h-[500px] min-h-[500px]">
                    <table className="min-w-[1200px] w-full border-collapse text-sm text-gray-500 dark:text-gray-400">
                        <thead className="bg-gray-100 dark:bg-gray-700">
                            <tr>
                                <th className="text-left px-4 py-2">Nombre</th>
                                <th className="text-left px-4 py-2">Teléfono</th>
                                <th className="text-left px-4 py-2">Cédula Jurídica</th>
                                <th className="text-left px-4 py-2">Vendedor</th>
                                <th className="text-left px-4 py-2">Código Venta</th>
                                <th className="text-left px-4 py-2">Correo</th>
                                <th className="text-left px-4 py-2">Dirección</th>
                                <th className="text-left px-4 py-2">Descripción</th>
                                <th onClick={handleFilterStatus} className="text-center px-4 py-2 cursor-pointer">
                                    <div className="flex items-center justify-center gap-1">Estado <ArrowUpDown /></div>
                                </th>
                                <th className="px-4 py-2"></th>
                            </tr>
                        </thead>
                        <tbody className="text-left">
                            {filteredSuppliers.length > 0 ? (
                                filteredSuppliers.map((supplier) => (
                                    <tr key={supplier.id} className="border-t">
                                        <td className="px-4 py-2">{supplier.name}</td>
                                        <td className="px-4 py-2">{supplier.contact}</td>
                                        <td className="px-4 py-2">{supplier.tax_id || '-'}</td>
                                        <td className="px-4 py-2">{supplier.assigned_seller || '-'}</td>
                                        <td className="px-4 py-2">{supplier.sales_code || '-'}</td>
                                        <td className="px-4 py-2">{supplier.email || '-'}</td>
                                        <td className="px-4 py-2">{supplier.address || '-'}</td>
                                        <td className="px-4 py-2">{supplier.description}</td>
                                        <td className="px-4 py-2">
                                            <span className="px-5 py-1 rounded-full" style={{ backgroundColor: supplier.status === 1 ? '#a7d697' : '#d69797', color: supplier.status === 1 ? '#437b30' : '#873535', border: `1px solid ${supplier.status === 1 ? '#437b30' : '#873535'}` }}>
                                                {supplier.status === 1 ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-2">
                                            <DropdownMenuList
                                                id={supplier.id}
                                                status={supplier.status}
                                                routeEdit=""
                                                routeToggle="suppliers.toggleStatus"
                                                onOpenModal={() => {
                                                    setSelectedId(supplier.id);
                                                    setShowModalEdit(true);
                                                }}
                                            />
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={10} className="px-4 py-2">No se encontraron proveedores</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </AppLayout>

            {showModalCreate && (
                <ModalFormCreate
                    title="Registrar Proveedor"
                    postRoute="suppliers.createSupplier"
                    inputs={[
                        { name: 'name', label: 'Nombre', type: 'text' },
                        { name: 'contact', label: 'Teléfono', type: 'text' },
                        { name: 'tax_id', label: 'Cédula Jurídica', type: 'text' },
                        { name: 'assigned_seller', label: 'Vendedor Asignado', type: 'text' },
                        { name: 'sales_code', label: 'Código Venta', type: 'text' },
                        { name: 'email', label: 'Correo Electrónico', type: 'text' },
                        { name: 'address', label: 'Dirección', type: 'text' },
                        { name: 'description', label: 'Descripción', type: 'textarea' },
                    ]}
                    onClose={() => setShowModalCreate(false)}
                />
            )}
            {showModalEdit && (
                <ModalFormEdit
                    id={selectedId}
                    fetchRoute="suppliers.fetchSupplier"
                    postRoute="suppliers.editSupplier"
                    title="Editar Proveedor"
                    inputs={[
                        { name: 'name', label: 'Nombre', type: 'text' },
                        { name: 'contact', label: 'Teléfono', type: 'text' },
                        { name: 'tax_id', label: 'Cédula Jurídica', type: 'text' },
                        { name: 'assigned_seller', label: 'Vendedor Asignado', type: 'text' },
                        { name: 'sales_code', label: 'Código Venta', type: 'text' },
                        { name: 'email', label: 'Correo Electrónico', type: 'text' },
                        { name: 'address', label: 'Dirección', type: 'text' },
                        { name: 'description', label: 'Descripción', type: 'text' },
                    ]}
                    onClose={() => setShowModalEdit(false)}
                />
            )}
        </>
    );
}
