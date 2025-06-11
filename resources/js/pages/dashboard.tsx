import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import {
  User, MoveRight, Newspaper, CalendarClock, KeyRound,
  Package, Receipt, ReceiptText, Star, Box
} from 'lucide-react';
import DashboardTechnician from './DashboardTechnician';
import DashboardCustomer from './DashboardCustomer';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Inicio', href: '/dashboard' },
];

interface Assignment {
  id: number;
  customer_name: string;
  assign_date: string;
  tech_status?: number;
}

export default function Dashboard() {
  const { auth } = usePage<SharedData>().props;
  const assignments = (usePage().props.assignments ?? []) as Assignment[];
  const activeAssignment = usePage().props.activeAssignment as Assignment | null;

  const isTechnician = Number(auth.user.id_role) === 3;
  const isCustomer = Number(auth.user.id_role) === 2;

  if (isTechnician) {
    return (
      <DashboardTechnician
        assignments={assignments}
        activeAssignment={activeAssignment}
      />
    );
  }

  if (isCustomer) {
    return <DashboardCustomer />;
  }

  // VISTA DEFAULT: para administradores u otros roles
  const canAccess = (allowedRoles: number | number[]) => {
    const currentRole = Number(auth.user.id_role);
    return Array.isArray(allowedRoles)
      ? allowedRoles.includes(currentRole)
      : currentRole === allowedRoles;
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
      <div className="relative z-10 flex h-full w-full flex-col justify-between p-4 sm:p-6 md:p-8">
        <div className="flex items-center justify-between">
          <span className="text-base sm:text-lg md:text-xl lg:text-2xl font-medium text-gray-900 dark:text-white group-hover:text-white transition-colors duration-300 truncate">
            {title}
          </span>
        </div>
        <div className="text-xs sm:text-sm md:text-base text-left font-medium text-gray-900 dark:text-white group-hover:text-white transition-colors duration-300 truncate">
          {description}
        </div>
        <MoveRight className="text-gray-900 group-hover:text-white dark:text-white transition-colors duration-300" />
      </div>
      <span
        className="absolute top-0 right-0 z-10 flex h-16 w-16 items-center justify-center transition-colors duration-300"
        style={{ color }}
      >
        <Icon className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8" />
      </span>
    </a>
  );

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Inicio" />
      <h4 className="p-8 text-4xl">
        <strong>Hola, {auth.user.name.split(' ')[0]}</strong>
      </h4>

      <div className="flex h-full flex-1 flex-col gap-10 rounded-xl p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          {canAccess([1]) && (
        <>
          <Card
            title="Contabilidad"
            description="Módulo Contabilidad"
            icon={Receipt}
            color="#FF6565"
            gradient="linear-gradient(to top, #FF6565 0%, #F73939 71%, #ED1818 100%)"
            href="/dashboardAcc"
          />
          <Card
            title="Inventarios"
            description="Inventarios, bodegas y productos"
            icon={Package}
            color="#3082FD"
            gradient="linear-gradient(to top, #3082FD 0%, #418BFA 71%, #5C9BFA 100%)"
            href="/dashboardInv"
          />
        </>
          )}

          {(canAccess([1, 2, 3])) && (
        <Card
          title="Actas"
          description="Mira las actas creadas"
          icon={Newspaper}
          color="#EABB4E"
          gradient="linear-gradient(to top, #EABB4E 0%, #FAD173 71%, #E8CB87 100%)"
          href="/actas/list"
        />
          )}
        </div>
      </div>
    </AppLayout>
  );
}
