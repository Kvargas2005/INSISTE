import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

interface Review {
  id: number;
  id_technician: number;
  id_acta: number;
  rating: number;
  comment: string;
  status: number;
  technician: { id: number; name: string };
  acta: { id: number; code: string };
}

interface Technician {
  id: number;
  name: string;
}

interface Props {
  reviews: Review[];
  technicians: Technician[];
}

export default function TechReviews({ reviews, technicians }: Props) {
  const [selectedTech, setSelectedTech] = useState<Technician | null>(null);
  const reviewsForTech = selectedTech ? reviews.filter(r => r.technician?.id === selectedTech.id) : [];

  return (
    <AppLayout>
      <Head title="Reseñas de Técnicos" />
      <div className="flex justify-between items-center m-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Técnicos</h1>
      </div>
      <div className="m-4 shadow rounded-lg overflow-y-auto pb-[100px] overflow-x-auto max-h-[500px] min-h-[300px]">
        <table className="min-w-[600px] w-full border-collapse text-sm text-gray-500 dark:text-gray-400">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="text-left px-4 py-2">Nombre</th>
              <th className="text-left px-4 py-2">Ver Reseñas</th>
            </tr>
          </thead>
          <tbody className="text-left">
            {technicians.length > 0 ? (
              technicians.map((tech) => (
                <tr key={tech.id} className="border-t">
                  <td className="px-4 py-2">{tech.name}</td>
                  <td className="px-4 py-2">
                    <Link
                      href={`/reviews/tecnico/${tech.id}`}
                      className={`px-3 py-1 rounded ${selectedTech?.id === tech.id ? 'bg-blue-700 text-white' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
                    >
                      Ver Reseñas
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={2} className="px-4 py-2 text-center">
                  No se encontraron técnicos
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {selectedTech && (
        <div className="m-4 shadow rounded-lg overflow-x-auto max-h-[500px] min-h-[200px] bg-white dark:bg-zinc-800 p-4">
          <h2 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">
            Reseñas de {selectedTech.name}
          </h2>
          <table className="min-w-[400px] w-full border-collapse text-sm text-gray-500 dark:text-gray-400">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-2 border">Acta</th>
                <th className="px-4 py-2 border">Calificación</th>
                <th className="px-4 py-2 border">Comentario</th>
              </tr>
            </thead>
            <tbody>
              {reviewsForTech.length > 0 ? (
                reviewsForTech.map((r) => (
                  <tr key={r.id}>
                    <td className="border px-4 py-2">{r.acta?.code || r.id_acta}</td>
                    <td className="border px-4 py-2">
                      {[1,2,3,4,5].map(i => (
                        <span key={i} className={i <= r.rating ? 'text-yellow-400' : 'text-gray-300'}>★</span>
                      ))}
                    </td>
                    <td className="border px-4 py-2">{r.comment}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-4 py-2 text-center">No hay reseñas para este técnico</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </AppLayout>
  );
}
