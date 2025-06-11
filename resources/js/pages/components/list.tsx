// ✅ list.tsx de ComponentList con filtros dinámicos con checkbox y funcionalidad reactiva

import React, { useEffect, useState } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Input } from '@headlessui/react';
import DropdownMenuList from '@/components/dropdownMenu';
import ModalFormCreate from '@/components/ModalFormCreate';
import ModalFormEdit from '@/components/ModalFormEdit';
import { ArrowUpDown, Plus } from 'lucide-react';
import Swal from 'sweetalert2';

interface Brand {
    id: number;
    name: string;
}

interface Family {
    id: number;
    name: string;
}

interface Supplier {
    id: number;
    name: string;
}

interface ComponentItem {
    id: number;
    id_family: number;
    id_brand: number;
    name: string | null;
    description: string | null;
    status: number;
    purchase_price: string | null;
    sale_price: string | null;
    part_n: string | null;
    family: Family;
    brand: Brand;
}

interface Props {
    components: ComponentItem[];
    brands: Brand[];
    families: Family[];
    suppliers: Supplier[];
}

interface FilterItem {
    key: string;
    value: string;
    active: boolean;
}

const filterOptions = [
    { label: 'Descripción', key: 'description' },
    { label: 'Código', key: 'name' },
    { label: 'Familia', key: 'family' },
    { label: 'Marca', key: 'brand' },
    { label: 'N° Parte', key: 'part_n' },
];

