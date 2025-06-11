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

export default function ViewTechAssignments({ assignments }: Props) {
  const [filteredAssignments, setFilteredAssignments] = useState<Assignment[]>(assignments);

  useEffect(() => {
    setFilteredAssignments(assignments);
  }, [assignments]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    const filtered = assignments.filter(a =>
      a.customer.name.toLowerCase().includes(term)
    );
    setFilteredAssignments(filtered);
  };

  return (
    <AppLayout breadcrumbs={[{ title: 'Mis Asignaciones', href: '/assignments' }]}>
      <Head title="Mis Asignaciones" />

      {/* BUSCADOR */}
      <div className="m-4 flex justify-start">
        <div className="relative w-1/3">
          <Input
            type="text"
            placeholder="Buscar por cliente"
            onChange={handleSearch}
            className="w-full px-4 py-2 border rounded dark:bg-gray-800 dark:text-white pl-10"
          />
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
