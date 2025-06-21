import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';
import { Newspaper, Star, ShieldCheck, MoveRight } from 'lucide-react';
import { type SharedData } from '@/types';

export default function DashboardCustomer() {
  const { auth } = usePage<SharedData>().props;

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
          <span className="text-xl font-medium text-[#202427] dark:text-white group-hover:text-white transition-colors duration-300">
            {title}
          </span>
        </div>
        <div className="text-sm font-medium text-[#202427] dark:text-white group-hover:text-white transition-colors duration-300">
          {description}
        </div>
        <MoveRight className="text-[#202427] group-hover:text-white dark:text-white transition-colors duration-300" />
      </div>
      <span
        className="absolute top-0 right-0 z-10 flex h-16 w-16 items-center justify-center transition-colors duration-300"
        style={{ color }}
      >
        <Icon className="w-6 h-6" />
      </span>
    </a>
  );

  return (
    <AppLayout>
      <Head title="Inicio Cliente" />
      
      {/* Contenedor general que garantiza el footer al fondo */}
      <div className="min-h-screen flex flex-col">

        {/* Contenido que crece */}
        <main className="flex-grow p-4">
          <h2 className="text-2xl font-bold mb-6">Buenos días, {auth.user.name.split(' ')[0]}!</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card
              title="Actas"
              description="Consultar las actas de mis visitas"
              icon={Newspaper}
              color="#EABB4E"
              gradient="linear-gradient(to top, #EABB4E 0%, #FAD173 71%, #E8CB87 100%)"
              href="/actas/list"
            />
            <Card
              title="Reseñas"
              description="Reseñar una visita"
              icon={Star}
              color="#A3A3A3"
              gradient="linear-gradient(to top, #A3A3A3 0%, #878383 71%, #575969 100%)"
              href=""
            />
            <Card
              title="Código"
              description="Generar código verificación"
              icon={ShieldCheck}
              color="#fda4af"
              gradient="linear-gradient(to top, #fda4af 0%, #fb7185 71%, #f43f5e 100%)"
              href="/codigo-verificacion"
            />
          </div>
        </main>

        {/* Footer nav al final */}
        <nav className="text-gray-500 text-center py-2 text-sm font-semibold">
          INTRA Seguridad Electrónica SE, S.A.
        </nav>
      </div>
    </AppLayout>
  );
}
