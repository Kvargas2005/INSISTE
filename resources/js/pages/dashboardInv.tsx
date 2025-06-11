import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import {
  ShoppingCart,
  MoveRight,
  Package,
  Wrench,
  Store,
  Server,
  ArrowLeftRight,
  Box,
  ReceiptText,
  Joystick,
} from 'lucide-react';
import { type ReactNode } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Inventarios',
    href: '/dashboardInv',
  },
];

const CardWithStaticSubmenu = ({
  title,
  description,
  icon: Icon,
  color,
  subMenuItems,
}: {
  title: string;
  description: string;
  icon: any;
  color: string;
  subMenuItems: {
    title: string;
    href: string;
    icon: any;
    color: string;
  }[];
}) => {
  return (
    <div
      className="group relative rounded-xl bg-white dark:bg-zinc-800 shadow-lg overflow-hidden transition-all duration-300 h-auto"
      style={{
        boxShadow: `-1px 21px 30px -14px ${color}`,
      }}
    >
      <div className="relative z-10 flex h-full w-full flex-col justify-start p-6 gap-4">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {title}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {description}
            </p>
          </div>
          <span
            className="flex h-12 w-12 items-center justify-center"
            style={{ color }}
          >
            <Icon className="w-6 h-6" />
          </span>
        </div>

        {/* Submenú */}
        <div className="flex flex-col gap-3 mt-4">
          {subMenuItems.map((item) => (
            <a
              key={item.title}
              href={item.href}
              className="flex items-center justify-between px-4 py-2 rounded-md bg-gray-100 dark:bg-zinc-700 hover:bg-gray-200 dark:hover:bg-zinc-600 transition"
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-5 h-5" style={{ color: item.color }} />
                <span className="text-sm text-gray-900 dark:text-white truncate">
                  {item.title}
                </span>
              </div>
              <MoveRight className="w-4 h-4 text-gray-400" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function DashboardInv() {
  const { auth } = usePage<SharedData>().props;

  const canAccess = (allowedRoles: number | number[]) => {
    const currentRole = Number(auth.user.id_role);
    return Array.isArray(allowedRoles)
      ? allowedRoles.includes(currentRole)
      : currentRole === allowedRoles;
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Inventarios" />
      <h2 className="p-4 text-2xl font-semibold text-gray-800 dark:text-white">
        Inventarios
      </h2>

      <div className="flex h-full flex-1 flex-col gap-10 rounded-xl p-4">
        <div className="grid auto-rows-min gap-10 grid-cols-[repeat(auto-fit,minmax(280px,1fr))]">
          {canAccess([1]) && (
            <>
              <CardWithStaticSubmenu
                title="Artículos"
                description="Gestión de Artículos"
                icon={Box}
                color="#DA680A"
                subMenuItems={[
                  {
                    title: 'Proveedores',
                    href: '/suppliers',
                    icon: Store,
                    color: '#FF6565',
                  },
                  {
                    title: 'Marcas',
                    href: '/brands',
                    icon: ReceiptText,
                    color: '#8774F2',
                  },
                  {
                    title: 'Productos',
                    href: '/components',
                    icon: Package,
                    color: '#DA680A',
                  },
                  {
                    title: 'Inventario',
                    href: '/warehouseStock/list',
                    icon: Box,
                    color: '#3082FD',
                  },
                  {
                    title: 'Servicios',
                    href: '/service',
                    icon: Joystick,
                    color: '#D14AAA',
                  },
                ]}
              />

              <CardWithStaticSubmenu
                title="Movimientos"
                description="Gestión de Movimientos"
                icon={ArrowLeftRight}
                color="#3E7680"
                subMenuItems={[
                  {
                    title: 'Movimientos',
                    href: '/inv-history',
                    icon: ArrowLeftRight,
                    color: '#3E7680',
                  },
                  {
                    title: 'Inventario Técnicos',
                    href: '/assingTech/TechList',
                    icon: Wrench,
                    color: '#D14AAA',
                  },
                  {
                    title: 'Bodegas',
                    href: '/warehouse',
                    icon: Server,
                    color: '#428FC7',
                  },
                  {
                    title: 'Entrada',
                    href: '/entries',
                    icon: ShoppingCart,
                    color: '#4BD04C',
                  },
                ]}
              />
            </>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