export default function ComponentList({ components, brands, families, suppliers }: Props) {
    const { flash } = usePage().props as any;

    const [filteredComponents, setFilteredComponents] = useState<ComponentItem[]>(components);
    const [statusFilter, setStatusFilter] = useState(true);
    const [showModalCreate, setShowModalCreate] = useState(false);
    const [showModalEdit, setShowModalEdit] = useState(false);
    const [showModalCreateBrand, setShowModalCreateBrand] = useState(false);
    const [brandsOptions, setBrandsOptions] = useState(brands.map(b => ({ value: b.id, label: b.name })));
    const [selectedId, setSelectedId] = useState<number>(0);
    const [filters, setFilters] = useState<FilterItem[]>([]);
    const [newFilterKey, setNewFilterKey] = useState<string>('');

    const handleCloseCreateBrand = () => {
        setShowModalCreateBrand(false);
        router.reload({ only: ['brands'] });
    };

    const handleAddFilter = () => {
        if (newFilterKey && !filters.find(f => f.key === newFilterKey)) {
            setFilters([...filters, { key: newFilterKey, value: '', active: true }]);
            setNewFilterKey('');
        }
    };

    const handleFilterChange = (key: string, value: string) => {
        const updated = filters.map(f => (f.key === key ? { ...f, value } : f));
        setFilters(updated);
    };

    const handleToggleFilter = (key: string) => {
        const updated = filters.map(f => (f.key === key ? { ...f, active: !f.active } : f));
        setFilters(updated);
    };

    useEffect(() => {
        let result = components.filter(c => (statusFilter ? c.status === 1 : true));

        filters.forEach(f => {
            if (!f.active || !f.value) return;

            const value = f.value.toLowerCase();
            if (f.key === 'description') result = result.filter(c => c.description?.toLowerCase().includes(value));
            if (f.key === 'name') result = result.filter(c => c.name?.toLowerCase().includes(value));
            if (f.key === 'part_n') result = result.filter(c => c.part_n?.toLowerCase().includes(value));
            if (f.key === 'family') result = result.filter(c => c.family.name.toLowerCase().includes(value));
            if (f.key === 'brand') result = result.filter(c => c.brand.name.toLowerCase().includes(value));
        });

        setFilteredComponents(result);
    }, [components, filters, statusFilter]);

    useEffect(() => {
        setBrandsOptions(brands.map(b => ({ value: b.id, label: b.name })));
    }, [brands]);

    useEffect(() => {
        if (flash.success) Swal.fire({ icon: 'success', title: 'Éxito', text: flash.success, timer: 3000, showConfirmButton: false });
        if (flash.error) Swal.fire({ icon: 'error', title: 'Error', text: flash.error, timer: 3000, showConfirmButton: false });
    }, [flash]);

    return (
        <AppLayout breadcrumbs={[{ title: 'Artículos', href: '/components' }]}>
            <Head title="Artículos" />

            <div className="flex justify-between items-start m-4 gap-4">
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <input type="checkbox" checked={statusFilter} onChange={() => setStatusFilter(!statusFilter)} />
                        <span>Estado</span>
                        <span className="text-xs bg-gray-300 px-2 rounded">Activo</span>
                    </div>
                    {filters.map(filter => (
                        <div key={filter.key} className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={filter.active}
                                onChange={() => handleToggleFilter(filter.key)}
                            />
                            <span>{filterOptions.find(f => f.key === filter.key)?.label}</span>
                            <input
                                type="text"
                                value={filter.value}
                                onChange={e => handleFilterChange(filter.key, e.target.value)}
                                className="border rounded px-2 py-1 text-sm"
                            />
                        </div>
                    ))}
                </div>

                <div className="flex items-center gap-2">
                    <select
                        value={newFilterKey}
                        onChange={e => setNewFilterKey(e.target.value)}
                        className="border px-2 py-1 text-sm rounded"
                    >
                        <option value="">Añadir filtro</option>
                        {filterOptions.map(opt => (
                            <option key={opt.key} value={opt.key} disabled={filters.some(f => f.key === opt.key)}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                    <button onClick={handleAddFilter} className="text-sm px-2 py-1 bg-black text-white rounded">
                        +
                    </button>

                    <button onClick={() => setShowModalCreate(true)} className="ml-4 px-4 py-2 rounded text-white bg-black">
                        Crear
                    </button>
                    <button onClick={() => window.location.href = '/upload-excel/page'} className="px-4 py-2 rounded text-white bg-black">
                        Subir Excel
                    </button>
                </div>
            </div>

            <div className="m-4 shadow rounded-lg overflow-x-auto pb-10">
                <table className="min-w-[600px] w-full border-collapse text-sm text-gray-500 dark:text-gray-400">
                    <thead className="bg-gray-100 dark:bg-gray-700">
                        <tr>
                            <th className="text-left px-4 py-2">Descripción</th>
                            <th className="text-left px-4 py-2">Código</th>
                            <th className="text-left px-4 py-2">Familia</th>
                            <th className="text-left px-4 py-2">Marca</th>
                            <th className="text-left px-4 py-2">Estado</th>
                            <th className="text-left px-4 py-2">N° Parte</th>
                            <th className="text-left px-4 py-2"></th>
                        </tr>
                    </thead>
                    <tbody className="text-left">
                        {filteredComponents.map(component => (
                            <tr key={component.id} className="border-t">
                                <td className="px-4 py-2">{component.description}</td>
                                <td className="px-4 py-2">{component.name}</td>
                                <td className="px-4 py-2">{component.family.name}</td>
                                <td className="px-4 py-2">{component.brand.name}</td>
                                <td className="px-4 py-2">
                                    <span className="px-4 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: component.status === 1 ? '#a7d697' : '#d69797', color: component.status === 1 ? '#437b30' : '#873535', border: `1px solid ${component.status === 1 ? '#437b30' : '#873535'}` }}>
                                        {component.status === 1 ? 'Activo' : 'Inactivo'}
                                    </span>
                                </td>
                                <td className="px-4 py-2">{component.part_n}</td>
                                <td className="px-4 py-2">
                                    <DropdownMenuList
                                        id={component.id}
                                        status={component.status}
                                        routeEdit=""
                                        routeToggle="components.toggleStatus"
                                        onOpenModal={() => {
                                            setSelectedId(component.id);
                                            setShowModalEdit(true);
                                        }}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModalCreate && (
                <>
                    <ModalFormCreate
                        title="Registrar Artículo"
                        postRoute="components.createComponent"
                        inputs={[
                            {
                                name: 'id_brand',
                                label: 'Marca',
                                type: 'select',
                                options: brandsOptions,
                                extra: (
                                    <button
                                        type="button"
                                        onClick={() => setShowModalCreateBrand(true)}
                                        className="ml-2 px-2 py-1 bg-black text-white rounded hover:bg-gray-800"
                                        title="Agregar nueva marca"
                                    >
                                        <Plus size={16} />
                                    </button>
                                ),
                            },
                            { name: 'id_family', label: 'Familia', type: 'select', options: families.map((f) => ({ value: f.id, label: f.name })) },
                            { name: 'part_n', label: 'No. de Parte', type: 'text' },
                            { name: 'name', label: 'Código', type: 'text' },
                            { name: 'description', label: 'Descripción', type: 'textarea' },
                            { name: 'purchase_price', label: 'Costo de Compra', type: 'text' },
                            { name: 'sale_price', label: 'Precio Venta', type: 'text' },
                        ]}
                        onClose={() => setShowModalCreate(false)}
                    />

                    {showModalCreateBrand && (
                        <ModalFormCreate
                            title="Registrar Marca"
                            postRoute="brands.create"
                            inputs={[
                                { name: 'name', label: 'Nombre', type: 'text' },
                                { name: 'description', label: 'Descripción', type: 'textarea' },
                                {
                                    name: 'id_supplier',
                                    label: 'Proveedor',
                                    type: 'select',
                                    options: suppliers.map((s) => ({ value: s.id, label: s.name })),
                                },
                            ]}
                            onClose={handleCloseCreateBrand}
                        />
                    )}
                </>
            )}

            {showModalEdit && (
                <ModalFormEdit
                    id={selectedId}
                    fetchRoute="components.fetchComponent"
                    postRoute="components.editComponent"
                    title="Editar Artículo"
                    inputs={[
                        { name: 'id_brand', label: 'Marca', type: 'select', options: brands.map((b) => ({ value: b.id, label: b.name })) },
                        { name: 'id_family', label: 'Familia', type: 'select', options: families.map((f) => ({ value: f.id, label: f.name })) },
                        { name: 'part_n', label: 'No. de Parte', type: 'text' },
                        { name: 'name', label: 'Código', type: 'text' },
                        { name: 'description', label: 'Descripción', type: 'textarea' },
                        { name: 'purchase_price', label: 'Precio Compra', type: 'text' },
                        { name: 'sale_price', label: 'Precio Venta', type: 'text' },
                    ]}
                    onClose={() => setShowModalEdit(false)}
                />
            )}
        </AppLayout>
    );
}
