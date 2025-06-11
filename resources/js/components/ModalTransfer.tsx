import React, { FormEvent, useEffect, useState } from 'react';
import { LoaderCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { router } from '@inertiajs/react'
import Swal from 'sweetalert2';
import Select from 'react-select';

interface Option {
    value: number;
    label: string;
}

interface Props {
    mode: 'warehouse' | 'technician';
    onClose: () => void;
    postRoute: string;
    components: Option[];
    warehouses: Option[];
}

export default function ModalTransfer({ mode, onClose, postRoute, components, warehouses }: Props) {
    const [componentId, setComponentId] = useState<number | null>(null);
    const [from, setFrom] = useState<number | null>(null);
    const [to, setTo] = useState<number | null>(null);
    const [quantity, setQuantity] = useState<number>(0);
    const [stock, setAvailableStock] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [filterDescription, setFilterDescription] = useState('');
    const [filterFamily, setFilterFamily] = useState('');
    const [filterBrand, setFilterBrand] = useState('');
    const [filteredComponents, setFilteredComponents] = useState(components);

    const isTechnician = mode === 'technician';

    useEffect(() => {
        if (!componentId || !from) return;
      
        const endpoint = mode === 'technician' 
          ? '/api/tech-stock' 
          : '/api/stock';
      
        const params = mode === 'technician'
          ? { id_component: componentId, id_technician: from }
          : { id_component: componentId, id_warehouse: from };
      
        axios.get(endpoint, { params })
          .then(res => setAvailableStock(res.data.stock))
          .catch(() => setAvailableStock(null));
      }, [componentId, from]);
      

    useEffect(() => {
        const fd = filterDescription.toLowerCase().trim();
        const ff = filterFamily.toLowerCase().trim();
        const fb = filterBrand.toLowerCase().trim();
        setFilteredComponents(
            components.filter((opt) => {
                const label = opt.label?.toLowerCase() ?? '';
                // Try to extract family and brand from label if not present as property
                let family = '';
                let brand = '';
                if ('familyName' in opt && typeof opt.familyName === 'string') {
                    family = opt.familyName.toLowerCase();
                } else if (opt.label && opt.label.includes('|')) {
                    // Try to parse: "desc | family | brand"
                    const parts = opt.label.split('|').map(s => s.trim());
                    family = parts[1]?.toLowerCase() ?? '';
                }
                if ('brandName' in opt && typeof opt.brandName === 'string') {
                    brand = opt.brandName.toLowerCase();
                } else if (opt.label && opt.label.includes('|')) {
                    const parts = opt.label.split('|').map(s => s.trim());
                    brand = parts[2]?.toLowerCase() ?? '';
                }
                return label.includes(fd) && family.includes(ff) && brand.includes(fb);
            })
        );
    }, [filterDescription, filterFamily, filterBrand, components]);

    // Prepare options for react-select with label: "descripcion | familia | marca"
    const selectOptions = filteredComponents.map(opt => {
        // Try to extract family and brand from opt, fallback to empty string
        let family = '';
        let brand = '';
        if ('familyName' in opt && typeof opt.familyName === 'string') {
            family = opt.familyName;
        } else if (opt.label && opt.label.includes('|')) {
            const parts = opt.label.split('|').map(s => s.trim());
            family = parts[1] ?? '';
        }
        if ('brandName' in opt && typeof opt.brandName === 'string') {
            brand = opt.brandName;
        } else if (opt.label && opt.label.includes('|')) {
            const parts = opt.label.split('|').map(s => s.trim());
            brand = parts[2] ?? '';
        }
        // Try to extract description from opt.label (before first '|')
        let description = opt.label;
        if (opt.label && opt.label.includes('|')) {
            description = opt.label.split('|')[0].trim();
        }
        return {
            value: opt.value,
            label: `${description} | ${family} | ${brand}`,
        };
    });

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!componentId || !from || !to || quantity <= 0) return;
        if (from === to) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'El origen y el destino no pueden ser el mismo.',
            });
            return;
        }
        if (stock !== null && quantity > stock) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'La cantidad excede el stock disponible.',
            });
            return;
        }

        setLoading(true);
        try {
            await axios.post(route(postRoute), {
                id_component: componentId,
                [isTechnician ? 'from_technician' : 'from_warehouse']: from,
                [isTechnician ? 'to_technician' : 'to_warehouse']: to,
                quantity,
            });

            await Swal.fire({
                icon: 'success',
                title: 'Traslado realizado',
                text: 'El traslado se completó exitosamente.',
                timer: 2500,
                showConfirmButton: false,
            });

            router.reload({ only: ['history'], onFinish: onClose });
        } catch (err) {
            console.error(err);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Ocurrió un error al realizar el traslado.',
            });
        } finally{
            setLoading(false)
        }
    };

    return (
        <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-10 w-full max-w-4xl">
                <h2 className="text-xl font-semibold mb-4">
                    Trasladar {isTechnician ? 'entre técnicos' : 'entre bodegas'}
                </h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label>Artículo</label>
                        <div className="flex flex-col md:flex-row gap-2 mb-2">
                            <input
                                type="text"
                                placeholder="Filtrar descripción"
                                value={filterDescription}
                                onChange={(e) => setFilterDescription(e.target.value)}
                                className="border rounded px-3 py-2 flex-grow"
                            />
                            <input
                                type="text"
                                placeholder="Filtrar familia"
                                value={filterFamily}
                                onChange={(e) => setFilterFamily(e.target.value)}
                                className="border rounded px-3 py-2 flex-grow"
                            />
                            <input
                                type="text"
                                placeholder="Filtrar marca"
                                value={filterBrand}
                                onChange={(e) => setFilterBrand(e.target.value)}
                                className="border rounded px-3 py-2 flex-grow"
                            />
                        </div>
                        <Select
                            className="w-full"
                            options={selectOptions}
                            value={selectOptions.find(o => o.value === componentId) || null}
                            onChange={option => setComponentId(option ? option.value : null)}
                            placeholder="Seleccione..."
                            isClearable
                        />
                    </div>

                    <div className="mb-4">
                        <label>{isTechnician ? 'Técnico origen' : 'Bodega origen'}</label>
                        <select
                            className="w-full border rounded p-2"
                            value={from ?? ''}
                            onChange={(e) => setFrom(Number(e.target.value))}
                        >
                            <option value="">Seleccione...</option>
                            {warehouses.map((w) => (
                                <option key={w.value} value={w.value}>{w.label}</option>
                            ))}
                        </select>
                    </div>

                    {stock !== null && (
                        <div className="text-sm text-gray-600 mb-4">
                            Stock disponible: <span className="font-semibold">{stock}</span>
                        </div>
                    )}

                    <div className="mb-4">
                        <label>{isTechnician ? 'Técnico destino' : 'Bodega destino'}</label>
                        <select
                            className="w-full border rounded p-2"
                            value={to ?? ''}
                            onChange={(e) => setTo(Number(e.target.value))}
                        >
                            <option value="">Seleccione...</option>
                            {warehouses.map((w) => (
                                <option key={w.value} value={w.value}>{w.label}</option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-4">
                        <label>Cantidad</label>
                        <input
                            type="number"
                            className="w-full border rounded p-2"
                            min={0}
                            max={stock ?? undefined}
                            onChange={(e) => setQuantity(Number(e.target.value))}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-6">
                        <Button type="button" onClick={onClose}>Cancelar</Button>
                        <Button type="submit" className="bg-blue-600 text-white" disabled={loading}>
                            {loading ? <LoaderCircle className="animate-spin w-4 h-4 mx-auto" /> : 'Trasladar'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}