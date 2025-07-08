import { usePage } from '@inertiajs/react';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Link } from '@inertiajs/react';
import AppLogo from './app-logo';
import { type NavItem } from '@/types';
import {
  LayoutGrid, FolderKanban, ReceiptText, Receipt, Banknote, Package, Store,
  Newspaper, ShoppingCart, Wrench, ArrowLeftRight, User, KeyRound, CalendarClock, Star
} from 'lucide-react';

export function AppSidebar() {
  const { auth } = usePage().props as any;
  const id_role = auth?.user?.id_role;

  const fullNav: NavItem[] = [
    { title: 'Inicio', href: '/dashboard', icon: LayoutGrid },
    {
      title: 'Contabilidad',
      icon: FolderKanban,
      children: [
        { title: 'Cotización', href: '', icon: ReceiptText },
        { title: 'Facturación', href: '', icon: Receipt },
        { title: 'Transacciones', href: '/payments', icon: Banknote },
      ],
    },
    {
      title: 'Inventarios',
      icon: Package,
      children: [
        { title: 'Proveedores', href: '/suppliers', icon: Store },
        { title: 'Bodegas', href: '/warehouse', icon: Store },
        { title: 'Marcas', href: '/brands', icon: Newspaper },
        { title: 'Servicios', href: '/service', icon: Newspaper },
        {
          title: 'Arctículos',
          icon: Package,
          children: [
            { title: 'Mant. Artículos', href: '/components', icon: Package },
            { title: 'Movimientos', href: '/inv-history', icon: ArrowLeftRight },
          ],
        },
        {
          title: 'Téncnicos',
          icon: Newspaper,
          children: [
            { title: 'Mant. Técnicos', href: '/users/tecnicos', icon: User },
            { title: 'Mant. Inventario', href: '/assingTech/TechList', icon: Wrench },
          ],
        },

        {
          title: 'Clientes',
          icon: Newspaper,
          children: [
            { title: 'Mant. Clientes', href: '/users/clientes', icon: User },
            { title: 'Mant. Locales', href: '/users/locales', icon: User },
            { title: 'Mant. Claves', href: '/claves/list', icon: KeyRound },

          ],
        },

      ],
    },
    {
      title: 'Actas',
      icon: Newspaper,
      children: [
        { title: 'Historial Actas', href: '/actas/list', icon: Newspaper },
        { title: 'Visitas', href: '/assignCustomerTech', icon: CalendarClock },
        { title: 'Cronograma', href: '/calendar', icon: CalendarClock },
        { title: 'Reseñas', href: '', icon: Star },
      ],
    },
    { title: 'Configuarición', href: '/company', icon: User },
  ];

  const technicianNav: NavItem[] = [
    { title: 'Inicio', href: '/dashboard', icon: LayoutGrid },
    { title: 'Mi Inventario', href: '/assingInvTech/my', icon: Package },
    { title: 'Mis Asignaciones', href: '/assignments', icon: CalendarClock },
    { title: 'Mis Actas', href: '/actas/list', icon: Newspaper },
    { title: 'Claves', href: '/claves/list', icon: KeyRound },
    { title: 'Mis Gastos', href: '', icon: Banknote },
  ];

  const clientNav: NavItem[] = [
    {
      title: 'Actas',
      icon: Newspaper,
      children: [
        { title: 'Historial Actas', href: '/actas/list', icon: Newspaper },
        { title: 'Reseñas', href: '', icon: Star },
      ],
    },
  ];

  let navItems: NavItem[] = [];

  if (id_role === 1) {
    navItems = fullNav.filter(item => item.title !== 'Configuarición');
  } else if (id_role === 3) navItems = technicianNav;
  else if (id_role === 2) navItems = clientNav;

  // Configuración como ítem fijo abajo, solo para admin
  const configItem = { title: 'Configuarición', href: '/company', icon: User };

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="justify-center">
              <Link href="/dashboard" prefetch>
                <AppLogo />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={navItems} collapsed={false} />
      </SidebarContent>

      <SidebarFooter>
        {id_role === 1 && <NavMain items={[configItem]} collapsed={false} />}
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
