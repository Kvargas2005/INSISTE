import React, { FormEventHandler, useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { LoaderCircle } from 'lucide-react';
import Select from 'react-select';

interface ModalFormProps {
  title: string;
  postRoute: string;
  inputs: {
    name: string;
    label: string;
    type: string;
    placeholder?: string;
    options?: {
      value: string | number;
      label: string;
      familyName?: string;
      brandName?: string;
    }[];
    extra?: React.ReactNode;
    selectType?: 'react' | 'native';
  }[];
  onClose: () => void;
  extraData?: Record<string, any>;
  setExtraData?: React.Dispatch<React.SetStateAction<any>>;
}

export default function ModalForm({ title, postRoute, inputs, onClose, extraData, setExtraData }: ModalFormProps) {
  // Inicializar campos, si es services debe ser array
  const initialData = inputs.reduce((acc, input) => {
    if (input.name === 'services') {
      return { ...acc, [input.name]: [] };
    }
    return { ...acc, [input.name]: '' };
  }, {});
  type FormData = { [key: string]: string | number | boolean | null | (string | number)[] };

  const { data, setData, post, processing, errors } = useForm<FormData>(initialData);

  const hasComponentSelect = inputs.some(
    (input) => input.name === 'id_component' && input.type === 'select' && input.selectType === 'react'
  );

  const [filterDescription, setFilterDescription] = useState('');
  const [filterFamily, setFilterFamily] = useState('');
  const [filterBrand, setFilterBrand] = useState('');

  const componentInput = inputs.find(
    (input) => input.name === 'id_component' && input.type === 'select' && input.selectType === 'react'
  );
  const originalOptions = componentInput?.options || [];

  const [filteredOptions, setFilteredOptions] = useState(originalOptions);

  useEffect(() => {
    if (!hasComponentSelect) return;

    const fd = filterDescription.toLowerCase().trim();
    const ff = filterFamily.toLowerCase().trim();
    const fb = filterBrand.toLowerCase().trim();

    const filtered = originalOptions.filter((opt) => {
      const label = opt.label.toLowerCase();
      const family = (opt.familyName ?? '').toLowerCase();
      const brand = (opt.brandName ?? '').toLowerCase();

      return label.includes(fd) && family.includes(ff) && brand.includes(fb);
    });

    setFilteredOptions(filtered);
  }, [filterDescription, filterFamily, filterBrand, originalOptions, hasComponentSelect]);

  useEffect(() => {
    if (extraData) {
      for (const key in extraData) {
        setData(key, extraData[key]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [extraData]);

  // (Eliminado: No sincronizar cambios del formulario hacia el padre para evitar ciclos infinitos)

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    post(route(postRoute), {
      preserveScroll: true,
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        className="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        style={{ minWidth: '320px' }}
      >
        <h2 className="text-xl font-semibold mb-6">{title}</h2>

        {hasComponentSelect && (
          <div className="flex flex-col md:flex-row gap-2 mb-6">
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
        )}

        <form onSubmit={submit} className="flex flex-col gap-5">
          {inputs.map((input) => (
            <div key={input.name} className="flex flex-col">
              <label className="block text-sm font-medium mb-1" htmlFor={input.name}>
                {input.label}
              </label>
              {input.extra && (
                <div className="mb-2">{input.extra}</div>
              )}
              {input.type === 'select' && input.selectType === 'react' ? (
                <Select
                  id={input.name}
                  options={input.options}
                  isMulti={input.name === 'services'} // Permitir multi solo para servicios
                  value={
                    input.name === 'services'
                      ? input.options?.filter((o) => Array.isArray(data[input.name]) && (data[input.name] as any[]).includes(o.value))
                      : input.options?.find((o) => o.value === data[input.name]) || null
                  }
                  onChange={(selected) => {
                    if (input.name === 'services') {
                      setData(input.name, Array.isArray(selected) ? selected.map((s: any) => s.value) : []);
                    } else {
                      setData(input.name, (selected as any)?.value ?? '');
                    }
                  }}
                  className="w-full"
                />
              ) : input.type === 'select' ? (
                <select
                  id={input.name}
                  value={String(data[input.name] ?? '')}
                  onChange={(e) => setData(input.name, e.target.value)}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="">Seleccione...</option>
                  {input.options?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : input.type === 'checkbox' ? (
                <input
                  id={input.name}
                  type="checkbox"
                  checked={Boolean(data[input.name])}
                  onChange={(e) => setData(input.name, e.target.checked)}
                  className="mr-2"
                />
              ) : input.type === 'textarea' ? (
                <textarea
                  id={input.name}
                  value={String(data[input.name] ?? '')}
                  onChange={(e) => setData(input.name, e.target.value)}
                  className="w-full border rounded px-3 py-2"
                />
              ) : (
                <input
                  id={input.name}
                  type={input.type}
                  value={String(data[input.name] ?? '')}
                  onChange={(e) => setData(input.name, e.target.value)}
                  className="w-full border rounded px-3 py-2"
                />
              )}
              {errors[input.name] && (
                <div className="text-red-500 text-sm mt-1">{errors[input.name]}</div>
              )}
            </div>
          ))}

          <div className="flex justify-end gap-4 mt-6">
            <Button type="button" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={processing}
              className="bg-blue-500 text-white hover:bg-blue-600"
            >
              {processing ? <LoaderCircle className="animate-spin w-4 h-4 mx-auto" /> : 'Crear'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
