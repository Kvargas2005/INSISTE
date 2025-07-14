import React from 'react';
import { Calendar, dateFnsLocalizer, Event } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import esES from 'date-fns/locale/es';
import { usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import ModalAssignmentInfo from '@/components/ModalAssignmentInfo';

const locales = {
  'es': esES,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

interface AssignmentEvent {
  id: number;
  title: string;
  start: string | Date;
  end: string | Date;
  allDay: boolean;
  status?: number;
  comments?: string;
}

export default function CalendarPage() {
  // Obtener las asignaciones desde props (Inertia)
  const assignments = (usePage().props as any).assignments || [];

  // Mapear a eventos para react-big-calendar
  const mappedEvents = assignments.map((a: any) => ({
    ...a,
    start: new Date(a.start),
    end: new Date(a.end),
  }));

  const [modalOpen, setModalOpen] = React.useState(false);
  const [selectedAssignment, setSelectedAssignment] = React.useState<any>(null);

  return (
    <AppLayout breadcrumbs={[{ title: 'Calendario', href: '/calendar' }]}>
      <div className="p-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Calendario</h1>
          <div className="flex gap-4 items-center bg-white/80 dark:bg-gray-800/80 px-4 py-2 rounded shadow border text-sm">
            <span className="flex items-center gap-1"><span className="inline-block w-4 h-4 rounded" style={{background:'#4ade80',border:'1px solid #4ade80'}}></span> Pendiente</span>
            <span className="flex items-center gap-1"><span className="inline-block w-4 h-4 rounded" style={{background:'#facc15',border:'1px solid #facc15'}}></span> En curso</span>
            <span className="flex items-center gap-1"><span className="inline-block w-4 h-4 rounded" style={{background:'#f87171',border:'1px solid #f87171'}}></span> Finalizada</span>
            <span className="flex items-center gap-1"><span className="inline-block w-4 h-4 rounded" style={{background:'#a78bfa',border:'1px solid #a78bfa'}}></span> Atrasada</span>
          </div>
        </div>
        <Calendar
          localizer={localizer}
          events={mappedEvents}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
          culture="es"
          messages={{
            next: 'Sig',
            previous: 'Ant',
            today: 'Hoy',
            month: 'Mes',
            week: 'Semana',
            day: 'Día',
            agenda: 'Agenda',
            date: 'Fecha',
            time: 'Hora',
            event: 'Evento',
            noEventsInRange: 'No hay eventos en este rango.',
          }}
          eventPropGetter={(event) => {
            // status: 1 = pendiente, 2 = en curso, 3 = finalizado
            let backgroundColor = '';
            const today = new Date();
            const start = new Date(event.start);
            if (event.status === 1) {
              // Pendiente
              if (start < new Date(today.getFullYear(), today.getMonth(), today.getDate())) {
                // Atrasado
                backgroundColor = '#a78bfa'; // morado
              } else {
                backgroundColor = '#4ade80'; // verde
              }
            } else if (event.status === 2) {
              backgroundColor = '#facc15'; // amarillo
            } else if (event.status === 3) {
              backgroundColor = '#f87171'; // rojo
            } else {
              backgroundColor = '#d1d5db'; // gris
            }
            return {
              style: {
                backgroundColor,
                color: '#222',
                borderRadius: '6px',
                border: 'none',
                fontWeight: 600,
                opacity: 0.95,
              },
            };
          }}
          onSelectEvent={(event: any) => {
            setSelectedAssignment(event);
            setModalOpen(true);
          }}
        />
        <ModalAssignmentInfo open={modalOpen} onClose={() => setModalOpen(false)} assignment={selectedAssignment} />
      </div>
    </AppLayout>
  );
}
