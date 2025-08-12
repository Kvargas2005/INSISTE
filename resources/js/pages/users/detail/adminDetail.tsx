import React, { useEffect, useMemo, useState } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

interface Admin {
  id: number;
  name: string;
  email: string;
  phone?: string;
  status: number;
  provincia?: string;
  canton?: string;
  distrito?: string;
  adress?: string;
  deactivation_note?: string;
  deactivation_date?: string;
  created_at: string;
}

interface Props {
  admin: Admin;
}

export default function AdminDetail({ admin }: Props) {
  const [provinceName, setProvinceName] = useState<string>('');
  const [cantonName, setCantonName] = useState<string>('');
  const [districtName, setDistrictName] = useState<string>('');

  // Resolve address codes to names (CR API) like tech/local detail
  useEffect(() => {
    const prov = (admin.provincia ?? '').toString().trim();
    const canton = (admin.canton ?? '').toString().trim();
    const distrito = (admin.distrito ?? '').toString().trim();

    if (prov) {
      fetch('https://ubicaciones.paginasweb.cr/provincias.json')
        .then(r => r.json())
        .then((d) => setProvinceName(d[prov] || ''))
        .catch(() => setProvinceName(''));
    } else setProvinceName('');

    if (prov && canton) {
      fetch(`https://ubicaciones.paginasweb.cr/provincia/${prov}/cantones.json`)
        .then(r => r.json())
        .then((d) => setCantonName(d[canton] || ''))
        .catch(() => setCantonName(''));
    } else setCantonName('');

    if (prov && canton && distrito) {
      fetch(`https://ubicaciones.paginasweb.cr/provincia/${prov}/canton/${canton}/distritos.json`)
        .then(r => r.json())
        .then((d) => setDistrictName(d[distrito] || ''))
        .catch(() => setDistrictName(''));
    } else setDistrictName('');
  }, [admin.provincia, admin.canton, admin.distrito]);

  const statusPill = useMemo(() => (
    <span
      className="px-5 py-1 rounded-full"
      style={{
        backgroundColor: admin.status === 1 ? '#a7d697' : '#d69797',
        color: admin.status === 1 ? '#437b30' : '#873535',
        border: `1px solid ${admin.status === 1 ? '#437b30' : '#873535'}`,
      }}
    >
      {admin.status === 1 ? 'Activo' : 'Desactivado'}
    </span>
  ), [admin.status]);

  return (
    <AppLayout>
      <Head title={`Administrador: ${admin.name}`} />
      <div className="m-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{admin.name}</h1>
          <a href="/users/listAdmin" className="text-sm text-blue-600 hover:underline">Volver</a>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <section className="p-4 rounded border border-gray-200 dark:border-gray-700">
            <h2 className="font-semibold mb-3">Estado y contacto</h2>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2"><span className="w-28 text-gray-500">Estado:</span>{statusPill}</div>
              <div><span className="w-28 inline-block text-gray-500">Email:</span>{admin.email}</div>
              <div><span className="w-28 inline-block text-gray-500">Teléfono:</span>{admin.phone || '-'}</div>
              <div><span className="w-28 inline-block text-gray-500">Alta:</span>{new Date(admin.created_at).toLocaleDateString()}</div>
              {admin.status === 2 && (
                <div className="mt-2 text-xs text-gray-600 dark:text-gray-300">
                  <div><b>Motivo:</b> {admin.deactivation_note || '-'}</div>
                  <div><b>Fecha:</b> {admin.deactivation_date ? new Date(admin.deactivation_date).toLocaleDateString() : '-'}</div>
                </div>
              )}
            </div>
          </section>

          <section className="p-4 rounded border border-gray-200 dark:border-gray-700">
            <h2 className="font-semibold mb-3">Dirección</h2>
            <div className="space-y-2 text-sm">
              <div><span className="w-28 inline-block text-gray-500">Provincia:</span>{provinceName || admin.provincia || '-'}</div>
              <div><span className="w-28 inline-block text-gray-500">Cantón:</span>{cantonName || admin.canton || '-'}</div>
              <div><span className="w-28 inline-block text-gray-500">Distrito:</span>{districtName || admin.distrito || '-'}</div>
              <div><span className="w-28 inline-block text-gray-500">Dirección:</span>{admin.adress || '-'}</div>
            </div>
          </section>
        </div>
      </div>
    </AppLayout>
  );
}
