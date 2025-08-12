import React, { useEffect, useRef, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import SignatureCanvas from 'react-signature-canvas';

interface FileItem {
  id: number;
  filename: string;
  path: string;
}

interface Technician {
  id: number;
  name: string;
  email: string;
  phone?: string;
  status: number;
  provincia?: string;
  canton?: string;
  distrito?: string;
  adress?: string;
  specialization?: string;
  tech_signature?: string | null;
  hiringdate?: string | null;
  code?: string | null;
  driver_license?: string | null;
  vehicle_brand?: string | null;
  vehicle_plate?: string | null;
  social_security?: string | null;
  personal_email?: string | null;
  tech_type?: string | null;
  contact1_name?: string | null;
  contact1_phone?: string | null;
  contact1_email?: string | null;
  contact2_name?: string | null;
  contact2_phone?: string | null;
  contact2_email?: string | null;
  opening_hours?: string | null;
  closing_hours?: string | null;
  deactivation_note?: string | null;
  deactivation_date?: string | null;
  created_at?: string;
  updated_at?: string;
  files?: FileItem[];
}

interface Props {
  technician: Technician;
}

export default function TechDetail({ technician }: Props) {
  // Helpers
  const Chip = ({ ok, text }: { ok: boolean; text: string }) => (
    <span className={`px-2 py-1 rounded text-xs font-semibold ${ok ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{text}</span>
  );
  const Label = ({ children }: { children: React.ReactNode }) => (
    <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">{children}</div>
  );
  const Value = ({ children }: { children: React.ReactNode }) => (
    <div className="text-sm text-gray-800 dark:text-gray-200 break-words">{children ?? '-'}</div>
  );
  const isImage = (name: string) => /\.(jpe?g|png|gif|webp)$/i.test(name);

  // Map numeric address codes to names (CR API)
  const [provName, setProvName] = useState<string>('');
  const [cantonName, setCantonName] = useState<string>('');
  const [distName, setDistName] = useState<string>('');
  useEffect(() => {
    const prov = (technician.provincia ?? '').toString().trim();
    const canton = (technician.canton ?? '').toString().trim();
    const distrito = (technician.distrito ?? '').toString().trim();

    // Province
    if (prov) {
      fetch('https://ubicaciones.paginasweb.cr/provincias.json')
        .then(r => r.json())
        .then((data) => {
          setProvName(data[prov] || '');
        })
        .catch(() => setProvName(''));
    } else {
      setProvName('');
    }

    // Canton
    if (prov && canton) {
      fetch(`https://ubicaciones.paginasweb.cr/provincia/${prov}/cantones.json`)
        .then(r => r.json())
        .then((data) => {
          setCantonName(data[canton] || '');
        })
        .catch(() => setCantonName(''));
    } else {
      setCantonName('');
    }

    // District
    if (prov && canton && distrito) {
      fetch(`https://ubicaciones.paginasweb.cr/provincia/${prov}/canton/${canton}/distritos.json`)
        .then(r => r.json())
        .then((data) => {
          setDistName(data[distrito] || '');
        })
        .catch(() => setDistName(''));
    } else {
      setDistName('');
    }
  }, [technician.provincia, technician.canton, technician.distrito]);

  // Signature preview (generate image from stored strokes)
  const sigRef = useRef<SignatureCanvas | null>(null);
  const [signatureUrl, setSignatureUrl] = useState<string | null>(null);
  useEffect(() => {
    if (!technician.tech_signature) return;
    try {
      const data = JSON.parse(technician.tech_signature);
      if (sigRef.current) {
        sigRef.current.clear();
        sigRef.current.fromData(data);
        const url = sigRef.current.toDataURL('image/png');
        setSignatureUrl(url);
      }
    } catch (_) {
      // ignore parse errors
    }
  }, [technician.tech_signature]);

  return (
    <AppLayout>
      <Head title={`Técnico · ${technician.name}`} />

      {/* Hidden canvas used only to render signature into an image */}
      <SignatureCanvas
        ref={sigRef}
        penColor="black"
        canvasProps={{ width: 400, height: 150, className: 'hidden' }}
      />

      <div className="m-4 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{technician.name}</h1>
          <div className="mt-1 text-sm text-gray-600 dark:text-gray-300">Código: {technician.code || '-'}</div>
        </div>
        <Link href="/users/tecnicos" className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">Volver</Link>
      </div>

      <div className="m-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <section className="lg:col-span-1 bg-white dark:bg-gray-900 rounded shadow p-4 space-y-3">
          <h2 className="font-semibold text-gray-800 dark:text-gray-100">Perfil</h2>
          <div className="grid grid-cols-1 gap-3">
            <div>
              <Label>Correo</Label>
              <Value>{technician.email}</Value>
            </div>
            <div>
              <Label>Teléfono</Label>
              <Value>{technician.phone || '-'}</Value>
            </div>
            <div>
              <Label>Estado</Label>
              <Value>
                <Chip ok={!!technician.status} text={technician.status ? 'Activo' : 'Inactivo'} />
              </Value>
            </div>
            <div>
              <Label>Especialidad</Label>
              <Value>{technician.specialization || '-'}</Value>
            </div>
            <div>
              <Label>Tipo Técnico</Label>
              <Value>{technician.tech_type || '-'}</Value>
            </div>
            <div>
              <Label>Fecha Ingreso</Label>
              <Value>{technician.hiringdate ? new Date(technician.hiringdate).toLocaleDateString() : '-'}</Value>
            </div>
          </div>
        </section>

        <section className="lg:col-span-1 bg-white dark:bg-gray-900 rounded shadow p-4 space-y-3">
          <h2 className="font-semibold text-gray-800 dark:text-gray-100">Contacto</h2>
          <div className="grid grid-cols-1 gap-3">
            <div>
              <Label>Correo personal</Label>
              <Value>{technician.personal_email || '-'}</Value>
            </div>
           
            <div>
              <Label>Dirección</Label>
              <Value>
                {[provName, cantonName, distName].filter(Boolean).join(', ') || '-'}
                <div>{technician.adress || ''}</div>
              </Value>
            </div>
          </div>
        </section>

        <section className="lg:col-span-1 bg-white dark:bg-gray-900 rounded shadow p-4 space-y-3">
          <h2 className="font-semibold text-gray-800 dark:text-gray-100">Documentos</h2>
          <div className="grid grid-cols-1 gap-3">
            <div>
              <Label>Licencia conducir</Label>
              <Value>{technician.driver_license || '-'}</Value>
            </div>
            <div>
              <Label>Seguridad social</Label>
              <Value>{technician.social_security || '-'}</Value>
            </div>
            <div>
              <Label>Vehículo</Label>
              <Value>{[technician.vehicle_brand, technician.vehicle_plate].filter(Boolean).join(' · ') || '-'}</Value>
            </div>
            <div>
              <Label>Firma</Label>
              <Value>{signatureUrl ? <img src={signatureUrl} alt="Firma del técnico" className="h-24 border rounded bg-white p-2" /> : '-'}</Value>
            </div>
          </div>
        </section>
      </div>


      <div className="m-4 bg-white dark:bg-gray-900 rounded shadow p-4">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">Archivos</h2>
        {technician.files && technician.files.length ? (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {technician.files.map((f) => (
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
