import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

interface Review {
  id: number;
  id_technician: number;
  id_acta: number;
  rating: number;
  comment: string;
  status: number;
  acta: { id: number; code: string };
  created_at?: string;
}

interface Technician {
  id: number;
  name: string;
}

interface Props {
  technician: Technician;
  reviews: Review[];
}

function formatDate(dateStr?: string) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString();
}

export default function DetailTech({ technician, reviews }: Props) {
  const avg = reviews.length ? (reviews.reduce((a, b) => a + b.rating, 0) / reviews.length).toFixed(2) : null;

  return (
    <AppLayout>
      <Head title={`Reseñas de ${technician.name}`} />
      <div className="flex justify-between items-center m-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Reseñas de {technician.name}
        </h1>
        <Link href="/reviews" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm transition">← Volver a técnicos</Link>
      </div>
      <div className="m-4 mb-2 flex items-center gap-4">
        {avg && (
          <div className="flex items-center gap-2 bg-yellow-50 dark:bg-zinc-700 px-3 py-1 rounded">
            <span className="font-semibold text-yellow-600 dark:text-yellow-400">Promedio:</span>
            <span className="text-lg font-bold text-yellow-600 dark:text-yellow-400">{avg}</span>
            <span className="text-yellow-400">★</span>
          </div>
        )}
        <span className="text-gray-500 text-sm">{reviews.length} reseña{reviews.length === 1 ? '' : 's'}</span>
      </div>
      <div className="m-4 shadow rounded-lg overflow-y-auto pb-[100px] overflow-x-auto max-h-[500px] min-h-[400px] bg-white dark:bg-zinc-800">
        <table className="min-w-[600px] w-full border-collapse text-sm text-gray-500 dark:text-gray-400">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="text-left px-4 py-2">Acta</th>
              <th className="text-left px-4 py-2">Calificación</th>
              <th className="text-left px-4 py-2">Comentario</th>
              <th className="text-left px-4 py-2">Cliente</th>
              <th className="text-left px-4 py-2">Fecha</th>
            </tr>
          </thead>
          <tbody className="text-left">
            {reviews.length > 0 ? (
              reviews.map((r) => (
                <tr key={r.id} className="border-t hover:bg-gray-50 dark:hover:bg-zinc-700">
                  <td className="px-4 py-2">{r.acta?.code || r.id_acta}</td>
                  <td className="px-4 py-2">
                    <span className="inline-flex items-center gap-1">
                      {[1,2,3,4,5].map(i => (
                        <span key={i} className={i <= r.rating ? 'text-yellow-400' : 'text-gray-300'}>★</span>
                      ))}
                      <span className="ml-2 font-semibold text-gray-700 dark:text-gray-200">{r.rating}</span>
                    </span>
                  </td>
                  <td className="px-4 py-2 whitespace-pre-line max-w-xs">
                    {r.comment ? r.comment : <span className="italic text-gray-400">Sin comentario</span>}
                  </td>
                  <td className="px-4 py-2">{r.acta?.customer?.name || '-'}</td>
                  <td className="px-4 py-2">{formatDate(r.created_at)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-2 text-center">No hay reseñas para este técnico</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AppLayout>
  );
}
