import React, { useEffect, useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import ModalFormCreate from '@/components/ModalFormCreate';
import Swal from 'sweetalert2';

interface Entry {
  id: number;
  entry_date: string;
  id_component: number;
  id_warehouse: number;
  quantity: number;
}

interface Component {
  id: number;
  description: string;
  brandName: string;
  familyName: string;
}

interface WareHouse {
  id: number;
  name: string;
  adress: string;
}

interface Props {
  entries: Entry[];
  components: Component[];
  warehouses: WareHouse[];
}

export default function SupplierList({ entries, components, warehouses }: Props) {
  const { flash } = usePage().props as unknown as { flash: { success?: string; error?: string } };
  const [AllEntries, setAllEntries] = useState<Entry[]>(entries);
  const [showModalCreate, setShowModalCreate] = useState(false);

  const [filterDescription, setFilterDescription] = useState('');
  const [filterFamily, setFilterFamily] = useState('');
  const [filterBrand, setFilterBrand] = useState('');

  useEffect(() => {
    setAllEntries(entries);
  }, [entries]);

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

  // Filtrado en frontend basado en filtros
  const filteredComponents = components.filter((c) => {
    return (
      c.description.toLowerCase().includes(filterDescription.toLowerCase()) &&
      c.familyName.toLowerCase().includes(filterFamily.toLowerCase()) &&
      c.brandName.toLowerCase().includes(filterBrand.toLowerCase())
    );
  });

  return (
    <>
      <AppLayout breadcrumbs={[{ title: 'Entradas', href: '/entries' }]}>
        <Head title="Entradas de inventario" />
        <div className="flex flex-row gap-6 m-4 overflow-x-auto">
          <a href="/inv-history" className="dark:text-white text-black text-[14px] hover:text-sky-600/75 cursor-pointer">
            Todos los movimientos
          </a>
          <a href="/entries" className="dark:text-white  text-sky-600 text-[14px] hover:text-sky-600/75 cursor-pointer">
            Entradas
          </a>
        </div>


        <div className="flex justify-between m-4">
          <button
            onClick={() => setShowModalCreate(true)}
            className="px-4 py-2 rounded text-white"
            style={{ backgroundColor: 'black' }}
          >
            Ingresar Artículo a Bodega
          </button>
        </div>

        {/* Tabla de entradas... */}
        <div className="m-4 shadow rounded-lg overflow-y-auto pb-[100px] overflow-x-auto max-h-[500px] min-h-[500px]">
          <table className="min-w-[600px] w-full border-collapse text-sm text-gray-500 dark:text-gray-400">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="text-left px-4 py-2">Artículo</th>
                <th className="text-left px-4 py-2">Bodega</th>
                <th className="text-left px-4 py-2">Cantidad</th>
                <th className="text-left px-4 py-2">Fecha de ingreso</th>
              </tr>
            </thead>
            <tbody className="text-left">
              {AllEntries.length > 0 ? (
                AllEntries.map((entrie) => (
                  <tr key={entrie.id} className="border-t">
                    <td className="px-4 py-2">
                      {components.find((component) => component.id === entrie.id_component)?.description || 'Desconocido'}
                    </td>
                    <td className="px-4 py-2">
                      {warehouses.find((warehouse) => warehouse.id === entrie.id_warehouse)?.name || 'Desconocida'}
                    </td>
                    <td className="px-4 py-2">{entrie.quantity}</td>
                    <td className="px-4 py-2">{new Date(entrie.entry_date).toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-2 text-center">
                    No se encontraron entradas
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </AppLayout>

      {showModalCreate && (
        <ModalFormCreate
          title="Registrar Entrada"
          postRoute="entries.create"
          inputs={[
            {
              name: 'id_component',
              label: 'Artículo',
              type: 'select',
              selectType: 'react',
              options: filteredComponents.map((component) => ({
                value: component.id,
                label: `${component.description} | ${component.familyName} | ${component.brandName}`,
                familyName: component.familyName.toLowerCase(),
                brandName: component.brandName.toLowerCase(),
              })),
            },
            {
              name: 'id_warehouse',
              label: 'Bodega',
              type: 'select',
              selectType: 'react',
              options: warehouses.map((warehouse) => ({
                value: warehouse.id,
                label: warehouse.name,
              })),
            },
            { name: 'quantity', label: 'Cantidad', type: 'number' },
          ]}
          onClose={() => setShowModalCreate(false)}
        />
      )}
    </>
  );
}
