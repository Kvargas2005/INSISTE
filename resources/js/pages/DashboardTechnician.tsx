import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';
import { type SharedData } from '@/types';
import { Box, ClipboardList, Newspaper, Banknote, MoveRight } from 'lucide-react';
import { useState } from 'react';
import ModalFormCreate from '@/components/ModalFormCreate';
import { router } from '@inertiajs/react';

interface Assignment {
  id: number;
  customer_name: string;
  assign_date: string;
  start_date?: string;
  tech_status?: number;
}

interface Props {
  assignments: Assignment[];
  activeAssignment: Assignment | null;
}

export default function DashboardTechnician({ assignments, activeAssignment }: Props) {

  const { auth } = usePage<SharedData>().props;
  const [startTime, setStartTime] = useState('');
  const [showModal, setShowModal] = useState(false);

  const redirectTo = (id: number) => {
    router.visit(`/actas/createWhitAssigment/${id}`);
  };

  const Card = ({ title, description, icon: Icon, color, gradient, href }: any) => (
    <a
      className="group relative aspect-video overflow-hidden rounded-xl bg-white dark:bg-zinc-800"
      style={{ boxShadow: `-1px 21px 30px -14px ${color}` }}
      href={href || '#'}
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: gradient }}
      />
      <div className="relative z-10 flex h-full w-full flex-col justify-between p-8">
        <div className="flex items-center justify-between">
          <span className="textIconDashboard text-[#202427] dark:text-white group-hover:text-white text-xl font-medium transition-colors duration-300">
            {title}
          </span>
        </div>
        <div className="text-center text-sm font-medium text-[#202427] dark:text-white group-hover:text-white transition-colors duration-300">
          {description}
        </div>
        <MoveRight className="text-[#202427] group-hover:text-white dark:text-white transition-colors duration-300" />
      </div>
      <span
        className="absolute top-0 right-0 z-10 flex h-16 w-16 items-center justify-center transition-colors duration-300"
        style={{ color }}
      >
        <Icon />
      </span>
    </a>
  );

  return (
    <AppLayout>
      <Head title="Inicio Técnico" />

      {/* Contenedor principal: flex columna y mínimo 100vh */}
      <div className="min-h-screen flex flex-col">

        {/* Contenido principal que crece */}
        <main className="flex-grow p-4">
          <h2 className="text-2xl font-bold mb-6">Bienvenido, {auth.user.name.split(' ')[0]}</h2>
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full lg:w-3/5">
              <Card title="Mi Inventario" description="Consultar mi inventario" icon={Box} color="#3082FD" gradient="linear-gradient(to top, #3082FD 0%, #418BFA 71%, #5C9BFA 100%)" href="/assingInvTech/my" />
              <Card title="Mis Asignaciones" description="Consultar mis trabajos asignados" icon={ClipboardList} color="#FF9E9E" gradient="linear-gradient(to top, #F57D7D 0%, #FF9E9E 71%, #FFDCDC 100%)" href="/assignments" />
              <Card title="Mis Actas" description="Mira las actas creadas" icon={Newspaper} color="#EABB4E" gradient="linear-gradient(to top, #EABB4E 0%, #FAD173 71%, #E8CB87 100%)" href="/actas/list" />
              <Card title="Mis Gastos" description="Añadir gastos de una visita" icon={Banknote} color="#428FC7" gradient="linear-gradient(to top, #428FC7 0%, #71A3C7 71%, #AAC2D3 100%)" href="/gastos" />
            </div>

            <div className="w-full lg:w-2/5 flex flex-col justify-between relative" style={{ height: 'calc(100% - 0px)' }}>
              <div className="flex flex-col items-center justify-center bg-white p-6 rounded-xl h-full">
                <h3 className="text-xl font-semibold mb-2 text-[#202427] text-center">Hora Inicio</h3>
                <div className="text-6xl font-bold text-[#202427] text-center mb-6">
                  {activeAssignment?.start_date
                    ? new Date(activeAssignment.start_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    : '--:--'}
                </div>
                <div className="flex justify-between w-full text-sm text-[#202427] px-2 mt-auto">
                  <span className="text-center w-1/2">Fecha<br />{new Date().toLocaleDateString()}</span>
                  <span className="text-center w-1/2">Hora<br />{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
              {activeAssignment ? (
                <button
                  onClick={() => redirectTo(activeAssignment.id)}
                  className="mt-4 bg-red-600 hover:bg-red-700 text-white py-2 rounded w-full text-center"
                >
                  Crear Acta
                </button>
              ) : (
                <button
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded w-full"
                  onClick={() => setShowModal(true)}
                >
                  Iniciar Trabajo
                </button>
              )}
            </div>
          </div>
        </main>

       
        <nav className="text-gray-500 text-center py-2 text-sm font-semibold">
          INTRA Seguridad Electrónica SE, S.A.
        </nav>
      </div>

      {showModal && (
        <ModalFormCreate
          title="Seleccionar Tarea"
          postRoute="assignments.start"
          inputs={[
            {
              name: 'assignment_id',
              label: '¿Qué tarea desea empezar?',
              type: 'select',
              options: assignments.map(a => ({
                value: a.id,
                label: `${a.customer_name} - ${new Date(a.assign_date).toLocaleString()}`
              }))
            },
            {
              name: 'verification_code',
              label: 'Código de verificación',
              type: 'text',
              placeholder: 'Ej: 4829'
            }
          ]}
          onClose={() => setShowModal(false)}
        />
      )}
    </AppLayout>
  );
}
