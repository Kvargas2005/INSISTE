import React, { useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { useForm } from '@inertiajs/react';
import Swal from 'sweetalert2';


interface Warehouse {
    id: number;
    name: string;
    adress: string;
    status: string;
}

interface Component {
    id: number;
    name: string;
    description: string;
    part_n: string;
    stock?: number;
}

interface WarehouseComponent {
    warehouse: Warehouse;
    components: Component[];
}

interface User {
    id: number;
    name: string;
}
interface FormDataType {
    idtechnician: number;
    assigned: {
        id_warehouse: number;
        id_component: number;
        stock: number;
    }[];
    [key: string]: any; // Added index signature
}

interface Props {
    warehouses: Warehouse[];
    components: WarehouseComponent[];
    user: User;
    warehouseC: Record<number, { id_warehouse: number; id_component: number; stock: number }[]>;
}

export default function AssingInv({ warehouses, components, user, warehouseC }: Props) {
    const [activeTab, setActiveTab] = useState(0);


    const initialData: FormDataType = {
        idtechnician: user.id,
        assigned: [],
    };

    const { data, setData, post, processing, errors } = useForm<FormDataType>(initialData);



    const handleInputChange = () => {
        let allCompAssign: Record<number, Record<number, number>> = {};

        components.forEach((warehouseComponent) => {
            const warehouseId = warehouseComponent.warehouse.id;
            allCompAssign[warehouseId] = {};

            warehouseComponent.components.forEach((component) => {
                const inputElement = document.querySelector(
                    `input[data-warehouse-id="${warehouseId}"][data-component-id="${component.id}"]`
                ) as HTMLInputElement;

                if (inputElement && inputElement.value) {
                    const stockValue = parseInt(inputElement.value, 10);
                    if (stockValue > 0) {
                        allCompAssign[warehouseId][component.id] = stockValue;
                    }
                }
            });
        });


        const assignedData = Object.entries(allCompAssign).flatMap(([id_warehouse, components]) =>
            Object.entries(components).map(([id_component, stock]) => ({
                id_warehouse: parseInt(id_warehouse, 10),
                id_component: parseInt(id_component, 10),
                stock,
            }))
        );

        setData('assigned', assignedData);

    }

    const handleStockChange = (e: React.ChangeEvent<HTMLInputElement>, maxStock: number) => {
        const value = parseInt(e.target.value, 10);

        if (value > maxStock) {
            Swal.fire('Cantidad inválida', `No puedes asignar más de ${maxStock} unidades.`, 'warning');
            e.target.value = String(maxStock);
        }

        handleInputChange(); // actualiza los datos
    };

    const sendData = () => {
        handleInputChange(); // Actualiza data.assigned

        setTimeout(() => {
            if (data.assigned.length === 0) {
                Swal.fire('Sin asignaciones', 'Debes asignar al menos un artículo.', 'warning');
                return;
            }

            // Crear contenido en formato tabla
            const tableRows = data.assigned.map(item => {
                const warehouseName = warehouses.find(w => w.id === item.id_warehouse)?.name || 'Desconocido';
                const componentName = components
                    .find(wc => wc.warehouse.id === item.id_warehouse)
                    ?.components.find(c => c.id === item.id_component)?.description || 'Artículo';

                return `
                    <tr>
                        <td style="border: 1px solid #ccc; padding: 6px;">${warehouseName}</td>
                        <td style="border: 1px solid #ccc; padding: 6px;">${componentName}</td>
                        <td style="border: 1px solid #ccc; padding: 6px; text-align:center;">${item.stock}</td>
                    </tr>
                `;
            }).join('');

            const htmlTable = `
                <table style="border-collapse: collapse; width: 100%; text-align: left; font-size: 14px;">
                    <thead>
                        <tr>
                            <th style="border: 1px solid #ccc; padding: 6px;">Bodega</th>
                            <th style="border: 1px solid #ccc; padding: 6px;">Artículo</th>
                            <th style="border: 1px solid #ccc; padding: 6px; text-align:center;">Cantidad</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRows}
                    </tbody>
                </table>
            `;

            Swal.fire({
                title: '¿Confirmar asignaciones?',
                html: htmlTable,
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Sí, asignar',
                cancelButtonText: 'Cancelar',
                width: '600px',
            }).then((result) => {
                if (result.isConfirmed) {
                    post(route('assingInvTech.assingInvStore'));
                }
            });
        }, 100);
    };



    return (
        <AppLayout breadcrumbs={[{ title: 'Inventario Técnico', href: '/assingInvTech/listInvTech' }]}>
            <Head title={`Asignacion de inventario `} />
            <div className='m-4'>

                <div className="m-4 text-gray-600/70 text-center font-semibold">
                    <p className='text-sm'>Mostrando artículos con stock</p>
                </div>

                <div className="tabs" id="tabs">
                    <ul className="flex border-b">
                        {components.map((warehouseComponent, index) => (
                            <li key={index} className="mr-1">
                                <button
                                    className={`bg-black inline-block py-2 px-4 text-white hover:text-gray-500 font-semibold rounded-t-lg`}
                                    onClick={() => setActiveTab(index)}
                                >
                                    {warehouseComponent.warehouse.name}
                                </button>
                            </li>
                        ))}
                    </ul>
                    {components.map((warehouseComponent, index) => (
                        <div
                            key={index}
                            className={`tab-content ${activeTab === index ? 'block' : 'hidden'}`}
                        >
                            <div className="m-4 shadow rounded-lg overflow-y-auto pb-[100px] overflow-x-auto">
                                <table className="min-w-[600px] w-full border-collapse text-sm text-gray-500 dark:text-gray-400">
                                    <thead className="bg-gray-100 dark:bg-gray-700">
                                        <tr>
                                            <th className="text-left px-4 py-2">Descripción</th>
                                            <th className="text-left px-4 py-2">Código</th>
                                            <th className="text-left px-4 py-2">Parte N°</th>
                                            <th className="text-left px-4 py-2">Stock sin Asignar</th>
                                            <th className='text-left px-4 py-2'>Asignar</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-left">
                                        {warehouseComponent.components.length > 0 ? (
                                            warehouseComponent.components.map((component) => (
                                                component.stock && component.stock > 0 ? (
                                                    <tr key={component.id} className="border-t">
                                                        <td className="px-4 py-2">{component.description}</td>
                                                        <td className="px-4 py-2">{component.name}</td>
                                                        <td className='px-4 py-2'>{component.part_n}</td>
                                                        <td className="px-4 py-2">{component.stock ?? 'N/A'}</td>
                                                        <td className="px-4 py-2">
                                                            <input
                                                                data-warehouse-id={warehouseComponent.warehouse.id}
                                                                data-component-id={component.id}
                                                                type="number"
                                                                className="w-16 border rounded px-2 py-1 text-center"
                                                                min="0"
                                                                step="1"
                                                                onChange={(e) => handleStockChange(e, component.stock ?? 0)}

                                                            />
                                                            {errors.assigned && (
                                                                <span className="text-red-500 text-xs">
                                                                    {errors.assigned[0]}
                                                                </span>
                                                            )}
                                                        </td>
                                                    </tr>

                                                ) : null
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={4} className="px-4 py-2 text-center">
                                                    No se encontraron artículos
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="m-4 text-gray-600/25 dark:text-gray-300/25 text-center font-semibold">
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        onClick={() => sendData()}
                    >
                        Asignar
                    </button>
                </div>

            </div>
        </AppLayout>
    );
}
