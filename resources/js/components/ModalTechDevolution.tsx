// ModalFormDevolution.tsx
import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { router } from '@inertiajs/react';

interface Option {
    value: number;
    label: string;
}

interface Props {
    onClose: () => void;
    postRoute: string;
    components: Option[];
    technicians: Option[];
    warehouses: Option[];
    idTechnician: number;
}


export default function ModalFormDevolution({ onClose, postRoute, components, technicians, warehouses, idTechnician }: Props) {
    const [selectedComponent, setSelectedComponent] = useState<number | null>(null);
    const [selectedTechnician, setSelectedTechnician] = useState<number | null>(idTechnician);
    const [selectedWarehouse, setSelectedWarehouse] = useState<number | null>(null);
    const [quantity, setQuantity] = useState<number>(1);


    const submit = () => {
        if (!selectedComponent || !selectedTechnician || !selectedWarehouse || quantity <= 0) {
            Swal.fire('Error', 'Todos los campos son obligatorios.', 'error');
            return;
        }

        axios.post(route(postRoute), {
            id_component: selectedComponent,
            id_technician: selectedTechnician,
            id_warehouse: selectedWarehouse,
            quantity,
        }).then(() => {
            Swal.fire('Éxito', 'Devolución realizada con éxito.', 'success');
            onClose();
            router.reload({ onFinish: onClose });
        }).catch((error) => {
            Swal.fire('Error', error.response?.data?.error || 'Hubo un problema.', 'error');
        });
    };

    return (
        <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-lg">
                <h2 className="text-lg font-semibold mb-4">Devolver Artículo</h2>

                <label className="block mb-2">Artículo</label>
                <select
                    value={selectedComponent || ''}
                    onChange={(e) => setSelectedComponent(Number(e.target.value))}
                    className="w-full mb-4 border p-2 rounded"
                >
                    <option value="">Seleccione...</option>
                    {components.map((comp) => (
                        <option key={comp.value} value={comp.value}>{comp.label}</option>
                    ))}
                </select>

                <label className="block mb-2">Técnico</label>
                <select
                    value={selectedTechnician || ''}
                    onChange={(e) => setSelectedTechnician(Number(e.target.value))}
                    className="w-full mb-4 border p-2 rounded"
                >
                    <option value="">Seleccione...</option>
                    {technicians.map((tech) => (
                        <option key={tech.value} value={tech.value}>{tech.label}</option>
                    ))}
                </select>

                <label className="block mb-2">Bodega</label>
                <select
                    value={selectedWarehouse || ''}
                    onChange={(e) => setSelectedWarehouse(Number(e.target.value))}
                    className="w-full mb-4 border p-2 rounded"
                >
                    <option value="">Seleccione...</option>
                    {warehouses.map((wh) => (
                        <option key={wh.value} value={wh.value}>{wh.label}</option>
                    ))}
                </select>

                <label className="block mb-2">Cantidad</label>
                <input
                    type="number"
                    min={1}
                    value={quantity}
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
