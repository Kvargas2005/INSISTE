import { type BreadcrumbItem } from '@/types';
import React, { useEffect } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button, Input, Menu } from '@headlessui/react';
import Swal from 'sweetalert2';
import { MoreVertical } from 'lucide-react';

interface Acta {
    id: number;
    code: string;
    project: string;
    service_type: string;
    delivery_class: string;
    job_type: string;
    visit_type: string;
    start_time: string;
    client: { name: string };
    creator: { name: string };
    status: number;
    is_open: number;
    contact: string;
}

interface Props {
    actas: Acta[];
    canCreate: boolean;
}

interface FilterItem {
    key: string;
    value: string;
    active: boolean;
}

const filterOptions = [
    { label: 'Código', key: 'code' },
    { label: 'Cliente', key: 'client' },
    { label: 'Técnico', key: 'creator' },
    { label: 'Proyecto', key: 'project' },
    { label: 'Tipo de Servicio', key: 'service_type' },
    { label: 'Clase de Entrega', key: 'delivery_class' },
    { label: 'Tipo de Trabajo', key: 'job_type' },
    { label: 'Tipo de Visita', key: 'visit_type' },
    { label: 'Fecha', key: 'start_time' },
];

export default function ActasList({ actas, canCreate }: Props) {
    const { flash } = usePage().props as unknown as { flash: { success?: string; error?: string } };

    const [filters, setFilters] = React.useState<FilterItem[]>([]);
    const [newFilterKey, setNewFilterKey] = React.useState<string>('');
    const [filteredActas, setFilteredActas] = React.useState<Acta[]>(actas);

    useEffect(() => {
        if (flash.success) {
            Swal.fire({ icon: 'success', title: 'Éxito', text: flash.success, timer: 3000, showConfirmButton: false });
        }
        if (flash.error) {
            Swal.fire({ icon: 'error', title: 'Error', text: flash.error, timer: 3000, showConfirmButton: false });
        }
    }, [flash]);

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
    const { auth } = usePage<{ auth: { user: { id_role: number } } }>().props;


    useEffect(() => {
        let result = actas;

        filters.forEach(filter => {
            if (!filter.active || !filter.value) return;

            const valueLower = filter.value.toLowerCase();

            switch (filter.key) {
                case 'code':
                    result = result.filter(a => a.code.toLowerCase().includes(valueLower));
                    break;
                case 'client':
                    result = result.filter(a => a.client.name.toLowerCase().includes(valueLower));
                    break;
                case 'creator':
                    result = result.filter(a => a.creator.name.toLowerCase().includes(valueLower));
                    break;
                case 'project':
                    result = result.filter(a => a.project.toLowerCase().includes(valueLower));
                    break;
                case 'service_type':
                    result = result.filter(a => a.service_type.toLowerCase().includes(valueLower));
                    break;
                case 'delivery_class':
                    result = result.filter(a => a.delivery_class.toLowerCase().includes(valueLower));
                    break;
                case 'job_type':
                    result = result.filter(a => a.job_type.toLowerCase().includes(valueLower));
                    break;
                case 'visit_type':
                    result = result.filter(a => a.visit_type.toLowerCase().includes(valueLower));
                    break;
                case 'start_time':
                    // Comparar sólo la parte de fecha (sin hora)
                    result = result.filter(a => {
                        const filterDate = new Date(filter.value).toISOString().slice(0, 10);
                        const actaDate = new Date(a.start_time).toISOString().slice(0, 10);
                        return actaDate === filterDate;
                    });
                    break;

                default:
                    break;
            }
        });

        setFilteredActas(result);
    }, [filters, actas]);

    // Handler para cerrar acta
    const handleCloseActa = (id: number) => {
        Swal.fire({
            title: '¿Cerrar acta?',
            text: '¿Estás seguro de que deseas cerrar esta acta? Esta acción no se puede deshacer.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, cerrar',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                router.post(`/actas/close/${id}`, {}, {
                    onSuccess: () => Swal.fire('Cerrada', 'El acta ha sido cerrada.', 'success'),
                });
            }
        });
    };

    // Handler para abrir acta
    const handleOpenActa = (id: number) => {
        Swal.fire({
            title: '¿Abrir acta?',
            text: '¿Estás seguro de que deseas abrir esta acta? Esta acción no se puede deshacer.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, abrir',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                router.post(`/actas/open/${id}`, {}, {
                    onSuccess: () => Swal.fire('Abierta', 'El acta ha sido abierta.', 'success'),
                });
            }
        });
    };

    // Handler para editar acta
    const handleEditActa = (id: number) => {
        router.visit(`/actas/edit/${id}`);
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Actas', href: '/actas/list' }]}>
            <Head title="Actas" />

            {/* FILTROS DINÁMICOS */}
            <div className="flex justify-between items-center m-4 gap-4">
                <div className="space-y-2 max-w-xl">
                    {filters.map(filter => {
                        const isDate = filter.key === 'start_time';

                        return (
                            <div key={filter.key} className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={filter.active}
                                    onChange={() => handleToggleFilter(filter.key)}
                                    className="cursor-pointer"
                                />
                                <label className="capitalize select-none cursor-pointer" htmlFor={filter.key}>
                                    {filterOptions.find(f => f.key === filter.key)?.label}
                                </label>
                                {isDate ? (
                                    <input
                                        id={filter.key}
                                        type="date"
                                        value={filter.value}
                                        onChange={e => handleFilterChange(filter.key, e.target.value)}
                                        className="border rounded px-2 py-1 text-sm w-full max-w-xs"
                                    />
                                ) : (
                                    <input
                                        id={filter.key}
                                        type="text"
                                        value={filter.value}
                                        onChange={e => handleFilterChange(filter.key, e.target.value)}
                                        className="border rounded px-2 py-1 text-sm w-full max-w-xs"
                                        placeholder={`Filtrar por ${filterOptions.find(f => f.key === filter.key)?.label}`}
                                    />
                                )}
                            </div>
                        );
                    })}

                </div>

                <div className="flex items-center gap-2">
                    <select
                        value={newFilterKey}
                        onChange={e => setNewFilterKey(e.target.value)}
                        className="border px-2 py-1 text-sm rounded"
                    >
                        <option value="">Añadir filtro</option>
                        {filterOptions.map(opt => (
                            <option
                                key={opt.key}
                                value={opt.key}
                                disabled={filters.some(f => f.key === opt.key)}
                            >
                                {opt.label}
                            </option>
                        ))}
                    </select>
                    <button
                        onClick={handleAddFilter}
                        className="text-sm px-2 py-1 bg-black text-white rounded"
                    >
                        +
                    </button>
                </div>
            </div>

            {canCreate && (
                <div className="m-4 flex justify-end">
                    <Button
                        className="px-4 py-2 rounded"
                        style={{ backgroundColor: 'black', color: 'white' }}
                        onClick={() => router.visit('/actas/create')}
                    >
                        Crear Acta
                    </Button>
                </div>
            )}

            {/* TABLA CON RESULTADOS FILTRADOS */}
            <div className="m-4 shadow rounded-lg overflow-y-auto pb-[100px] overflow-x-auto max-h-[500px] min-h-[500px]">
                <table className="min-w-[900px] w-full border-collapse text-sm text-gray-500 dark:text-gray-400">
                    <thead className="bg-gray-100 dark:bg-gray-700">
                        <tr>
                            <th className="text-left px-4 py-2">Código</th>
                            <th className="text-left px-4 py-2">Cliente</th>
                            <th className="text-left px-4 py-2">Técnico</th>
                            <th className="text-left px-4 py-2">Contacto</th>
                            <th className="text-left px-4 py-2">Tipo Visita</th>
                            <th className="text-left px-4 py-2">Fecha</th>
                            <th className="text-left px-4 py-2">Estado</th>
                            {auth.user.id_role === 1 && (
                                <>
                                    <th className="text-left px-4 py-2">Pagada Técnico</th>
                                    <th className="text-left px-4 py-2">Pago Cliente</th>
                                </>
                            )}
                        </tr>
                    </thead>
                    <tbody className="text-left">
                        {filteredActas.length > 0 ? (
                            filteredActas.map((acta) => (
                                <tr
                                    key={acta.id}
                                    className="border-t py-2 hover:bg-gray-200 dark:hover:bg-gray-600 group"
                                    onClick={() => router.visit(`/actas/show/${acta.id}`)}
                                >
                                    <td className="px-4 py-2">{acta.code}</td>
                                    <td className="px-4 py-2">{acta.client.name}</td>
                                    <td className="px-4 py-2">{acta.creator.name}</td>
                                    <td className="px-4 py-2">{acta.contact}</td>
                                    <td className="px-4 py-2">{acta.visit_type}</td>
                                    <td className="px-4 py-2">{new Date(acta.start_time).toLocaleString()}</td>
                                    <td className="px-4 py-2">
                                        <span className="px-4 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: acta.is_open === 0 ? '#a7d697' : '#d69797', color: acta.is_open === 0 ? '#437b30' : '#873535', border: `1px solid ${acta.is_open === 0 ? '#437b30' : '#873535'}` }}>
                                            {acta.is_open === 0 ? 'Cerrada' : 'Abierta'}
                                        </span>
                                    </td>
                                    {auth.user.id_role === 1 && (
                                        <>
                                            <td className="px-4 py-2">-</td>
                                            <td className="px-4 py-2">-</td>
                                        </>
                                    )}
                                    {/* Menú de 3 puntitos */}
                                    <td className="px-2 py-2 relative" onClick={e => e.stopPropagation()}>
                                        <Menu as="div" className="relative inline-block text-left">
                                            <Menu.Button className="flex items-center p-1 rounded hover:bg-gray-200">
                                                <MoreVertical size={18} />
                                            </Menu.Button>
                                            <Menu.Items className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                {auth.user.id_role === 1 && (
                                                    acta.is_open === 1 ? (
                                                        <Menu.Item>
                                                            {({ active }) => (
                                                                <button
                                                                    className={`w-full text-left px-4 py-2 text-sm ${active ? 'bg-gray-100' : ''}`}
                                                                    onClick={() => handleCloseActa(acta.id)}
                                                                >
                                                                    Cerrar acta
                                                                </button>
                                                            )}
                                                        </Menu.Item>
                                                    ) : (
                                                        <Menu.Item>
                                                            {({ active }) => (
                                                                <button
                                                                    className={`w-full text-left px-4 py-2 text-sm ${active ? 'bg-gray-100' : ''}`}
                                                                    onClick={() => handleOpenActa(acta.id)}
                                                                >
                                                                    Abrir acta
                                                                </button>
                                                            )}
                                                        </Menu.Item>
                                                    )
                                                )}
                                                <Menu.Item>
                                                    {({ active }) => (
                                                        <button
                                                            className={`w-full text-left px-4 py-2 text-sm ${active ? 'bg-gray-100' : ''}`}
                                                            onClick={() => handleEditActa(acta.id)}
                                                        >
                                                            Editar
                                                        </button>
                                                    )}
                                                </Menu.Item>
                                            </Menu.Items>
                                        </Menu>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={auth.user.id_role === 1 ? 9 : 7} className="px-4 py-2 text-center">No se encontraron actas</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </AppLayout>
    );
}
