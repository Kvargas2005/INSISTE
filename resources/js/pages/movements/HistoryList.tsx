import React, { useEffect, useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { ArrowUpDown } from 'lucide-react';
import Swal from 'sweetalert2';
import ModalTransfer from '@/components/ModalTransfer';
import ModalFormCreate from '@/components/ModalFormCreate';
import axios from 'axios';


interface HistoryItem {
    id: number;
    date: string;
    mov: string;
    quantity: number;
    user: {
        name: string;
        id: number
    };
    component: {
        description: string;
        id: number
    };
    warehouse: {
        name: string;
        id: number
    };
}

interface ComponentOption {
    id: number;
    description: string;
    brandName?: string;
    familyName?: string;
}

interface WarehouseOption {
    id: number;
    name: string;
}

interface Props {
    history: HistoryItem[];
    components: ComponentOption[];
    warehouses: WarehouseOption[];
}


interface Props {
    history: HistoryItem[];
    components: ComponentOption[];
    warehouses: WarehouseOption[];
}
export default function HistoryList({ history, components, warehouses }: Props) {
    const { flash } = usePage().props as unknown as { flash: { success?: string; error?: string } };
    const [AllHistory, setAllHistory] = useState<HistoryItem[]>(history);
    const [showModalTransfer, setShowModalTransfer] = useState(false);
    const [showModalCreate, setShowModalCreate] = useState(false);
    // Usar brandName y familyName para mostrar en el select de ModalTransfer
    const [componentsList, setComponentsList] = useState<ComponentOption[]>(components);
    const [warehousesList, setWarehousesList] = useState<WarehouseOption[]>(warehouses);
    const [selectedComponent, setSelectedComponent] = useState<number | null>(null);
    const [fromWarehouse, setFromWarehouse] = useState<number | null>(null);
    const [availableStock, setAvailableStock] = useState<number | null>(null);
    console.log(componentsList)


    useEffect(() => {
        setAllHistory(history);
    }, [history]);

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

    return (
        <AppLayout breadcrumbs={[{ title: 'Historial de inventario', href: '/inv-history' }]}>
            <Head title="Historial de inventario" />

            <div className="flex flex-row gap-6 m-4 overflow-x-auto">
                <a href="/inv-history" className="dark:text-white text-sky-600 text-[14px] hover:text-sky-600/75 cursor-pointer">
                    Todos los movimientos
                </a>
                <a href="/entries" className="dark:text-white text-black text-[14px] hover:text-sky-600/75 cursor-pointer">
                    Entradas
                </a>
            </div>


            <div className="flex justify-start m-4 gap-2">
                <button
                    onClick={() => setShowModalTransfer(true)}
                    className="px-4 py-2 border border-gray-300 text-gray-800 bg-white hover:bg-gray-100 rounded w-full sm:w-auto"
                >
                    Trasladar Artículo a otra bodega
                </button>
                <button
                    onClick={() => setShowModalCreate(true)}
                    className="px-4 py-2 border border-gray-300 text-gray-800 bg-white hover:bg-gray-100 rounded w-full sm:w-auto"
                >
                    Ingresar Artículo a Bodega
                </button>
            </div>




            <div className="m-4 shadow rounded-lg overflow-y-auto pb-[100px] overflow-x-auto max-h-[500px] min-h-[500px]">
                <table className="min-w-[700px] w-full border-collapse text-sm text-gray-500 dark:text-gray-400">
                    <thead className="bg-gray-100 dark:bg-gray-700">
                        <tr>
                            <th className="text-left px-4 py-2">Fecha</th>
                            <th className="text-left px-4 py-2">Movimiento</th>
                            <th className="text-left px-4 py-2">Cantidad</th>
                            <th className="text-left px-4 py-2">Artículo</th>
                            <th className="text-left px-4 py-2">Bodega</th>
                            <th className="text-left px-4 py-2">Usuario</th>
                        </tr>
                    </thead>
                    <tbody className="text-left">
                        {AllHistory.length > 0 ? (
                            AllHistory.map((item) => (
                                <tr key={item.id} className="border-t">
                                    <td className="px-4 py-2">
                                        {new Date(item.date).toLocaleString('es-CR', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            hour12: false,
                                        })}
                                    </td>
                                    <td className="px-4 py-2">{item.mov}</td>
                                    <td className="px-4 py-2">{item.quantity}</td>
                                    <td className="px-4 py-2">{item.component?.description || 'N/A'}</td>
                                    <td className="px-4 py-2">{item.warehouse?.name || 'N/A'}</td>
                                    <td className="px-4 py-2">{item.user?.name || 'N/A'}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="px-4 py-2 text-center">
                                    No se encontraron registros
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {showModalTransfer && (
                <ModalTransfer
                    mode="warehouse"
                    postRoute="transfers.create"
                    onClose={() => setShowModalTransfer(false)}
                    components={componentsList.map(c => ({
                        value: c.id,
                        label: `${c.description} | ${c.familyName || ''} | ${c.brandName || ''}`,
                        familyName: c.familyName,
                        brandName: c.brandName,
                    }))}
                    warehouses={warehousesList.map(w => ({ value: w.id, label: w.name }))}
                />
            )}

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
                            options: componentsList.map((component) => ({
                                value: component.id,
                                label: `${component.description} | ${component.familyName || ''} | ${component.brandName || ''}`,
                                familyName: component.familyName?.toLowerCase() || '',
                                brandName: component.brandName?.toLowerCase() || '',
                            })),
                        },
                        {
                            name: 'id_warehouse',
                            label: 'Bodega',
                            type: 'select',
                            selectType: 'react',
                            options: warehousesList.map((warehouse) => ({
                                value: warehouse.id,
                                label: warehouse.name,
                            })),
                        },
                        { name: 'quantity', label: 'Cantidad', type: 'number' },
                    ]}
                    onClose={() => setShowModalCreate(false)}
                />
            )}



        </AppLayout>

    );
}
