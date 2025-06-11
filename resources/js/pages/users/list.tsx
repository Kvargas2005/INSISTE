import { type BreadcrumbItem } from '@/types';
import React, { useEffect } from 'react';
import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import DropdownMenuList from '@/components/dropdownMenu';
import { Button, Input } from '@headlessui/react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import Swal from 'sweetalert2';

interface User {
    id: number;
    name: string;
    email: string;
    id_role: string;
    description?: string;
    status: number;

    main_email?: string;
    main_phone?: string;
    registration_date?: string;
}


interface Role {
    id: number;
    name: string;
    color: string;
    text_color: string;
}

interface MainUser {
    id: number;
    name: string;
    main_phone: string;
    main_email: string;
    registration_date: string;
    status: number;
}

interface Props {
    roles: Role[];
    allUsers: User[];
    allAdmins: User[];
    allClients: User[];
    allTechnician: User[];
    main_users: MainUser[];
}




const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Usuarios',
        href: '/users/list',
    },
];





export default function UsuarioList({ roles, allUsers, allAdmins, allClients, allTechnician, main_users }: Props) {
    const { flash } = usePage().props as unknown as { flash: { success?: string; error?: string } };
    const [filteredUsers, setFilteredUsers] = React.useState<(User | MainUser)[]>(allUsers);

    const [filter, setFilter] = React.useState<string>('allUsers');

    useEffect(() => {
        setFilteredUsers(allUsers);
        setFilter('allUsers');
    }
        , [allUsers]);

    useEffect(() => {
        if (flash.success) {
            Swal.fire({
                icon: 'success',
                title: 'Éxito',
                text: flash.success,
                timer: 3000,
                showConfirmButton: false,
            });
        }
        if (flash.error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: flash.error,
                timer: 3000,
                showConfirmButton: false,
            });
        }
    }, [flash]);

    const filtro = (filtro: string) => {
        switch (filtro) {
            case 'allUsers':
                setFilteredUsers(allUsers);
                setFilter('allUsers');
                break;
            case 'admin':
                setFilteredUsers(allAdmins);
                setFilter('admin');
                break;
            case 'client':
                setFilteredUsers(allClients);
                setFilter('client');
                break;
            case 'tecnico':
                setFilteredUsers(allTechnician);
                setFilter('tecnico');
                break;
            case 'mainusers':
                // ✅ ESTA ES LA CORRECTA: NO SE SOBREESCRIBEN PROPIEDADES
                setFilteredUsers(main_users);
                setFilter('mainusers');
                break;
            default:
                setFilteredUsers(allUsers);
        }
    };

    const [statusFilter, setStatusFilter] = React.useState<'none' | 'activeToInactive' | 'inactiveToActive'>('none');

    function handleFilterStatus() {
        const sortedUsers = [...filteredUsers];
        switch (statusFilter) {
            case 'none':
                sortedUsers.sort((a, b) => b.status - a.status); // Active to Inactive
                setStatusFilter('activeToInactive');
                break;
            case 'activeToInactive':
                sortedUsers.sort((a, b) => a.status - b.status); // Inactive to Active
                setStatusFilter('inactiveToActive');
                break;
            case 'inactiveToActive':
                setFilteredUsers(sortedUsers); // Reset to original order
                setStatusFilter('none');
                return;
        }
        setFilteredUsers(sortedUsers);
    }

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFilter('allUsers');
        const searchTerm = event.target.value.toLowerCase();
        const filtered = allUsers.filter(user =>
            user.name.toLowerCase().includes(searchTerm) ||
            user.email.toLowerCase().includes(searchTerm)
        );
        setFilteredUsers(filtered);

    };

    useEffect(() => {
        const searchInput = document.getElementById('search') as HTMLInputElement;
        if (searchInput) {
            searchInput.addEventListener('input', (event) => handleSearch(event as unknown as React.ChangeEvent<HTMLInputElement>));
        }
        return () => {
            if (searchInput) {
                searchInput.removeEventListener('input', (event) => handleSearch(event as unknown as React.ChangeEvent<HTMLInputElement>));
            }
        };
    }, [allUsers]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Usuarios">
                <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&icon_names=swap_vert" />
            </Head>
            <div className="flex flex-row gap-6 m-4 overflow-x-auto">
                <Button className={`${filter == 'allUsers' ? 'text-sky-600/100' : 'dark:text-white text-black'}  text-[14px] hover:text-sky-600/75 cursor-pointer`} onClick={() => filtro('allUsers')}>
                    Todos
                </Button>
                <Button className={`${filter == 'admin' ? 'text-sky-600/100' : 'dark:text-white text-black'}  text-[14px] hover:text-sky-600/75 cursor-pointer`} onClick={() => filtro('admin')}>
                    Admininistradores
                </Button>
                <Button className={`${filter == 'client' ? 'text-sky-600/100' : 'dark:text-white text-black'}  text-[14px] hover:text-sky-600/75 cursor-pointer`} onClick={() => filtro('client')}>
                    Locales
                </Button>
                <Button className={`${filter == 'tecnico' ? 'text-sky-600/100' : 'dark:text-white text-black'}  text-[14px] hover:text-sky-600/75 cursor-pointer`} onClick={() => filtro('tecnico')}>
                    Tecnicos
                </Button>
                <Button className={`${filter == 'mainusers' ? 'text-sky-600/100' : 'dark:text-white text-black'}  text-[14px] hover:text-sky-600/75 cursor-pointer`} onClick={() => filtro('mainusers')}>
                    Clientes
                </Button>
            </div>


            <div className='flex m-4'>
                <div className="relative w-100 self-start">
                    <Input
                        type="text"
                        placeholder="Buscar Usuario"
                        className="w-full px-4 py-2 border rounded dark:bg-gray-800 dark:text-white pl-10"
                        id='search'
                    />
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-4.35-4.35M16.65 10.65a6 6 0 11-12 0 6 6 0 0112 0z"
                        />
                    </svg>
                </div>


                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button className="px-4 py-2 rounded ml-auto self-end" style={{ backgroundColor: 'black', color: 'white' }}>
                            Registrar Usuario
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem asChild>
                            <a href="/users/create/admin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                Administrador
                            </a>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <a href="/users/create/cliente" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                Local
                            </a>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <a href="/users/create/tecnico" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                Tecnico
                            </a>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <a href="/users/new/casamatriz" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                Cliente
                            </a>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

            </div>
            <div className="m-4 shadow rounded-lg overflow-y-auto pb-[100px] overflow-x-auto max-h-[500px] min-h-[500px]">
                <table className="min-w-[600px] w-full border-collapse text-sm text-gray-500 dark:text-gray-400 ">
                    <thead className="bg-gray-100 dark:bg-gray-700">
                        <tr>
                            <th className="text-left px-4 py-2">Nombre</th>
                            {filter != 'mainusers' ? <th className="text-left px-4 py-2">Email</th> : null}
                            {filter != 'mainusers' ? <th className="text-left px-4 py-2">Rol</th> : null}
                            {filter != 'mainusers' ? <th
                                onClick={() => handleFilterStatus()}
                                className="text-center px-4 py-2 cursor-pointer"
                            >
                                <div className="flex items-center justify-left gap-1">
                                    Estado
                                    <span
                                        className="material-symbols-outlined"
                                        style={{ fontSize: '20px', color: '#8da1d5', userSelect: 'none' }}
                                    >
                                        swap_vert
                                    </span>
                                </div>
                            </th> : null}
                            {filter === 'mainusers' && (
                                <>
                                    <th className="px-4 py-2">Teléfono</th>
                                    <th className="px-4 py-2">Email</th>
                                    <th className="px-4 py-2">Fecha Registro</th>
                                    <th className="px-4 py-2">Estado</th>
                                </>
                            )}

                            <th className="px-4 py-2"></th>

                        </tr>
                    </thead>
                    <tbody className="text-left">
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map((user, index) => (
                                <tr key={index} className="border-t">
                                    <td className="px-4 py-2">{user.name}</td>
                                    {filter !== 'mainusers' && 'email' in user && (
                                        <td className="px-4 py-2">{user.email}</td>
                                    )}

                                    {filter !== 'mainusers' && 'id_role' in user && (
                                        <td className="px-4 py-2">
                                            <span
                                                className="px-5 py-1 rounded-full"
                                                style={{
                                                    backgroundColor:
                                                        roles.find((role) => role.id === parseInt(user.id_role))?.color || '#ccc',
                                                    color:
                                                        roles.find((role) => role.id === parseInt(user.id_role))?.text_color || '#000',
                                                    border: `1px solid ${roles.find((role) => role.id === parseInt(user.id_role))?.text_color || '#000'}`,
                                                }}
                                            >
                                                {roles.find((role) => role.id === parseInt(user.id_role))?.name || 'Rol no encontrado'}
                                            </span>
                                        </td>
                                    )}

                                    {filter != 'mainusers' ? <td className="px-4 py-2">
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
                                    </td> : null}

                                    {filter === 'mainusers' && (
                                        <>
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
                                        </>
                                    )}


                                    {filter != 'mainusers' ?
                                        <td className="px-4 py-2">
                                            <DropdownMenuList id={user.id} status={user.status} routeEdit='users.edit' routeToggle='users.toggle-status' />
                                        </td>
                                        :
                                        <td className="px-4 py-2">
                                            <DropdownMenuList id={user.id} status={user.status} routeEdit='casamatriz.edit' routeToggle='casamatriz.toggle-status' />

                                        </td>
                                    }
                                    <td className="px-4 py-2">
                                        <a
                                            href={`/users/${user.id}/permissions`}
                                            className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-xs"
                                            title="Asignar permisos"
                                        >
                                            Permisos
                                        </a>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={filter != 'mainusers' ? 5 : 2} className="px-4 py-2 text-center">
                                    No se encontraron usuarios
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>


        </AppLayout >
    );
}
