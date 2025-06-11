import { type BreadcrumbItem } from '@/types';
import React, { useEffect } from 'react';
import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import CreateActa from '@/pages/actas/CreateActa';
import Swal from 'sweetalert2';

interface User {
  id: number;
  name: string;
  contact?: string;
  adress: string;
  phone: string;
}

interface selects {
  value: number;
  label: string;
}

interface ComponentStock {
  id_component: number;
  component_name: string;
  quantity: number;
  warehouse_name: string;
  id_warehouse: number;
}

interface Props {
  id_tech: number
  tech_signature?: string; // opcional, si se usa en el componente
  users: User[];
  services: selects[];
  techStock: ComponentStock[];
  technicians: User[]; // agregado
  assigment_id?: number; // opcional, si se usa en el componente
  deliverys: selects[];
  jobs: selects[]
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Actas', href: '/actas/list' },
  { title: 'Crear Acta', href: '/actas/create' },
];

export default function CreateActaPage({ id_tech, tech_signature, users, services, techStock, technicians, assigment_id, deliverys, jobs }: Props) {
  const { flash } = usePage<{
    flash: { success?: string; error?: string }
  }>().props;

  useEffect(() => {
    if (flash.success) {
      Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: flash.success,
        timer: 3000,
        showConfirmButton: false,
      });
    }
    if (flash.error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: flash.error,
        timer: 3000,
        showConfirmButton: false,
      });
    }
  }, [flash]);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Crear Acta" />
      <CreateActa
        id_tech={id_tech}
        users={users}
        services={services}
        tech_sig={tech_signature} // Si no se usa, puedes omitirlo o pasarlo como undefined 
        id_assignment={assigment_id} // Si no se usa, puedes omitirlo o pasarlo como undefined
        techStock={techStock}
        technicians={technicians}  // ← nuevo
        deliverys={deliverys}
        jobs={jobs}
      />
    </AppLayout>
  );
}
