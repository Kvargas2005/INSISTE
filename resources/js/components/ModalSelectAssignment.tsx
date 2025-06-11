import { FormEventHandler, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { LoaderCircle } from 'lucide-react';

interface Assignment {
  id: number;
  customer_name: string;
  assign_date: string;
}

interface ModalSelectAssignmentProps {
  title: string;
  postRoute: string;
  assignments: Assignment[];
  onClose: () => void;
  technicianId: number;
}

export default function ModalSelectAssignment({ title, postRoute, assignments, onClose, technicianId }: ModalSelectAssignmentProps) {
  const { data, setData, post, processing, errors } = useForm({ id_assignment: '', id_technician: technicianId });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    post(route(postRoute), {
      preserveScroll: true,
      onSuccess: () => onClose(),
    });
  };

  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-10 w-full max-w-lg">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <form onSubmit={submit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="id_assignment">
              Seleccione una asignación
            </label>
            <select
              id="id_assignment"
              value={data.id_assignment}
              onChange={(e) => setData('id_assignment', e.target.value)}
              className="w-full border rounded p-2"
            >
              <option value="">Seleccione...</option>
              {assignments.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.customer_name} - {new Date(a.assign_date).toLocaleString()}
                </option>
              ))}
            </select>
            {errors.id_assignment && (
              <div className="text-red-500 text-sm">{errors.id_assignment}</div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-x-6 mt-10">
            <Button className="w-full" type="button" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={processing} className="w-full bg-blue-500 text-white hover:bg-blue-600">
              {processing ? <LoaderCircle className="animate-spin w-4 h-4 mx-auto" /> : 'Iniciar'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
