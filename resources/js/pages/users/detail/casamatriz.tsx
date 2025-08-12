import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

interface Client {
  id: number;
  name: string;
  description?: string | null;
  registration_date?: string | null;
  rut_nit?: string | null;
  main_address?: string | null;
  main_phone?: string | null;
  main_email?: string | null;
  contact_firstname?: string | null;
  contact_lastname?: string | null;
  contact_phone?: string | null;
  contact_phone_ext?: string | null;
  contact_mobile?: string | null;
  contact_email?: string | null;
  status: number;
  created_at?: string;
}

interface Props { client: Client; }

export default function CasaMatrizDetail({ client }: Props) {
  const Chip = ({ ok, text }: { ok: boolean; text: string }) => (
    <span className={`px-2 py-1 rounded text-xs font-semibold ${ok ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{text}</span>
  );
  const Label = ({ children }: { children: React.ReactNode }) => (
    <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">{children}</div>
  );
  const Value = ({ children }: { children: React.ReactNode }) => (
    <div className="text-sm text-gray-800 dark:text-gray-200 break-words">{children ?? '-'}</div>
  );

  return (
    <AppLayout>
      <Head title={`Cliente · ${client.name}`} />

      <div className="m-4 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{client.name}</h1>
          {client.description && (
            <div className="mt-1 text-sm text-gray-600 dark:text-gray-300">{client.description}</div>
          )}
        </div>
        <Link href="/users/clientes" className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">Volver</Link>
      </div>

      <div className="m-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <section className="bg-white dark:bg-gray-900 rounded shadow p-4 space-y-3">
          <h2 className="font-semibold text-gray-800 dark:text-gray-100">Estado</h2>
          <div>
            <Chip ok={client.status === 1} text={client.status === 1 ? 'Activo' : 'Desactivado'} />
          </div>
          <div>
            <Label>Fecha Registro</Label>
            <Value>{client.registration_date ? new Date(client.registration_date).toLocaleDateString() : '-'}</Value>
          </div>
          <div>
            <Label>RUT/NIT</Label>
            <Value>{client.rut_nit || '-'}</Value>
          </div>
        </section>

        <section className="bg-white dark:bg-gray-900 rounded shadow p-4 space-y-3 lg:col-span-2">
          <h2 className="font-semibold text-gray-800 dark:text-gray-100">Dirección y Contacto</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="md:col-span-2">
              <Label>Dirección</Label>
              <Value>{client.main_address || '-'}</Value>
            </div>
            <div>
              <Label>Teléfono</Label>
              <Value>{client.main_phone || '-'}</Value>
            </div>
            <div>
              <Label>Email</Label>
              <Value>{client.main_email || '-'}</Value>
            </div>
          </div>
        </section>
      </div>

      <div className="m-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <section className="bg-white dark:bg-gray-900 rounded shadow p-4 space-y-3">
          <h2 className="font-semibold text-gray-800 dark:text-gray-100">Contacto Principal</h2>
          <div className="grid grid-cols-1 gap-3">
            <div>
              <Label>Nombre</Label>
              <Value>{[client.contact_firstname, client.contact_lastname].filter(Boolean).join(' ') || '-'}</Value>
            </div>
            <div>
              <Label>Teléfono</Label>
              <Value>
                {[client.contact_phone, client.contact_phone_ext].filter(Boolean).join(' ext. ') || '-'}
              </Value>
            </div>
            <div>
              <Label>Móvil</Label>
              <Value>{client.contact_mobile || '-'}</Value>
            </div>
            <div>
              <Label>Email</Label>
              <Value>{client.contact_email || '-'}</Value>
            </div>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
