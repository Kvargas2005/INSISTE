import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';

interface Props {
  code: string;
  expires_at: string;
}

export default function CodigoVerificacion({ code, expires_at }: Props) {
  const [remaining, setRemaining] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const expiration = new Date(expires_at).getTime();
      const diff = Math.max(expiration - now, 0);

      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);

      setRemaining(`${minutes}:${seconds.toString().padStart(2, '0')}`);

      if (diff <= 0) {
        clearInterval(interval);
        setRemaining('Expirado');
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expires_at]);

  return (
    <AppLayout>
      <Head title="Código de Verificación" />
      <div className="flex flex-col items-center justify-center h-full py-20">
        <h2 className="text-2xl font-bold mb-4">Tu código de verificación</h2>

        <div className="text-6xl font-bold text-blue-600 tracking-widest">
          {code}
        </div>

        <p className="mt-4 text-gray-600">
          Caduca en: <strong>{remaining}</strong>
        </p>

        <p className="mt-2 text-sm text-gray-500">
          Este código es único y válido por 5 minutos.
        </p>
      </div>
    </AppLayout>
  );
}
