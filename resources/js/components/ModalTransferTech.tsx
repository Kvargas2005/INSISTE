import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { router } from '@inertiajs/react'

interface Option {
    value: number;
    label: string;
}

interface Props {
    onClose: () => void;
    postRoute: string;
    components: Option[];
    originOptions: Option[];
    destinationOptions: Option[];
    idTechnician: number;
}

export default function ModalTransferTech({ onClose, postRoute, components, originOptions, destinationOptions, idTechnician }: Props) {
    const [selectedWarehouse, setSelectedWarehouse] = useState<number | null>(null);
    const [warehouseComponents, setWarehouseComponents] = useState<Option[]>([]);
    const [selectedComponent, setSelectedComponent] = useState<number | null>(null);
    const [destinationTech, setDestinationTech] = useState<number | null>(null);
    const [quantity, setQuantity] = useState<number>(1);

    useEffect(() => {
        if (selectedWarehouse !== null) {
            axios.get(`/api/tech-stock`, {
                params: {
                    id_technician: idTechnician,
                    id_warehouse: selectedWarehouse
                }
            }).then(response => {
                console.log(response.data)
                const options = response.data.map((item: any) => ({
                    value: item.id_component,
                    label: item.component_name + ' (Stock: ' + item.quantity + ')'
                }));
                setWarehouseComponents(options);
            });
        }
    }, [selectedWarehouse]);

    const submit = () => {
        if (!selectedWarehouse || !selectedComponent || !destinationTech || quantity <= 0) {
            Swal.fire('Error', 'Todos los campos son obligatorios.', 'error');
            return;
        }

        axios.post(route(postRoute), {
            id_warehouse: selectedWarehouse,
            id_component: selectedComponent,
            idTechnician,
            destination_id: destinationTech,
            quantity
        }).then(() => {
            Swal.fire('Éxito', 'Traslado realizado correctamente.', 'success');
            onClose();
            router.reload({onFinish: onClose });
        }).catch((error) => {
            Swal.fire('Error', error.response?.data?.error || 'Hubo un problema.', 'error');
        });
    };

    return (
        <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-lg">
                <h2 className="text-lg font-semibold mb-4">Trasladar a otro técnico</h2>

                <label className="block mb-2">Bodega de origen</label>
                <select
                    value={selectedWarehouse || ''}
                    onChange={(e) => setSelectedWarehouse(Number(e.target.value))}
                    className="w-full mb-4 border p-2 rounded"
                >
                    <option value="">Seleccione...</option>
                    {originOptions.map((wh) => (
                        <option key={wh.value} value={wh.value}>{wh.label}</option>
                    ))}
                </select>

                <label className="block mb-2">Artículo</label>
                <select
                    value={selectedComponent || ''}
                    onChange={(e) => setSelectedComponent(Number(e.target.value))}
                    className="w-full mb-4 border p-2 rounded"
                >
                    <option value="">Seleccione...</option>
                    {warehouseComponents.map((comp) => (
                        <option key={comp.value} value={comp.value}>{comp.label}</option>
                    ))}
                </select>

                <label className="block mb-2">Técnico destino</label>
                <select
                    value={destinationTech || ''}
                    onChange={(e) => setDestinationTech(Number(e.target.value))}
                    className="w-full mb-4 border p-2 rounded"
                >
                    <option value="">Seleccione...</option>
                    {destinationOptions.map((tech) => (
                        <option key={tech.value} value={tech.value}>{tech.label}</option>
                    ))}
                </select>

                <label className="block mb-2">Cantidad</label>
                <input
                    type="number"
                    min={0}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full mb-4 border p-2 rounded"
                />

                <div className="flex justify-end space-x-2">
                    <button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">Cancelar</button>
                    <button onClick={submit} className="bg-blue-600 text-white px-4 py-2 rounded">Confirmar</button>
                </div>
            </div>
        </div>
    );
}
