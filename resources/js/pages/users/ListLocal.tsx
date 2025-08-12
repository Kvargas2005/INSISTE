import { Head } from '@inertiajs/react';
import React from 'react';
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
    // Paginación local
    const [pageSize, setPageSize] = React.useState<number>(25);
    const [currentPage, setCurrentPage] = React.useState<number>(1);
    const totalItems = allClients.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, totalItems);
    const paginatedClients = allClients.slice(startIndex, endIndex);

    const goToPage = (page: number) => {
        const safe = Math.min(Math.max(1, page), totalPages);
        setCurrentPage(safe);
    };

    React.useEffect(() => {
        setCurrentPage(1);
    }, [pageSize, totalItems]);

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

            <div className="m-4 shadow rounded-lg overflow-y-auto pb-[100px] overflow-x-auto max-h-[500px] min-h-[500px] relative">
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
                        {totalItems > 0 ? (
                            paginatedClients.map((user) => (
                                <tr
                                    key={user.id}
                                    className="border-t hover:bg-gray-50 dark:hover:bg-gray-800 transition cursor-pointer"
                                    onClick={() => { window.location.href = `/users/locales/${user.id}`; }}
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
                                    No se encontraron locales registrados.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* Controles de paginación abajo */}
                <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t px-4 py-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-sm">
                        <span>Mostrar</span>
                        <select
                            value={pageSize}
                            onChange={(e) => setPageSize(Number(e.target.value))}
                            className="border rounded px-2 py-1 text-sm"
                        >
                            {[25, 50, 100, 200].map(sz => (
                                <option key={sz} value={sz}>{sz}</option>
                            ))}
                        </select>
                        <span className="hidden sm:inline">por página</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            className="px-3 py-1 border rounded text-sm disabled:opacity-50"
                            disabled={currentPage <= 1 || totalItems === 0}
                            onClick={() => goToPage(currentPage - 1)}
                        >
                            Anterior
                        </button>
                        <div className="flex items-center gap-1">
                            {(() => {
                                const pages: (number | 'ellipsis')[] = [];
                                const maxToShow = 7;
                                if (totalPages <= maxToShow) {
                                    for (let p = 1; p <= totalPages; p++) pages.push(p);
                                } else {
                                    const addRange = (from: number, to: number) => {
                                        for (let p = from; p <= to; p++) pages.push(p);
                                    };
                                    const left = Math.max(2, currentPage - 1);
                                    const right = Math.min(totalPages - 1, currentPage + 1);
                                    pages.push(1);
                                    if (left > 2) pages.push('ellipsis');
                                    addRange(left, right);
                                    if (right < totalPages - 1) pages.push('ellipsis');
                                    pages.push(totalPages);
                                }
                                return pages.map((p, idx) =>
                                    p === 'ellipsis' ? (
                                        <span key={`e-${idx}`} className="px-2">…</span>
                                    ) : (
                                        <button
                                            key={p}
                                            className={`px-3 py-1 border rounded text-sm ${p === currentPage ? 'bg-black text-white border-black' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                                            onClick={() => goToPage(p)}
                                        >
                                            {p}
                                        </button>
                                    )
                                );
                            })()}
                        </div>
                        <button
                            className="px-3 py-1 border rounded text-sm disabled:opacity-50"
                            disabled={currentPage >= totalPages || totalItems === 0}
                            onClick={() => goToPage(currentPage + 1)}
                        >
                            Siguiente
                        </button>
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-300">
                        Mostrando {totalItems === 0 ? 0 : startIndex + 1}–{endIndex} de {totalItems}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
