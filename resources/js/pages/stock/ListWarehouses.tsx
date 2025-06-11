import React, { useState } from 'react';
import { usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react';

interface Warehouse {
    id: number;
    name: string;
    adress: string;
    status: number;
}

const ListWarehouses: React.FC = () => {
    const { props } = usePage<{ warehouses: Warehouse[] }>();
    const warehouses = props.warehouses;

    const [search, setSearch] = useState('');
    const filteredWarehouses = warehouses.filter((warehouse) =>
        warehouse.name.toLowerCase().includes(search.toLowerCase())
    );

    const redirecttoWarehouse = (id: number) => {
        // Use Inertia.post to navigate to the warehouse details page
        router.get(route('warehouseStock.listComponents', { id }));
    }

    return (
        <AppLayout breadcrumbs={[{ title: 'Stock de Bodegas', href: '/warehouses' }]}>
            <Head title="Stock de Bodegas" />
            <div className="flex justify-between m-4">
                <div className="relative w-1/3">
                    <input
                        type="text"
                        placeholder="Buscar bodega..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full px-4 py-2 border rounded dark:bg-gray-800 dark:text-white pl-10"
                    />
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-4.35-4.35M16.65 10.65a6 6 0 11-12 0 6 6 0 0112 0z"
                        />
                    </svg>
                </div>
            </div>

            <div className="m-4 text-gray-600/25 dark:text-gray-300/25 text-center font-semibold">
                <p className='text-lg'>Bodegas con inventario disponible.</p>
                <p className='text-sm'>Para acceder al stock de las bodegas, haga click en alguna</p>
            </div>

            <div className="m-4 shadow rounded-lg overflow-y-auto pb-[100px] overflow-x-auto max-h-[500px] min-h-[500px]">
                <table className="min-w-[600px] w-full border-collapse text-sm text-gray-500 dark:text-gray-400">
                    <thead className="bg-gray-100 dark:bg-gray-700">
                        <tr>
                            <th className="text-center px-4 py-2">Nombre</th>
                            <th className="text-center px-4 py-2">Dirección</th>
                            <th className="text-center px-4 py-2">Estado</th>
                        </tr>
                    </thead>
                    <tbody className="text-center">
                        {filteredWarehouses.length > 0 ? (
                            filteredWarehouses.map((warehouse) => (
                                <tr key={warehouse.id} className="border-t" onClick={() => redirecttoWarehouse(warehouse.id)}>
                                    <td className="px-4 py-2">{warehouse.name}</td>
                                    <td className="px-4 py-2">{warehouse.adress}</td>
                                    <td className="px-4 py-2">
                                        <span
                                            className="px-5 py-1 rounded-full"
                                            style={{
                                                backgroundColor: warehouse.status === 1 ? '#a7d697' : '#d69797',
                                                color: warehouse.status === 1 ? '#437b30' : '#873535',
                                                border: `1px solid ${warehouse.status === 1 ? '#437b30' : '#873535'
                                                    }`,
                                            }}
                                        >
                                            {warehouse.status === 1 ? 'Activo' : 'Desactivado'}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="px-4 py-2 text-center">
                                    No se encontraron almacenes
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </AppLayout>
    );
};

export default ListWarehouses;