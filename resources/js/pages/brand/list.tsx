import React, { useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Input } from '@headlessui/react';
import ModalFormCreate from '@/components/ModalFormCreate';
import ModalFormEdit from '@/components/ModalFormEdit';
import DropdownMenuList from '@/components/dropdownMenu';

interface Brand {
    id: number;
    name: string;
    description: string;
    status: number;
    supplier: { name: string };
}

interface Supplier {
    id: number;
    name: string;
}

interface Props {
    brands: Brand[];
    suppliers: Supplier[];
}

export default function BrandList({ brands, suppliers }: Props) {
    const [filteredBrands, setFilteredBrands] = useState<Brand[]>(brands);
    const [showModalCreate, setShowModalCreate] = useState(false);
    const [showModalEdit, setShowModalEdit] = useState(false);
    const [selectedId, setSelectedId] = useState<number>(0);

    useEffect(() => {
        setFilteredBrands(brands);
    }, [brands]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const term = e.target.value.toLowerCase();
        const filtered = brands.filter((b) =>
            b.name.toLowerCase().includes(term) ||
            b.supplier.name.toLowerCase().includes(term)
        );
        setFilteredBrands(filtered);
    };

    return (
        <>
            <AppLayout breadcrumbs={[{ title: 'Marcas', href: '/brands' }]}>            
                <Head title="Marcas" />

                <div className="flex justify-between m-4">
                    <div className="relative w-1/3">
                        <Input
                            type="text"
                            placeholder="Buscar marca"
                            onChange={handleSearch}
                            className="w-full px-4 py-2 border rounded dark:bg-gray-800 dark:text-white pl-10"
                        />
                    </div>
                    <button
                        onClick={() => setShowModalCreate(true)}
                        className="px-4 py-2 rounded text-white bg-black"
                    >
                        Crear
                    </button>
                </div>

                <div className="m-4 shadow rounded-lg overflow-x-auto max-h-[500px] min-h-[500px]">
                    <table className="min-w-[800px] w-full border-collapse text-sm text-gray-500 dark:text-gray-400">
                        <thead className="bg-gray-100 dark:bg-gray-700">
                            <tr>
                                <th className="text-left px-4 py-2">Nombre</th>
                                <th className="text-left px-4 py-2">Descripción</th>
                                <th className="text-left px-4 py-2">Proveedor</th>
                                <th className="text-left px-4 py-2">Estado</th>
                                <th className="text-left px-4 py-2">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="text-left">
                            {filteredBrands.map((brand) => (
                                <tr key={brand.id} className="border-t">
                                    <td className="px-4 py-2">{brand.name}</td>
                                    <td className="px-4 py-2">{brand.description}</td>
                                    <td className="px-4 py-2">{brand.supplier.name}</td>
                                    <td className="px-4 py-2">
                                        <span className={`px-4 py-1 rounded-full text-xs font-semibold ${brand.status === 1 ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'}`}>
                                            {brand.status === 1 ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2">
                                        <DropdownMenuList
                                            id={brand.id}
                                            status={brand.status}
                                            routeEdit="brands.edit"
                                            routeToggle="brands.toggleStatus"
                                            onOpenModal={() => {
                                                setSelectedId(brand.id);
                                                setShowModalEdit(true);
                                            }}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </AppLayout>

            {showModalCreate && (
                <ModalFormCreate
                    title="Registrar Marca"
                    postRoute="brands.create"
                    inputs={[
                        { name: 'name', label: 'Nombre', type: 'text' },
                        { name: 'description', label: 'Descripción', type: 'textarea' },
                        { name: 'id_supplier', label: 'Proveedor', type: 'select', options: suppliers.map(s => ({ value: s.id, label: s.name })) },
                    ]}
                    onClose={() => setShowModalCreate(false)}
                />
            )}

            {showModalEdit && (
                <ModalFormEdit
                    id={selectedId}
                    fetchRoute="brands.fetch"
                    postRoute="brands.edit"
                    title="Editar Marca"
                    inputs={[
                        { name: 'name', label: 'Nombre', type: 'text' },
                        { name: 'description', label: 'Descripción', type: 'textarea' },
                        { name: 'id_supplier', label: 'Proveedor', type: 'select', options: suppliers.map(s => ({ value: s.id, label: s.name })) },
                    ]}
                    onClose={() => setShowModalEdit(false)}
                />
            )}
        </>
    );
}
