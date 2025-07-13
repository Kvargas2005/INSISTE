import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';

interface Props {
  idTechnician: number;
  idActa: number;
  open: boolean;
  onClose: () => void;
  technicianName: string;
  fechaVisita: string | null;
  onSuccess?: (rating: number, comment: string) => void;
  errorMessage?: string | null;
}

export default function ReviewModal({ idTechnician, idActa, open, onClose, technicianName, fechaVisita, onSuccess, errorMessage }: Props) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(errorMessage || null);

  if (!open) return null;

  const handleStarClick = (star: number) => {
    setRating(star);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError('Por favor selecciona una calificación.');
      return;
    }
    setLoading(true);
    setError(null);
    router.post(
      route('reviews.store'),
      {
        id_technician: idTechnician,
        id_acta: idActa,
        rating,
        comment,
      },
      {
        onSuccess: () => {
          setLoading(false);
          onClose();
          router.visit(route('reviews.my'));
        },
        onError: (err) => {
          setLoading(false);
          if (err && err.error) {
            setError(err.error);
          } else {
            setError('Error al enviar la calificación.');
          }
        },
      }
    );
  };

  // Mensaje personalizado
  let fecha = '';
  if (fechaVisita) {
    const d = new Date(fechaVisita);
    fecha = d.toLocaleDateString('es-CR', { year: 'numeric', month: 'long', day: 'numeric' });
  }
  const mensaje = `Califique la visita del técnico ${technicianName}${fecha ? ' realizada el ' + fecha : ''}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-all" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-lg p-6 w-full max-w-md z-10">
        <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" onClick={onClose}>&times;</button>
        <h2 className="text-lg font-bold mb-2 text-center">{mensaje}</h2>
        <form onSubmit={handleSubmit}>
          <div className="flex items-center gap-2 mb-4 justify-center">
            {[1,2,3,4,5].map(star => (
              <button
                key={star}
                type="button"
                onClick={() => handleStarClick(star)}
                className={star <= rating ? 'text-yellow-400 text-3xl' : 'text-gray-300 text-3xl'}
                aria-label={`Calificar ${star} estrellas`}
              >
                ★
              </button>
            ))}
          </div>
          <textarea
            className="w-full border rounded p-2 mb-2"
            placeholder="Comentario (opcional)"
            value={comment}
            onChange={e => setComment(e.target.value)}
            rows={3}
          />
          {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded w-full mt-2 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Enviando...' : 'Enviar'}
          </button>
        </form>
      </div>
    </div>
  );
}
