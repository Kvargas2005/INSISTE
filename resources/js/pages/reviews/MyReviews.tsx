import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import ShowReviewPopup from '../actas/components/ShowReviewPopup';

interface ReviewableActa {
  id: number;
  code: string;
  start_time: string;
  creator: { id: number; name: string };
  technicianName: string;
  fechaVisita: string | null;
}

interface Review {
  id: number;
  id_acta: number;
  rating: number;
  comment: string;
  technicianName: string;
  fechaVisita: string | null;
}

interface Props {
  reviewed: Review[];
  pending: ReviewableActa[];
  pendingRecent?: ReviewableActa | null;
  flashError?: string | null;
}

const MyReviews: React.FC<Props> = ({ reviewed: initialReviewed, pending: initialPending, pendingRecent, flashError }) => {
  const [popupActa, setPopupActa] = useState<ReviewableActa | null>(null);
  const [reviewed, setReviewed] = useState<Review[]>(initialReviewed);
  const [pending, setPending] = useState<ReviewableActa[]>(initialPending);
  const [hasJustReviewed, setHasJustReviewed] = useState(false);

  // Mostrar automáticamente el popup SOLO si hay una acta pendiente reciente (últimas 24h)
  React.useEffect(() => {
    if (
      !hasJustReviewed &&
      pendingRecent &&
      !reviewed.some(r => r.id_acta === pendingRecent.id)
    ) {
      setPopupActa(pendingRecent);
    }
  }, [pendingRecent, reviewed, hasJustReviewed]);

  const handleReviewSuccess = (acta: ReviewableActa, rating: number, comment: string) => {
    setPopupActa(null);
    setHasJustReviewed(true); // Evita que el modal se vuelva a abrir tras reload
    setTimeout(() => setHasJustReviewed(false), 1000); // Permite futuros popups tras reload
  };

  return (
    <AppLayout>
      <Head title="Mis Reseñas" />
      <div className="flex justify-between items-center m-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Mis Reseñas</h1>
      </div>
      <div className="m-4 shadow rounded-lg overflow-y-auto pb-[100px] overflow-x-auto max-h-[500px] min-h-[300px]">
        <h2 className="text-lg font-semibold mb-2 p-4">Pendientes de Calificar</h2>
        {pending.length === 0 ? (
          <div className="text-gray-500 px-4 pb-4">No tienes actas pendientes de reseñar.</div>
        ) : (
          <table className="min-w-[600px] w-full border-collapse text-sm text-gray-500 dark:text-gray-400 mb-4">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="text-left px-4 py-2">Código</th>
                <th className="text-left px-4 py-2">Técnico</th>
                <th className="text-left px-4 py-2">Fecha</th>
                <th className="text-left px-4 py-2"></th>
              </tr>
            </thead>
            <tbody className="text-left">
              {pending.map((a) => (
                <tr key={a.id} className="border-t">
                  <td className="px-4 py-2">{a.code}</td>
                  <td className="px-4 py-2">{a.technicianName}</td>
                  <td className="px-4 py-2">{a.fechaVisita ? new Date(a.fechaVisita).toLocaleDateString('es-CR') : ''}</td>
                  <td className="px-4 py-2">
                    <button
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                      onClick={() => setPopupActa(a)}
                    >
                      Calificar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <div className="m-4 shadow rounded-lg overflow-y-auto pb-[100px] overflow-x-auto max-h-[500px] min-h-[300px]">
        <h2 className="text-lg font-semibold mb-2 p-4">Reseñas Realizadas</h2>
        {reviewed.length === 0 ? (
          <div className="text-gray-500 px-4 pb-4">No has realizado ninguna reseña.</div>
        ) : (
          <table className="min-w-[600px] w-full border-collapse text-sm text-gray-500 dark:text-gray-400">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="text-left px-4 py-2">Código</th>
                <th className="text-left px-4 py-2">Técnico</th>
                <th className="text-left px-4 py-2">Fecha</th>
                <th className="text-left px-4 py-2">Calificación</th>
                <th className="text-left px-4 py-2">Comentario</th>
              </tr>
            </thead>
            <tbody className="text-left">
              {reviewed.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="px-4 py-2">{r.id_acta}</td>
                  <td className="px-4 py-2">{r.technicianName}</td>
                  <td className="px-4 py-2">{r.fechaVisita ? new Date(r.fechaVisita).toLocaleDateString('es-CR') : ''}</td>
                  <td className="px-4 py-2">
                    <span className="inline-flex items-center gap-1">
                      {[1,2,3,4,5].map(i => (
                        <span key={i} className={i <= r.rating ? 'text-yellow-400' : 'text-gray-300'}>★</span>
                      ))}
                      <span className="ml-2 font-semibold text-gray-700 dark:text-gray-200">{r.rating}</span>
                    </span>
                  </td>
                  <td className="px-4 py-2 whitespace-pre-line max-w-xs">{r.comment}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {popupActa && (
        <ShowReviewPopup
          idTechnician={popupActa.creator.id}
          idActa={popupActa.id}
          alreadyReviewed={false}
          technicianName={popupActa.technicianName}
          fechaVisita={popupActa.fechaVisita}
          onSuccess={(rating: number, comment: string) => handleReviewSuccess(popupActa, rating, comment)}
          onClose={() => setPopupActa(null)}
          errorMessage={flashError}
        />
      )}
    </AppLayout>
  );
};

export default MyReviews;
