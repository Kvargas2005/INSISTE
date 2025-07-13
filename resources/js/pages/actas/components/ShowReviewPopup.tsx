import React, { useState } from 'react';
import ReviewModal from '@/components/ReviewModal';

interface Props {
  idTechnician: number;
  idActa: number;
  alreadyReviewed: boolean;
  technicianName: string;
  fechaVisita: string | null;
  onClose?: () => void;
  onSuccess?: (rating: number, comment: string) => void;
  errorMessage?: string | null;
}

export default function ShowReviewPopup({ idTechnician, idActa, alreadyReviewed, technicianName, fechaVisita, onClose, onSuccess, errorMessage }: Props) {
  const [open, setOpen] = useState(!alreadyReviewed);
  if (alreadyReviewed) return null;
  return (
    <ReviewModal
      idTechnician={idTechnician}
      idActa={idActa}
      technicianName={technicianName}
      fechaVisita={fechaVisita}
      open={open}
      onClose={() => {
        setOpen(false);
        if (onClose) onClose();
      }}
      onSuccess={onSuccess}
      errorMessage={errorMessage}
    />
  );
}
