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
    services?: { id: number; description: string }[];
}
  


interface Technician {
    id: number;
    name: string;
}

interface Customer {
    id: number;
    name: string;
}

interface Service { id: number; description: string; }
interface Props {
    assignments: Assignment[];
    technicians: Technician[];
    customers: Customer[];
    services: Service[];
}

// Filtros disponibles
const filterOptions = [
    { label: 'Cliente', key: 'customer' },
    { label: 'Técnico', key: 'technician' },
    { label: 'Fecha de Asignación', key: 'assign_date' },
    { label: 'Fecha de Inicio', key: 'start_date' },
    { label: 'Notas', key: 'comments' },
    { label: 'Estado', key: 'status' },
];

export default function ViewAssignments({ assignments, customers, technicians, services }: Props) {
    const [filteredAssignments, setFilteredAssignments] = useState<Assignment[]>([]);
    const [showModalEdit, setShowModalEdit] = useState(false);
    const [selectedId, setSelectedId] = useState<number>(0);
    const [filters, setFilters] = useState<{ key: string; value: string; active: boolean }[]>([]);
    const [newFilterKey, setNewFilterKey] = useState<string>('');

    // Ordenar asignaciones según prioridad
    function sortAssignments(list: Assignment[]) {
        const now = new Date();
        return [...list].sort((a, b) => {
            // Atrasadas primero
            const isLateA = (a.tech_status === 1 || a.tech_status === 2) && new Date(a.assign_date) < now;
            const isLateB = (b.tech_status === 1 || b.tech_status === 2) && new Date(b.assign_date) < now;
            if (isLateA !== isLateB) return isLateA ? -1 : 1;
            // En curso
            if (a.tech_status === 2 && b.tech_status !== 2) return -1;
            if (b.tech_status === 2 && a.tech_status !== 2) return 1;
            // Pendientes
            if (a.tech_status === 1 && b.tech_status !== 1) return -1;
            if (b.tech_status === 1 && a.tech_status !== 1) return 1;
            // Finalizadas
            if (a.tech_status === 3 && b.tech_status !== 3) return 1;
            if (b.tech_status === 3 && a.tech_status !== 3) return -1;
            // Por fecha de asignación descendente
            return new Date(b.assign_date).getTime() - new Date(a.assign_date).getTime();
        });
    }

    useEffect(() => {
        setFilteredAssignments(sortAssignments(assignments));
    }, [assignments]);

    // Filtro avanzado
    useEffect(() => {
        let result = sortAssignments(assignments);
        filters.forEach(filter => {
            if (!filter.active || !filter.value) return;
            const valueLower = filter.value.toLowerCase();
            switch (filter.key) {
                case 'customer':
                    result = result.filter(a => a.customer.name.toLowerCase().includes(valueLower));
                    break;
                case 'technician':
                    result = result.filter(a => a.technician.name.toLowerCase().includes(valueLower));
                    break;
                case 'assign_date':
                    result = result.filter(a => a.assign_date && a.assign_date.toLowerCase().includes(valueLower));
                    break;
                case 'start_date':
                    result = result.filter(a => a.start_date && a.start_date.toLowerCase().includes(valueLower));
                    break;
                case 'comments':
                    result = result.filter(a => (a.comments || '').toLowerCase().includes(valueLower));
                    break;
                case 'status':
                    result = result.filter(a => {
                        if (filter.value === 'Atrasada') {
                            const now = new Date();
                            return (a.tech_status === 1 || a.tech_status === 2) && new Date(a.assign_date) < now;
                        }
                        if (filter.value === 'En curso') return a.tech_status === 2;
                        if (filter.value === 'Pendiente') return a.tech_status === 1;
                        if (filter.value === 'Finalizado') return a.tech_status === 3;
                        if (filter.value === 'Cancelado') return a.status === 2;
                        return true;
                    });
                    break;
                default:
                    break;
            }
        });
        setFilteredAssignments(result);
    }, [filters, assignments]);

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

        
                {/* FILTROS AVANZADOS */}
                <div className="flex justify-between items-center m-4 gap-4">
                    <div className="space-y-2 max-w-xl">
                        {filters.map(filter => {
                            const isDate = filter.key === 'assign_date' || filter.key === 'start_date';
                            const isStatus = filter.key === 'status';
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
                                    ) : isStatus ? (
                                        <select
                                            id={filter.key}
                                            value={filter.value}
                                            onChange={e => handleFilterChange(filter.key, e.target.value)}
                                            className="border rounded px-2 py-1 text-sm w-full max-w-xs"
                                        >
                                            <option value="">Todos</option>
                                            <option value="Atrasada">Atrasada</option>
                                            <option value="En curso">En curso</option>
                                            <option value="Pendiente">Pendiente</option>
                                            <option value="Finalizado">Finalizado</option>
                                            <option value="Cancelado">Cancelado</option>
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
                                <th className="text-left px-4 py-2">Servicios</th>
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
                                            {assignment.services && assignment.services.length > 0
                                                ? assignment.services.map(s => s.description).join(', ')
                                                : '—'}
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
                        {
                            name: 'services',
                            label: 'Servicios',
                            type: 'select',
                            selectType: 'react',
                            options: services.map(s => ({ value: s.id, label: s.description })),
                        },
                        { name: 'assign_date', label: 'Fecha de asignación', type: 'datetime-local' },
                        { name: 'comments', label: 'Notas', type: 'textarea' },
                    ]}
                    onClose={() => setShowModalEdit(false)}
                />
            )}
        </>
    );
}
