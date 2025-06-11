import React, { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import InputError from '@/components/input-error';

interface Props {
    values: {
        provincia: string;
        canton: string;
        distrito: string;
    };
    onChange: (field: string, value: string) => void;
    errors?: {
        provincia?: string;
        canton?: string;
        distrito?: string;
    };
}

export default function UbicacionForm({ values, onChange, errors }: Props) {
    const [provincias, setProvincias] = useState<{ id: string; nombre: string }[]>([]);
    const [cantones, setCantones] = useState<{ id: string; nombre: string }[]>([]);
    const [distritos, setDistritos] = useState<{ id: string; nombre: string }[]>([]);

    useEffect(() => {
        fetch('https://ubicaciones.paginasweb.cr/provincias.json')
            .then((res) => res.json())
            .then((data) => {
                const entries = Object.entries(data).map(([id, nombre]) => ({ id, nombre: nombre as string }));
                setProvincias(entries);
            });
    }, []);

    useEffect(() => {
        if (values.provincia) {
            fetch(`https://ubicaciones.paginasweb.cr/provincia/${values.provincia}/cantones.json`)
                .then((res) => res.json())
                .then((data) => {
                    const entries = Object.entries(data).map(([id, nombre]) => ({ id, nombre: nombre as string }));
                    setCantones(entries);
                });
        } else {
            setCantones([]);
            setDistritos([]);
        }
    }, [values.provincia]);

    useEffect(() => {
        if (values.provincia && values.canton) {
            fetch(`https://ubicaciones.paginasweb.cr/provincia/${values.provincia}/canton/${values.canton}/distritos.json`)
                .then((res) => res.json())
                .then((data) => {
                    const entries = Object.entries(data).map(([id, nombre]) => ({ id, nombre: nombre as string }));
                    setDistritos(entries);
                });
        } else {
            setDistritos([]);
        }
    }, [values.provincia, values.canton]);

    return (
        <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                <div className="grid gap-2">
                    <Label htmlFor="provincia">Provincia</Label>
                    <select
                        id="provincia"
                        value={values.provincia}
                        onChange={(e) => {
                            onChange('provincia', e.target.value);
                            onChange('canton', '');
                            onChange('distrito', '');
                        }}
                        className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">Seleccione una provincia</option>
                        {provincias.map((prov: any) => (
                            <option key={prov.id} value={prov.id}>
                                {prov.nombre}
                            </option>
                        ))}
                    </select>
                    <InputError message={errors?.provincia} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="canton">Cantón</Label>
                    <select
                        id="canton"
                        value={values.canton}
                        onChange={(e) => {
                            onChange('canton', e.target.value);
                            onChange('distrito', '');
                        }}
                        className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        disabled={!cantones.length}
                    >
                        <option value="">Seleccione un cantón</option>
                        {cantones.map((canton: any) => (
                            <option key={canton.id} value={canton.id}>
                                {canton.nombre}
                            </option>
                        ))}
                    </select>
                    <InputError message={errors?.canton} />
                </div>
                

                <div className="grid gap-2">
                    <Label htmlFor="distrito">Distrito</Label>
                    <select
                        id="distrito"
                        value={values.distrito}
                        onChange={(e) => onChange('distrito', e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        disabled={!distritos.length}
                    >
                        <option value="">Seleccione un distrito</option>
                        {distritos.map((distrito: any) => (
                            <option key={distrito.id} value={distrito.id}>
                                {distrito.nombre}
                            </option>
                        ))}
                    </select>
                    <InputError message={errors?.distrito} />
                </div>
            </div>
        </>
    );
}
