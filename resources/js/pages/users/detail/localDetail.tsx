import React, { useEffect, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

interface FileItem { id: number; filename: string; path: string; }
interface MainUserInfo { id: number; name: string; description?: string; }

interface LocalUser {
  id: number;
  name: string;
  email: string;
  phone?: string;
  status: number;
  provincia?: string;
  canton?: string;
  distrito?: string;
  adress?: string;
  mails?: string;
  opening_hours?: string | null;
  closing_hours?: string | null;
  contact1_name?: string | null;
  contact1_phone?: string | null;
  contact1_email?: string | null;
  contact2_name?: string | null;
  contact2_phone?: string | null;
  contact2_email?: string | null;
  id_main_user?: number | null;
  hiringdate?: string | null;
  rut_nit?: string | null;
  deactivation_note?: string | null;
  deactivation_date?: string | null;
  created_at?: string;
  files?: FileItem[];
  main_user?: MainUserInfo | null; // use snake_case to match Laravel
}

interface Props { local: LocalUser; }

export default function LocalDetail({ local }: Props) {
  const Label = ({ children }: { children: React.ReactNode }) => (
    <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">{children}</div>
  );
  const Value = ({ children }: { children: React.ReactNode }) => (
    <div className="text-sm text-gray-800 dark:text-gray-200 break-words">{children ?? '-'}</div>
  );
  const Chip = ({ ok, text }: { ok: boolean; text: string }) => (
    <span className={`px-2 py-1 rounded text-xs font-semibold ${ok ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{text}</span>
  );
  const isImage = (name: string) => /\.(jpe?g|png|gif|webp)$/i.test(name);

  // Resolve address codes to names (CR API)
  const [provName, setProvName] = useState('');
  const [cantonName, setCantonName] = useState('');
  const [distName, setDistName] = useState('');
  useEffect(() => {
    const prov = (local.provincia ?? '').toString().trim();
    const canton = (local.canton ?? '').toString().trim();
    const distrito = (local.distrito ?? '').toString().trim();

    if (prov) {
      fetch('https://ubicaciones.paginasweb.cr/provincias.json')
        .then(r => r.json())
        .then((d) => setProvName(d[prov] || ''))
        .catch(() => setProvName(''));
    } else setProvName('');

    if (prov && canton) {
      fetch(`https://ubicaciones.paginasweb.cr/provincia/${prov}/cantones.json`)
        .then(r => r.json())
        .then((d) => setCantonName(d[canton] || ''))
        .catch(() => setCantonName(''));
    } else setCantonName('');

    if (prov && canton && distrito) {
      fetch(`https://ubicaciones.paginasweb.cr/provincia/${prov}/canton/${canton}/distritos.json`)
        .then(r => r.json())
        .then((d) => setDistName(d[distrito] || ''))
        .catch(() => setDistName(''));
    } else setDistName('');
  }, [local.provincia, local.canton, local.distrito]);

  return (
    <AppLayout>
      <Head title={`Local · ${local.name}`} />

      <div className="m-4 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{local.name}</h1>
          <div className="mt-1 text-sm text-gray-600 dark:text-gray-300">Email: {local.email}</div>
        </div>
        <Link href="/users/locales" className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">Volver</Link>
      </div>

      <div className="m-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <section className="bg-white dark:bg-gray-900 rounded shadow p-4 space-y-3">
          <h2 className="font-semibold text-gray-800 dark:text-gray-100">Estado y Referencias</h2>
          <div className="grid grid-cols-1 gap-3">
            <div>
              <Label>Estado</Label>
              <Value><Chip ok={local.status === 1} text={local.status === 1 ? 'Activo' : 'Desactivado'} /></Value>
            </div>
            <div>
              <Label>Cliente</Label>
              <Value>{local.main_user?.name || '-'}</Value>
            </div>
            <div>
              <Label>RUT/NIT</Label>
              <Value>{local.rut_nit || '-'}</Value>
            </div>
            <div>
              <Label>Fecha Registro</Label>
              <Value>{local.hiringdate ? new Date(local.hiringdate).toLocaleDateString() : '-'}</Value>
            </div>
          </div>
        </section>

        <section className="bg-white dark:bg-gray-900 rounded shadow p-4 space-y-3 lg:col-span-2">
          <h2 className="font-semibold text-gray-800 dark:text-gray-100">Dirección</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <Label>Provincia</Label>
              <Value>{provName || local.provincia || '-'}</Value>
            </div>
            <div>
              <Label>Cantón</Label>
              <Value>{cantonName || local.canton || '-'}</Value>
            </div>
            <div>
              <Label>Distrito</Label>
              <Value>{distName || local.distrito || '-'}</Value>
            </div>
            <div className="md:col-span-2">
              <Label>Dirección</Label>
              <Value>{local.adress || '-'}</Value>
            </div>
          </div>
        </section>
      </div>

      <div className="m-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <section className="bg-white dark:bg-gray-900 rounded shadow p-4 space-y-3">
          <h2 className="font-semibold text-gray-800 dark:text-gray-100">Contacto</h2>
          <div className="grid grid-cols-1 gap-3">
            <div>
              <Label>Teléfono</Label>
              <Value>{local.phone || '-'}</Value>
            </div>
            <div>
              <Label>Correos de acta</Label>
              <Value>{local.mails || '-'}</Value>
            </div>
            <div>
              <Label>Horario</Label>
              <Value>{[local.opening_hours, local.closing_hours].filter(Boolean).join(' - ') || '-'}</Value>
            </div>
          </div>
        </section>

        <section className="bg-white dark:bg-gray-900 rounded shadow p-4 space-y-3">
          <h2 className="font-semibold text-gray-800 dark:text-gray-100">Contactos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label>Contacto 1</Label>
              <Value>
                <div>{local.contact1_name || '-'}</div>
                <div className="text-xs text-gray-500">{local.contact1_phone || '-'}</div>
                <div className="text-xs text-gray-500">{local.contact1_email || '-'}</div>
              </Value>
            </div>
            <div>
              <Label>Contacto 2</Label>
              <Value>
                <div>{local.contact2_name || '-'}</div>
                <div className="text-xs text-gray-500">{local.contact2_phone || '-'}</div>
                <div className="text-xs text-gray-500">{local.contact2_email || '-'}</div>
              </Value>
            </div>
          </div>
        </section>
      </div>

      <div className="m-4 bg-white dark:bg-gray-900 rounded shadow p-4">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">Archivos</h2>
        {local.files && local.files.length ? (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {local.files.map((f) => (
              <li key={f.id} className="py-2 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  {isImage(f.filename) ? (
                    <img src={`/storage/${f.path}`} alt={f.filename} className="w-12 h-12 object-cover rounded border" />
                  ) : f.filename.match(/\.(pdf)$/i) ? (
                    <div className="w-12 h-12 bg-red-100 text-red-600 flex items-center justify-center rounded border">PDF</div>
                  ) : f.filename.match(/\.(doc|docx)$/i) ? (
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 flex items-center justify-center rounded border">DOC</div>
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 text-gray-700 flex items-center justify-center rounded border">FILE</div>
                  )}
                  <span className="text-sm text-gray-700 dark:text-gray-200 break-all">{f.filename}</span>
                </div>
                <a href={`/storage/${f.path}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">Ver</a>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-sm text-gray-500">Sin archivos</div>
        )}
      </div>
    </AppLayout>
  );
}
