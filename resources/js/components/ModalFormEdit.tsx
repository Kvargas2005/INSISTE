import { useEffect } from 'react';
import { useForm, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { LoaderCircle } from 'lucide-react';
import Select from 'react-select';

interface EditModalFormProps {
    id: number;
    fetchRoute: string;
    postRoute: string;
    title: string;
    inputs: {
        name: string;
        label: string;
        type: string; // text, number, checkbox, select
        options?: { value: string | number; label: string }[]; // Opcional para select
    }[];
    onClose: () => void;
}

export default function EditModalForm({ id, fetchRoute, postRoute, title, inputs, onClose }: EditModalFormProps) {
    type FormData = { [key: string]: string | number | boolean | null | (string | number)[] };
    const { data, setData, setDefaults, post, processing, errors } = useForm<FormData>({});

    useEffect(() => {
        fetch(route(fetchRoute, { id }))
            .then(response => response.json())
            .then(json => {
                Object.entries(json.data).forEach(([key, value]) => {
                    if (key === 'services') {
                        setData(key, Array.isArray(value) ? value : []);
                    } else {
                        setData(key, value as string | number | boolean | null);
                    }
                });
            });
    }, [id]);


    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        // Si el campo services es array, lo mandamos como string separado por comas
        const sendData = { ...data };
        if (Array.isArray(sendData.services)) {
            sendData.services = sendData.services.join(',');
        }
        post(route(postRoute, { id }), { ...sendData, onSuccess: () => onClose() });
    };

    return (
        <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto" style={{ minWidth: '320px' }}>
                <h2 className="text-xl font-semibold mb-4">{title}</h2>
                <form onSubmit={submit}>
                    {inputs.map((input) => (
                        <div key={input.name} className="mb-6 relative">
                            {input.options && input.name === 'services' ? (
                                <Select
                                    id={input.name}
                                    options={input.options}
                                    isMulti
                                    value={
                                        Array.isArray(data[input.name])
                                            ? input.options.filter((o) => (data[input.name] as (string | number)[]).includes(o.value))
                                            : []
                                    }
                                    onChange={(selected) => setData(input.name, Array.isArray(selected) ? selected.map((s) => s.value) : [])}
                                    className="w-full"
                                />
                            ) : input.options ? (
                                <select
                                    id={input.name}
                                    value={String(data[input.name] ?? '')}
                                    onChange={(e) => setData(input.name, e.target.value)}
                                    className="block w-full appearance-none border-b-2 border-gray-300 focus:border-blue-500 bg-transparent py-2 px-0 text-gray-900 focus:outline-none"
                                >
                                    <option value="">Seleccione...</option>
                                    {input.options.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            ) : input.type === 'checkbox' ? (
                                <label className="flex items-center space-x-2">
                                    <input
                                        id={input.name}
                                        type="checkbox"
                                        checked={Boolean(data[input.name])}
                                        onChange={(e) => setData(input.name, e.target.checked)}
                                        className="form-checkbox h-5 w-5 text-blue-600"
                                    />
                                    <span>{input.label}</span>
                                </label>
                            ) : (
                                <>
                                    <input
                                        id={input.name}
                                        type={input.type}
                                        value={String(data[input.name] ?? '')}
                                        onChange={(e) => setData(input.name, e.target.value)}
                                        className="block w-full border-0 border-b-2 border-gray-300 bg-transparent py-2 px-0 text-gray-900 focus:border-blue-500 focus:outline-none"
                                    />
                                    <label
                                        htmlFor={input.name}
                                        className={`absolute left-0 top-2 text-gray-500 transition-all ${data[input.name] ? '-translate-y-5 text-xs text-blue-500' : ''
                                            }`}
                                    >
                                        {input.label}
                                    </label>
                                </>
                            )}
                            {errors[input.name] && (
                                <div className="text-red-500 text-sm mt-1">{errors[input.name]}</div>
                            )}
                        </div>
                    ))}
                    <div className="grid grid-cols-2 gap-4 mt-6">
                        <Button type="button" className="w-full" onClick={onClose}>Cancelar</Button>
                        <Button type="submit" disabled={processing} className="w-full">
                            {processing ? <LoaderCircle className="animate-spin w-4 h-4 mx-auto" /> : 'Guardar'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
