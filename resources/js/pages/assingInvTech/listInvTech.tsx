import React, { useEffect, useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import Swal from 'sweetalert2';
import { router } from '@inertiajs/react';
import ModalTransferTech from '@/components/ModalTransferTech';
import ModalFormDevolution from '@/components/ModalTechDevolution';


interface Warehouse {
    id: number;
    name: string;
    components: string[];
}

interface Component {
    id: number;
    name: string;
    description: string;
}

interface AssignInvTechItem {
    id: number;
    id_component: number;
    id_technician: number;
    id_warehouse_origin: number;
    quantity: number;
    
}

interface Technician {
    id: number;
    name: string;
    
}

interface Props extends Record<string, any> {
    user: {
        id: number;
        name: string;
    };
    warehouses: Warehouse[];
    components: Component[];
    allComponents: Component[];
    allStock: AssignInvTechItem[];
    technicians: Technician[];
}

export default function ListInvTech() {
    const { props } = usePage<{
        user: Props['user'];
        warehouses: Warehouse[];
        components: Component[];
        assignInvTech: AssignInvTechItem[];
        flash: any;
        allComponents: Component[];
        allStock: AssignInvTechItem[];
        technicians: Technician[];
    }>();

    const { user, warehouses, components, assignInvTech, flash, allComponents, allStock, technicians } = props;

    const [filteredWarehouses, setFilteredWarehouses] = useState<Warehouse[]>(warehouses);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModalTransfer, setShowModalTransfer] = useState(false);
    const [showDevolutionModal, setShowDevolutionModal] = useState(false);


    useEffect(() => {
        setFilteredWarehouses(warehouses);
    }, [warehouses]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        const filtered = warehouses.filter((warehouse) =>
            warehouse.name.toLowerCase().includes(term)
        );
        setFilteredWarehouses(filtered);
    };

    const redirecttoAssing = () => {
        if (allComponents.length === 0) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No existen artículos para asignar para este técnico.',
                timer: 3000,
                showConfirmButton: false,
            });
            return;
        }
        if (allStock.length === 0) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No hay artículos con stock para asignar para este técnico.',
                timer: 3000,
                showConfirmButton: false,
            });
            return;
        }
        router.get(route('assingInvTech.assingInv', { id: user.id }));
    };

    useEffect(() => {
        if (flash.success) {
            Swal.fire({
                icon: 'success',
                title: 'Eéxito',
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

    const groupedByWarehouse = warehouses.map((warehouse) => {
        const asignacionesFiltradas = assignInvTech.filter(
            (a) => a.id_warehouse_origin === warehouse.id
        );

        const componentesAgrupados: Record<number, { description: string; quantity: number }> = {};

        asignacionesFiltradas.forEach((a) => {
            if (!componentesAgrupados[a.id_component]) {
                const comp = components.find(c => c.id === a.id_component);
                componentesAgrupados[a.id_component] = {
                    description: comp?.description || 'Desconocido',
                    quantity: a.quantity,
                };
            } else {
                componentesAgrupados[a.id_component].quantity += a.quantity;
            }
        });

        const asignaciones = Object.values(componentesAgrupados);

        return {
            ...warehouse,
            asignaciones,
        };
    });

    return (
        <AppLayout breadcrumbs={[{ title: 'Inventario Técnico', href: '/assingInvTech/listInvTech' }]}>
            <Head title={`Inventario de ${user.name}`} />

            {/* Encabezado con nombre y botón */}
            <div className="m-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <p className="text-3xl text-black font-semibold">
                    Tecnico: {user.name}
                </p>
                <a href="/assingTech/TechList">
                    <button className="px-4 py-2 rounded text-white bg-black hover:bg-gray-700 w-full sm:w-auto">
                        Volver a técnicos
                    </button>
                </a>
            </div>

            {/* Filtros y botones de acción */}
            <div className="flex flex-col lg:flex-row justify-between items-start gap-4 m-4">
                <div className="relative w-full lg:w-1/3">
                    <input
                        type="text"
                        placeholder="Buscar almacén"
                        value={searchTerm}
                        onChange={handleSearch}
                        className="w-full px-4 py-2 border rounded dark:bg-gray-800 dark:text-white pl-10"
                    />
                </div>

                <div className="flex flex-wrap gap-2 w-full lg:w-auto">
                    <div className="flex flex-wrap gap-2 w-full lg:w-auto">
                        <button
                            className="px-4 py-2 border border-gray-300 text-gray-800 bg-white hover:bg-gray-100 rounded w-full sm:w-auto"
                            onClick={() => setShowModalTransfer(true)}
                        >
                            Trasladar a otro técnico
                        </button>

                        <button
                            className="px-4 py-2 border border-gray-300 text-gray-800 bg-white hover:bg-gray-100 rounded w-full sm:w-auto"
                            onClick={() => setShowDevolutionModal(true)}
                        >
                            Devolver a bodega
                        </button>

                        <button
                            onClick={() => redirecttoAssing()}
                            className="px-4 py-2 flex items-center gap-2 rounded text-white bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
                        >
                            <span className="text-xl leading-none">+</span> Asignar Inventario
                        </button>
                    </div>

                </div>
            </div>

            {/* Tabla de inventario */}
            <div className="overflow-x-auto m-4">
                <table className="min-w-[600px] w-full border-collapse text-sm text-gray-500 dark:text-gray-400">
                    <thead className="bg-gray-100 dark:bg-gray-700">
                        <tr>
                            <th className="text-left px-4 py-2">Almacén</th>
                            <th className="text-left px-4 py-2">Artículos</th>
                            <th className="text-left px-4 py-2">Stock</th>
                        </tr>
                    </thead>
                    <tbody className="text-left">
                        {groupedByWarehouse.length > 0 ? (
                            groupedByWarehouse.map((warehouse) => (
                                <tr key={warehouse.id} className="border-t">
                                    <td className="px-4 py-2">{warehouse.name}</td>
                                    <td className="px-4 py-2">
                                        <ul>
                                            {warehouse.asignaciones.length > 0 ? (
                                                warehouse.asignaciones.map((a, idx) => (
                                                    <li key={idx}>{a.description}</li>
                                                ))
                                            ) : (
                                                <li>Sin Artículos</li>
                                            )}
                                        </ul>
                                    </td>
                                    <td className="px-4 py-2">
                                        <ul>
                                            {warehouse.asignaciones.length > 0 ? (
                                                warehouse.asignaciones.map((a, idx) => (
                                                    <li key={idx}>{a.quantity}</li>
                                                ))
                                            ) : (
                                                <li>-</li>
                                            )}
                                        </ul>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={3} className="px-4 py-5 text-center">
                                    No se encontraron almacenes o artículos asignados.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modales */}
            {showModalTransfer && (
                <ModalTransferTech
                    onClose={() => setShowModalTransfer(false)}
                    postRoute="assingInvTech.transferBetweenTechs"
                    idTechnician={user.id}
                    originOptions={warehouses.map(w => ({ value: w.id, label: w.name }))}
                    destinationOptions={technicians.filter(t => t.id !== user.id).map(t => ({ value: t.id, label: t.name }))}
                    components={components.map(c => ({ value: c.id, label: c.description }))}
                />
            )}

            {showDevolutionModal && (
                <ModalFormDevolution
                    onClose={() => setShowDevolutionModal(false)}
                    postRoute="assingInvTech.devolution"
                    idTechnician={user.id}
                    components={components.map(c => ({ value: c.id, label: c.description }))}
                    technicians={[{ value: user.id, label: user.name }]}
                    warehouses={warehouses.map(w => ({ value: w.id, label: w.name }))}
                />
            )}
        </AppLayout>

    );
}
