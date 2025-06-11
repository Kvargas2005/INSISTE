// NavMain.tsx
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

function RenderNavItem({
  item,
  currentUrl,
  collapsed,
}: {
  item: NavItem;
  currentUrl: string;
  collapsed: boolean;
}) {
  const hasChildren = item.children && item.children.length > 0;
  const isCurrentParent =
    hasChildren &&
    item.children!.some((child) =>
      child.href
        ? currentUrl.startsWith(child.href)
        : child.children?.some((grandchild) => currentUrl.startsWith(grandchild.href ?? ''))
    );

  const [open, setOpen] = useState(isCurrentParent);
  const isActive = item.href === currentUrl;

  return (
    <SidebarMenuItem key={item.title}>
      <SidebarMenuButton
        asChild={!hasChildren}
        isActive={isActive || isCurrentParent}
        tooltip={{ children: item.title }}
        onClick={() => hasChildren && setOpen(!open)}
        className={`flex items-center w-full ${hasChildren ? 'justify-between' : 'justify-start'}`}
      >
        {item.href ? (
          <Link href={item.href} prefetch className="flex items-center gap-2 w-full">
            {item.icon && (
              <item.icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#3082FD]' : ''}`} />
            )}
            {!collapsed && (
              <span className={`truncate ${isActive ? 'text-[#3082FD]' : ''}`}>
                {item.title}
              </span>
            )}
          </Link>
        ) : (
          <div className="flex items-center gap-2 w-full cursor-pointer">
            {item.icon && (
              <item.icon className={`w-4 h-4 shrink-0 ${isCurrentParent ? 'text-[#3082FD]' : ''}`} />
            )}
            {!collapsed && (
              <>
                <span className={`${isCurrentParent ? 'text-[#3082FD]' : ''}`}>
                  {item.title}
                </span>
                {hasChildren && (
                  <ChevronDown
                    className={`ml-auto w-4 h-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                  />
                )}
              </>
            )}
          </div>
        )}
      </SidebarMenuButton>

      {hasChildren && open && !collapsed && (
        <div className="ml-6 mt-1 space-y-1">
          {item.children!.map((child) => (
            <RenderNavItem key={child.title} item={child} currentUrl={currentUrl} collapsed={collapsed} />
          ))}
        </div>
      )}
    </SidebarMenuItem>
  );
}

export function NavMain({ items = [], collapsed }: { items: NavItem[]; collapsed: boolean }) {
  const page = usePage();
  const currentUrl = page.url;

  return (
    <SidebarGroup className="px-2 py-0">
      <SidebarMenu>
        {items.map((item) => (
          <RenderNavItem key={item.title} item={item} currentUrl={currentUrl} collapsed={collapsed} />
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
