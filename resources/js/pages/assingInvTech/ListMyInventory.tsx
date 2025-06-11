import React, { useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

interface AssignInvTechItem {
  id: number;
  id_component: number;
  id_technician: number;
  id_warehouse_origin: number;
  quantity: number;
  component: {
    name: string;
    description: string;
    part_n: string;
    brand: {
      name: string;
    };
    family: {
      name: string;
    };
  };
  warehouse: {
    name: string;
  };
}

interface Props {
  assignInvTech: AssignInvTechItem[];
}

export default function ListMyInventory({ assignInvTech }: Props) {
  const { auth } = usePage().props as any;
  const [search, setSearch] = useState('');

  // Filtrar por nombre de bodega
  const filtered = assignInvTech.filter(a =>
    a.warehouse.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppLayout breadcrumbs={[{ title: 'Mi Inventario', href: '/assingInvTech/my' }]}>
      <Head title="Mi Inventario" />
      <h2 className="text-2xl font-semibold m-4">Inventario de {auth.user.name}</h2>

      <div className="m-4">
        <input
          type="text"
          placeholder="Buscar bodega..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-1/2 px-4 py-2 border rounded dark:bg-gray-800 dark:text-white"
        />
      </div>

      <div className="m-4 overflow-x-auto">
        <table className="min-w-[900px] w-full border-collapse text-sm text-gray-500 dark:text-gray-400">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="text-left px-4 py-2">Descripción</th>
              <th className="text-left px-4 py-2">Código</th>
              <th className="text-left px-4 py-2">Familia</th>
              <th className="text-left px-4 py-2">Marca</th>
              <th className="text-left px-4 py-2">N° Parte</th>
              <th className="text-left px-4 py-2">Cantidad</th>
              <th className="text-left px-4 py-2">Bodega</th>
            </tr>
          </thead>
          <tbody className="text-left">
            {filtered.length > 0 ? (
              filtered.map((a, idx) => (
                <tr key={idx} className="border-t">
                  <td className="px-4 py-2">{a.component.description}</td>
                  <td className="px-4 py-2">{a.component.name}</td>
                  <td className="px-4 py-2">{a.component.family?.name || '—'}</td>
                  <td className="px-4 py-2">{a.component.brand?.name || '—'}</td>
                  <td className="px-4 py-2">{a.component.part_n}</td>
                  <td className="px-4 py-2">{a.quantity}</td>
                  <td className="px-4 py-2">{a.warehouse.name}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-4 py-2 text-center">No hay inventario asignado o no coincide la búsqueda.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AppLayout>
  );
}
