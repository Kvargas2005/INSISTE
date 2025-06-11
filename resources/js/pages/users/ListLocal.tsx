import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import DropdownMenuList from '@/components/dropdownMenu';
import type { BreadcrumbItem } from '@/types';

interface User {
    id: number;
    name: string;
    email: string;
    id_role: string;
    status: number;
}

interface Props {
    allClients: User[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Locales', href: '/users/locales' },
];

export default function ListLocal({ allClients }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Locales" />
            <div className="flex justify-between items-center m-4">
                <h1 className="text-xl font-bold">Locales</h1>
                <a
                    href="/users/create/cliente"
                    className="px-4 py-2 rounded text-white bg-black hover:bg-gray-800 transition"
                >
                    Agregar Local
                </a>
            </div>

            <div className="m-4 shadow rounded-lg overflow-y-auto pb-[100px] overflow-x-auto max-h-[500px] min-h-[500px]">
                <table className="min-w-[600px] w-full border-collapse text-sm text-gray-500 dark:text-gray-400">
                    <thead className="bg-gray-100 dark:bg-gray-700 sticky top-0 z-10">
                        <tr>
                            <th className="text-left px-4 py-2">Nombre</th>
                            <th className="text-left px-4 py-2">Email</th>
                            <th className="text-left px-4 py-2">Estado</th>
                            <th className="text-left px-4 py-2">Permisos</th>
                            <th className="text-left px-4 py-2"></th>
                        </tr>
                    </thead>
                    <tbody className="text-left">
                        {allClients.length > 0 ? (
                            allClients.map((user) => (
                                <tr key={user.id} className="border-t hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                                    <td className="px-4 py-2">{user.name}</td>
                                    <td className="px-4 py-2">{user.email}</td>
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
                                    <td className="px-4 py-2">
                                        <a
                                            href={`/users/${user.id}/permissions`}
                                            className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-xs"
                                            title="Asignar permisos"
                                        >
                                            Permisos
                                        </a>
                                    </td>
                                    <td className="px-4 py-2">
                                        <DropdownMenuList
                                            id={user.id}
                                            status={user.status}
                                            routeEdit="users.edit"
                                            routeToggle="users.toggle-status"
                                        />
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="px-4 py-2 text-center">
                                    No se encontraron locales registrados.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </AppLayout>
    );
}
