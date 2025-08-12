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
    delivery_scope?: string;
    has_payment?: boolean;
    alreadyReviewed?: boolean;
    technicianName?: string;
    fechaVisita?: string | null;
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
    { label: 'Alcance de Entrega', key: 'delivery_scope' }, // nuevo
    { label: 'Cliente', key: 'client' },
    { label: 'Código', key: 'code' },
    { label: 'Fecha', key: 'start_time' },
    { label: 'Proyecto', key: 'project' },
    { label: 'Técnico', key: 'creator' },
    { label: 'Tipo de Entrega', key: 'delivery_class' }, // nuevo
    { label: 'Tipo de Servicios', key: 'service_type' }, // nuevo
    { label: 'Tipo de Visita', key: 'visit_type' },
    { label: 'Trabajo a Realizar', key: 'job_type' }, // nuevo
];


export default function ActasList({ actas, canCreate }: Props) {
    const { flash } = usePage().props as unknown as { flash: { success?: string; error?: string } };

    const [filters, setFilters] = React.useState<FilterItem[]>([]);
    const [newFilterKey, setNewFilterKey] = React.useState<string>('');
    const [filteredActas, setFilteredActas] = React.useState<Acta[]>(actas);
    // Paginación
    const [pageSize, setPageSize] = React.useState<number>(25);
    const [currentPage, setCurrentPage] = React.useState<number>(1);

    // Obtener opciones de filtros del backend
    const { servicesOptions = [], deliveryClassOptions = [], jobTypeOptions = [], deliveryScopeOptions = [] } = usePage().props as any;

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


    console.log(filteredActas)

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
                case 'visit_type':
                    result = result.filter(a => a.visit_type.toLowerCase().includes(valueLower));
                    break;
                case 'start_time':
                    // Comparar sólo la parte de fecha (sin hora)
                    result = result.filter(a => {
                        // Restar un día a la fecha del filtro
                        const filterDateObj = new Date(filter.value);
                        filterDateObj.setDate(filterDateObj.getDate() + 1);
                        const filterDate = filterDateObj.toLocaleString().slice(0, 10);
                        const actaDate = new Date(a.start_time).toLocaleString().slice(0, 10);
                        return actaDate === filterDate;
                    });
                    break;
                case 'service_type':
                    result = result.filter(a => a.service_type && a.service_type.toLowerCase().includes(valueLower));
                    break;
                case 'delivery_class':
                    result = result.filter(a => a.delivery_class && a.delivery_class.toLowerCase().includes(valueLower));
                    break;
                case 'job_type':
                    result = result.filter(a => a.job_type && a.job_type.toLowerCase().includes(valueLower));
                    break;
                case 'delivery_scope':
                    result = result.filter(a => a.delivery_scope && a.delivery_scope.toLowerCase().includes(valueLower));
                    break;
                default:
                    break;
            }
        });

        setFilteredActas(result);
    }, [filters, actas]);

    // Resetear a la primera página cuando cambien filtros, actas o el tamaño de página
    useEffect(() => {
        setCurrentPage(1);
    }, [filters, actas, pageSize]);

    // Derivados de paginación
    const totalItems = filteredActas.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, totalItems);
    const paginatedActas = filteredActas.slice(startIndex, endIndex);

    const goToPage = (page: number) => {
        const safePage = Math.min(Math.max(1, page), totalPages);
        setCurrentPage(safePage);
    };

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
                        // Dropdowns para los filtros especiales
                        const isDropdown = [
                            'service_type',
                            'delivery_class',
                            'job_type',
                            'delivery_scope',
                        ].includes(filter.key);
                        let options: string[] = [];
                        if (filter.key === 'service_type') options = servicesOptions;
                        if (filter.key === 'delivery_class') options = deliveryClassOptions;
                        if (filter.key === 'job_type') options = jobTypeOptions;
                        if (filter.key === 'delivery_scope') options = deliveryScopeOptions;
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
                                ) : isDropdown ? (
                                    <select
                                        id={filter.key}
                                        value={filter.value}
                                        onChange={e => handleFilterChange(filter.key, e.target.value)}
                                        className="border rounded px-2 py-1 text-sm w-full max-w-xs"
                                    >
                                        <option value="">Todos</option>
                                        {options.map(opt => (
                                            <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                    </select>
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
            <div className="m-4 shadow rounded-lg overflow-y-auto pb-[100px] overflow-x-auto max-h-[500px] min-h-[500px] relative">
                {/* Barra superior de controles de paginación (opcional) */}
                <div className="sticky top-0 z-10 flex items-center justify-between bg-white/80 dark:bg-gray-800/80 backdrop-blur px-4 py-2 border-b">
                    <div className="flex items-center gap-2 text-sm">
                        <span>Mostrar</span>
                        <select
                            value={pageSize}
                            onChange={(e) => setPageSize(Number(e.target.value))}
                            className="border rounded px-2 py-1 text-sm"
                        >
                            {[25, 50, 100, 200].map(sz => (
                                <option key={sz} value={sz}>{sz}</option>
                            ))}
                        </select>
                        <span className="ml-3 hidden sm:inline">Registros</span>
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-300">
                        Mostrando {totalItems === 0 ? 0 : startIndex + 1}–{endIndex} de {totalItems}
                    </div>
                </div>
                <table className="min-w-[900px] w-full border-collapse text-sm text-gray-500 dark:text-gray-400">
                    <thead className="bg-gray-100 dark:bg-gray-700">
                        <tr>
                            <th className="text-left px-4 py-2">
                                Código
                                <button
                                    className="ml-1 text-xs"
                                    style={{ cursor: 'pointer' }}
                                    title="Ordenar A-Z"
                                    onClick={e => {
                                        e.stopPropagation();
                                        setFilteredActas(prev => {
                                            const sorted = [...prev].sort((a, b) => a.code.localeCompare(b.code));
                                            setCurrentPage(1);
                                            return sorted;
                                        });
                                    }}
                                >▲</button>
                                <button
                                    className="ml-1 text-xs"
                                    style={{ cursor: 'pointer' }}
                                    title="Ordenar Z-A"
                                    onClick={e => {
                                        e.stopPropagation();
                                        setFilteredActas(prev => {
                                            const sorted = [...prev].sort((a, b) => b.code.localeCompare(a.code));
                                            setCurrentPage(1);
                                            return sorted;
                                        });
                                    }}
                                >▼</button>
                            </th>
                            <th className="text-left px-4 py-2">Cliente
                                <button
                                    className="ml-1 text-xs"
                                    style={{ cursor: 'pointer' }}
                                    title="Ordenar A-Z"
                                    onClick={e => {
                                        e.stopPropagation();
                                        setFilteredActas(prev => {
                                            const sorted = [...prev].sort((a, b) => a.client.name.localeCompare(b.client.name));
                                            setCurrentPage(1);
                                            return sorted;
                                        });
                                    }}
                                >▲</button>
                                <button
                                    className="ml-1 text-xs"
                                    style={{ cursor: 'pointer' }}
                                    title="Ordenar Z-A"
                                    onClick={e => {
                                        e.stopPropagation();
                                        setFilteredActas(prev => {
                                            const sorted = [...prev].sort((a, b) => b.client.name.localeCompare(a.client.name));
                                            setCurrentPage(1);
                                            return sorted;
                                        });
                                    }}
                                >▼</button>
                            </th>
                            <th className="text-left px-4 py-2">Técnico
                                <button
                                    className="ml-1 text-xs"
                                    style={{ cursor: 'pointer' }}
                                    title="Ordenar A-Z"
                                    onClick={e => {
                                        e.stopPropagation();
                                        setFilteredActas(prev => {
                                            const sorted = [...prev].sort((a, b) => a.creator.name.localeCompare(b.creator.name));
                                            setCurrentPage(1);
                                            return sorted;
                                        });
                                    }}
                                >▲</button>
                                <button
                                    className="ml-1 text-xs"
                                    style={{ cursor: 'pointer' }}
                                    title="Ordenar Z-A"
                                    onClick={e => {
                                        e.stopPropagation();
                                        setFilteredActas(prev => {
                                            const sorted = [...prev].sort((a, b) => b.creator.name.localeCompare(a.creator.name));
                                            setCurrentPage(1);
                                            return sorted;
                                        });
                                    }}
                                >▼</button>
                            </th>
                            <th className="text-left px-4 py-2">Contacto
                                <button
                                    className="ml-1 text-xs"
                                    style={{ cursor: 'pointer' }}
                                    title="Ordenar A-Z"
                                    onClick={e => {
                                        e.stopPropagation();
                                        setFilteredActas(prev => {
                                            const sorted = [...prev].sort((a, b) => a.contact.localeCompare(b.contact));
                                            setCurrentPage(1);
                                            return sorted;
                                        });
                                    }}
                                >▲</button>
                                <button
                                    className="ml-1 text-xs"
                                    style={{ cursor: 'pointer' }}
                                    title="Ordenar Z-A"
                                    onClick={e => {
                                        e.stopPropagation();
                                        setFilteredActas(prev => {
                                            const sorted = [...prev].sort((a, b) => b.contact.localeCompare(a.contact));
                                            setCurrentPage(1);
                                            return sorted;
                                        });
                                    }}
                                >▼</button>
                            </th>
                            <th className="text-left px-4 py-2">Tipo Visita
                                <button
                                    className="ml-1 text-xs"
                                    style={{ cursor: 'pointer' }}
                                    title="Ordenar A-Z"
                                    onClick={e => {
                                        e.stopPropagation();
                                        setFilteredActas(prev => {
                                            const sorted = [...prev].sort((a, b) => a.visit_type.localeCompare(b.visit_type));
                                            setCurrentPage(1);
                                            return sorted;
                                        });
                                    }}
                                >▲</button>
                                <button
                                    className="ml-1 text-xs"
                                    style={{ cursor: 'pointer' }}
                                    title="Ordenar Z-A"
                                    onClick={e => {
                                        e.stopPropagation();
                                        setFilteredActas(prev => {
                                            const sorted = [...prev].sort((a, b) => b.visit_type.localeCompare(a.visit_type));
                                            setCurrentPage(1);
                                            return sorted;
                                        });
                                    }}
                                >▼</button>
                            </th>
                            <th className="text-left px-4 py-2">
                                Fecha
                                <button
                                    className="ml-1 text-xs"
                                    style={{ cursor: 'pointer' }}
                                    title="Más reciente primero"
                                    onClick={e => {
                                        e.stopPropagation();
                                        setFilteredActas(prev => {
                                            const sorted = [...prev].sort((a, b) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime());
                                            setCurrentPage(1);
                                            return sorted;
                                        });
                                    }}
                                >▲</button>
                                <button
                                    className="ml-1 text-xs"
                                    style={{ cursor: 'pointer' }}
                                    title="Más antigua primero"
                                    onClick={e => {
                                        e.stopPropagation();
                                        setFilteredActas(prev => {
                                            const sorted = [...prev].sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());
                                            setCurrentPage(1);
                                            return sorted;
                                        });
                                    }}
                                >▼</button>
                            </th>
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
                            paginatedActas.map((acta) => (
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
                                            <td className="px-4 py-2">{acta.has_payment ? 'Sí' : 'No'}</td>
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

                {/* Controles de paginación abajo */}
                <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t px-4 py-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-sm">
                        <span>Mostrar</span>
                        <select
                            value={pageSize}
                            onChange={(e) => setPageSize(Number(e.target.value))}
                            className="border rounded px-2 py-1 text-sm"
                        >
                            {[25, 50, 100, 200].map(sz => (
                                <option key={sz} value={sz}>{sz}</option>
                            ))}
                        </select>
                        <span className="hidden sm:inline">por página</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            className="px-3 py-1 border rounded text-sm disabled:opacity-50"
                            disabled={currentPage <= 1 || totalItems === 0}
                            onClick={() => goToPage(currentPage - 1)}
                        >
                            Anterior
                        </button>
                        {/* Números de página con elipsis */}
                        <div className="flex items-center gap-1">
                            {(() => {
                                const pages: (number | 'ellipsis')[] = [];
                                const maxToShow = 7;
                                if (totalPages <= maxToShow) {
                                    for (let p = 1; p <= totalPages; p++) pages.push(p);
                                } else {
                                    const addRange = (from: number, to: number) => {
                                        for (let p = from; p <= to; p++) pages.push(p);
                                    };
                                    const left = Math.max(2, currentPage - 1);
                                    const right = Math.min(totalPages - 1, currentPage + 1);
                                    pages.push(1);
                                    if (left > 2) pages.push('ellipsis');
                                    addRange(left, right);
                                    if (right < totalPages - 1) pages.push('ellipsis');
                                    pages.push(totalPages);
                                }
                                return pages.map((p, idx) =>
                                    p === 'ellipsis' ? (
                                        <span key={`e-${idx}`} className="px-2">…</span>
                                    ) : (
                                        <button
                                            key={p}
                                            className={`px-3 py-1 border rounded text-sm ${p === currentPage ? 'bg-black text-white border-black' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                                            onClick={() => goToPage(p)}
                                        >
                                            {p}
                                        </button>
                                    )
                                );
                            })()}
                        </div>
                        <button
                            className="px-3 py-1 border rounded text-sm disabled:opacity-50"
                            disabled={currentPage >= totalPages || totalItems === 0}
                            onClick={() => goToPage(currentPage + 1)}
                        >
                            Siguiente
                        </button>
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-300">
                        Mostrando {totalItems === 0 ? 0 : startIndex + 1}–{endIndex} de {totalItems}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
