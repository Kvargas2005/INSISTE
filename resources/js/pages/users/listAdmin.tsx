import React from 'react';
import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import DropdownMenuList from '@/components/dropdownMenu';

interface Admin {
    id: number;
    name: string;
    email: string;
    id_role: string;
    status: number;
}

interface Props {
    allAdmins: Admin[];
}

export default function ListAdmin({ allAdmins }: Props) {
    return (
        <AppLayout>
            <Head title="Administradores" />
            <div className="flex flex-row gap-6 m-4 overflow-x-auto">
                <a href="/company" className="dark:text-white text-black text-[14px] hover:text-sky-600/75 cursor-pointer">
                    Empresa
                </a>
                <a href="/users/listAdmin" className="dark:text-white  text-sky-600 text-[14px] hover:text-sky-600/75 cursor-pointer">
                    Usuarios
                </a>
            </div>
            <div className="flex justify-between items-center m-4">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Usuarios</h1>
                <a
                    href="/users/create/admin"
                    className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
                >
                    Agregar Usuario
                </a>
            </div>

            <div className="m-4 shadow rounded-lg overflow-y-auto pb-[100px] overflow-x-auto max-h-[500px] min-h-[500px]">
                <table className="min-w-[600px] w-full border-collapse text-sm text-gray-500 dark:text-gray-400">
                    <thead className="bg-gray-100 dark:bg-gray-700">
                        <tr>
                            <th className="text-left px-4 py-2">Nombre</th>
                            <th className="text-left px-4 py-2">Email</th>
                            <th className="text-left px-4 py-2">Estado</th>
                            <th className="text-left px-4 py-2">Permisos</th>
                            <th className="text-left px-4 py-2"></th>
                        </tr>
                    </thead>
                    <tbody className="text-left">
                        {allAdmins.length > 0 ? (
                            allAdmins.map((user) => (
                                <tr
                                    key={user.id}
                                    className="border-t"
                                    onClick={() => { window.location.href = `/users/administradores/${user.id}`; }}
                                >
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
                                    <td className="px-4 py-2" onClick={(e) => e.stopPropagation()}>
                                        <a
                                            href={`/users/${user.id}/permissions`}
                                            className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-xs"
                                            title="Asignar permisos"
                                        >
                                            Permisos
                                        </a>
                                    </td>
                                    <td className="px-4 py-2" onClick={(e) => e.stopPropagation()}>
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
                                <td colSpan={5} className="px-4 py-2 text-center">
                                    No se encontraron administradores
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </AppLayout>
    );
}
