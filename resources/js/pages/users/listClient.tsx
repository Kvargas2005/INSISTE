import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import DropdownMenuList from '@/components/dropdownMenu';
import type { BreadcrumbItem } from '@/types';

interface MainUser {
    id: number;
    name: string;
    main_phone: string;
    main_email: string;
    registration_date: string;
    status: number;
}

interface Props {
    main_users: MainUser[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Clientes', href: '/users/clientes' },
];

export default function ListClient({ main_users }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Clientes" />
            <div className="flex justify-between items-center m-4">
                <h1 className="text-xl font-bold">Clientes</h1>
                <a
                    href="/users/create/casamatriz"
                    className="px-4 py-2 rounded text-white bg-black hover:bg-gray-800 transition"
                >
                    Agregar Cliente
                </a>
            </div>

            <div className="m-4 shadow rounded-lg overflow-y-auto pb-[100px] overflow-x-auto max-h-[500px] min-h-[500px]">
                <table className="min-w-[600px] w-full border-collapse text-sm text-gray-500 dark:text-gray-400">
                    <thead className="bg-gray-100 dark:bg-gray-700 sticky top-0 z-10">
                        <tr>
                            <th className="text-left px-4 py-2">Nombre</th>
                            <th className="text-left px-4 py-2">Teléfono</th>
                            <th className="text-left px-4 py-2">Email</th>
                            <th className="text-left px-4 py-2">Fecha Registro</th>
                            <th className="text-left px-4 py-2">Estado</th>
                            <th className="text-left px-4 py-2"></th>
                        </tr>
                    </thead>
                    <tbody className="text-left">
                        {main_users.length > 0 ? (
                            main_users.map((user) => (
                                <tr
                                    key={user.id}
                                    className="border-t hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                                    onClick={() => { window.location.href = `/users/clientes/${user.id}`; }}
                                >
                                    <td className="px-4 py-2">{user.name}</td>
                                    <td className="px-4 py-2">{user.main_phone}</td>
                                    <td className="px-4 py-2">{user.main_email}</td>
                                    <td className="px-4 py-2">
                                        {user.registration_date
                                            ? new Intl.DateTimeFormat('es-CR', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: '2-digit',
                                            }).format(new Date(user.registration_date))
                                            : 'Sin fecha'}
                                    </td>
                                    <td className="px-4 py-2">
                                        <span
                                            className="px-5 py-1 rounded-full"
                                            style={{
                                                backgroundColor: user.status === 1 ? '#a7d697' : '#d69797',
                                                color: user.status === 1 ? '#437b30' : '#873535',
                                                border: `1px solid ${user.status === 1 ? '#437b30' : '#873535'}`,
                                            }}
                                        >
                                            {user.status === 1 ? 'Activo' : 'Desactivado'}
                                        </span>
                                    </td>
                                    
                                    <td className="px-4 py-2" onClick={(e) => e.stopPropagation()}>
                                        <DropdownMenuList
                                            id={user.id}
                                            status={user.status}
                                            routeEdit="casamatriz.edit"
                                            routeToggle="casamatriz.toggle-status"
                                        />
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="px-4 py-2 text-center">
                                    No se encontraron casas matrices registradas.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </AppLayout>
    );
}
