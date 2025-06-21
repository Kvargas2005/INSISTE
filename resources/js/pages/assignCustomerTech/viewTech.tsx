import React, { useEffect, useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Input } from '@headlessui/react';

interface Assignment {
  id: number;
  customer: { name: string };
  assign_date: string;
  start_date: string | null;
  tech_status: number;
  status: number;
  comments: string | null;
}

interface Props {
  assignments: Assignment[];
}

const filterOptions = [
  { label: 'Cliente', key: 'customer' },
  { label: 'Fecha de Asignación', key: 'assign_date' },
  { label: 'Fecha de Inicio', key: 'start_date' },
  { label: 'Notas', key: 'comments' },
  { label: 'Estado', key: 'status' },
];

export default function ViewTechAssignments({ assignments }: Props) {
  const [filteredAssignments, setFilteredAssignments] = useState<Assignment[]>([]);
  const [filters, setFilters] = useState<{ key: string; value: string; active: boolean }[]>([]);
  const [newFilterKey, setNewFilterKey] = useState<string>('');

  function sortAssignments(list: Assignment[]) {
    const now = new Date();
    return [...list].sort((a, b) => {
      const isLateA = (a.tech_status === 1 || a.tech_status === 2) && new Date(a.assign_date) < now;
      const isLateB = (b.tech_status === 1 || b.tech_status === 2) && new Date(b.assign_date) < now;
      if (isLateA !== isLateB) return isLateA ? -1 : 1;
      if (a.tech_status === 2 && b.tech_status !== 2) return -1;
      if (b.tech_status === 2 && a.tech_status !== 2) return 1;
      if (a.tech_status === 1 && b.tech_status !== 1) return -1;
      if (b.tech_status === 1 && a.tech_status !== 1) return 1;
      if (a.tech_status === 3 && b.tech_status !== 3) return 1;
      if (b.tech_status === 3 && a.tech_status !== 3) return -1;
      return new Date(b.assign_date).getTime() - new Date(a.assign_date).getTime();
    });
  }

  useEffect(() => {
    setFilteredAssignments(sortAssignments(assignments));
  }, [assignments]);

  useEffect(() => {
    let result = sortAssignments(assignments);
    filters.forEach(filter => {
      if (!filter.active || !filter.value) return;
      const valueLower = filter.value.toLowerCase();
      switch (filter.key) {
        case 'customer':
          result = result.filter(a => a.customer.name.toLowerCase().includes(valueLower));
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

  return (
    <AppLayout breadcrumbs={[{ title: 'Mis Asignaciones', href: '/assignments' }]}>
      <Head title="Mis Asignaciones" />


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
              <th className="text-left px-4 py-2">Fecha de Asignación</th>
              <th className="text-left px-4 py-2">Fecha de Inicio</th>
              <th className="text-left px-4 py-2">Notas</th>
              <th className="text-left px-4 py-2">Estado</th>
            </tr>
          </thead>
          <tbody className="text-left">
            {filteredAssignments.length > 0 ? (
              filteredAssignments.map((a) => (
                <tr key={a.id} className="border-t">
                  <td className="px-4 py-2">{a.customer.name}</td>
                  <td className="px-4 py-2">{new Date(a.assign_date).toLocaleString()}</td>
                  <td className="px-4 py-2">
                    {a.start_date ? new Date(a.start_date).toLocaleString() : 'Sin iniciar'}
                  </td>
                  <td className="px-4 py-2">{a.comments || '—'}</td>
                  <td className="px-4 py-2">
                    {a.status === 2 ? (
                      <span className="px-4 py-1 rounded-full text-red-700 bg-red-100 text-xs font-semibold">Cancelado</span>
                    ) : a.tech_status === 1 ? (
                      <span className="px-4 py-1 rounded-full text-green-700 bg-green-100 text-xs font-semibold">Pendiente</span>
                    ) : a.tech_status === 2 ? (
                      <span className="px-4 py-1 rounded-full text-yellow-700 bg-yellow-100 text-xs font-semibold">En curso</span>
                    ) : (
                      <span className="px-4 py-1 rounded-full text-pink-700 bg-pink-100 text-xs font-semibold">Finalizado</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-4 py-2">No hay asignaciones</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AppLayout>
  );
}
