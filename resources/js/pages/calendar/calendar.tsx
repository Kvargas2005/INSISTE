import React from 'react';
import { Calendar, dateFnsLocalizer, Event } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import esES from 'date-fns/locale/es';
import { usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

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

  return (
    <AppLayout breadcrumbs={[{ title: 'Calendario', href: '/calendar' }]}>
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Calendario</h1>
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
        />
      </div>
    </AppLayout>
  );
}
