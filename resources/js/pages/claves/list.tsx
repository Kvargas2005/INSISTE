import { type BreadcrumbItem } from '@/types';
import React, { useEffect } from 'react';
import { Head, usePage } from '@inertiajs/react';
import ModalFormCreate from '@/components/ModalFormCreate';
import ModalFormEdit from '@/components/ModalFormEdit';
import AppLayout from '@/layouts/app-layout';
import { Button, Input } from '@headlessui/react';
import DropdownMenuList from '@/components/dropdownMenu';
import Swal from 'sweetalert2';

interface Key {
    id: number
    description: string;
    key_type: number;
    id_user: number;
    status: number;
}

interface User {
    id: number;
    name: string;
}

interface KeyWithUser extends Key {
    id: number;
    user: User;
    description: string;
    key_type: number;
    id_user: number;
    status: number;
}

interface Props {
    allKeys: Key[];
    users: User[];
    keysProg: Key[];
    KeysOp: Key[];
}


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Claves',
        href: '/Claves/list',
    },
];


export default function UsuarioList({ allKeys, users }: Props) {
const { flash } = usePage().props as unknown as { flash: { success?: string; error?: string } };
    const [filteredKeys, setfilteredKeys] = React.useState<KeyWithUser[]>([]);
    const [KeysWithUser, setKeysWithUser] = React.useState<KeyWithUser[]>([]);
    const [filter, setFilter] = React.useState<string>('allUsers');
    const [showModalCrear, setShowModalCrear] = React.useState(false);
    const [showModalEdit, setShowModalEdit] = React.useState(false);
    const [selectedId, setSelectedId] = React.useState<number>(0);

    useEffect(() => {
        console.log('allKeys', allKeys);
        console.log('users', users);
        const mergedKeys = allKeys.map(key => {
            const user = users.find(u => u.id === key.id_user);
            return {
                ...key,
                key_type: Number(key.key_type), // Ensure type is a number
                user: user || { id: 0, name: 'Usuario no encontrado' }
            };
        });
        setKeysWithUser(mergedKeys);
        setfilteredKeys(mergedKeys);
        setFilter('allUsers');
    }, []);

    useEffect(() => {
        const mergedKeys = allKeys.map(key => {
            const user = users.find(u => u.id === key.id_user);
            return {
                ...key,
                key_type: Number(key.key_type), // Ensure type is a number
                user: user || { id: 0, name: 'Usuario no encontrado' }
            };
        });
        setKeysWithUser(mergedKeys);
        setfilteredKeys(mergedKeys);
        setFilter('allUsers');
    }, [allKeys, users]);

    const filtro = (filtro: string) => {
        let filtered;
        switch (filtro) {
            case 'allKeys':
                filtered = KeysWithUser;
                break;
            case 'Prog':
                filtered = KeysWithUser.filter(key => key.key_type === 1);
                break;
            case 'Op':
                filtered = KeysWithUser.filter(key => key.key_type === 2);
                break;
            default:
                filtered = KeysWithUser;
        }
        setfilteredKeys(filtered);
        setFilter(filtro);
    };

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const searchTerm = event.target.value.toLowerCase();
        const filtered = KeysWithUser.filter(key =>
            key.user.name.toLowerCase().includes(searchTerm)
        );
        setfilteredKeys(filtered);
    };

    useEffect(() => {
        const searchInput = document.getElementById('search') as HTMLInputElement;
        const handleInput = (event: Event) => handleSearch(event as unknown as React.ChangeEvent<HTMLInputElement>);
        if (searchInput) {
            searchInput.addEventListener('input', handleInput);
        }
        return () => {
            if (searchInput) {
                searchInput.removeEventListener('input', handleInput);
            }
        };
    }, [KeysWithUser]);

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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Claves">
                <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&icon_names=swap_vert" />
            </Head>
            <div className="flex flex-row gap-6 m-4 overflow-x-auto">
                <Button className={`${filter == 'allKeys' ? 'text-sky-600/100' : 'dark:text-white text-black'}  text-[14px] hover:text-sky-600/75 cursor-pointer`} onClick={() => filtro('allKeys')}>
                    Todos
                </Button>
                <Button className={`${filter == 'Prog' ? 'text-sky-600/100' : 'dark:text-white text-black'}  text-[14px] hover:text-sky-600/75 cursor-pointer`} onClick={() => filtro('Prog')}>
                    Programación
                </Button>
                <Button className={`${filter == 'Op' ? 'text-sky-600/100' : 'dark:text-white text-black'}  text-[14px] hover:text-sky-600/75 cursor-pointer`} onClick={() => filtro('Op')}>
                    Operación
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

                <a className=" ml-auto self-end">
                    <Button className={'px-4 py-2 rounded'} style={{ backgroundColor: 'black', color: 'white' }} onClick={() => setShowModalCrear(true) }>
                        Crear
                    </Button>
                </a>


            </div>
            <div className="m-4 shadow rounded-lg overflow-y-auto pb-[100px] overflow-x-auto max-h-[500px] min-h-[500px]">
                <table className="min-w-[600px] w-full border-collapse text-sm text-gray-500 dark:text-gray-400 ">
                    <thead className="bg-gray-100 dark:bg-gray-700">
                        <tr>
                            <th className="text-left px-4 py-2">Usuario</th>
                            <th className="text-left px-4 py-2">Clave</th>
                            <th className="text-left px-4 py-2">Tipo</th>
                            <th className="px-4 py-2"></th>

                        </tr>
                    </thead>
                    <tbody className="text-left">
                        {filteredKeys.length > 0 ? (
                            filteredKeys.map((key, index) => (
                                <tr key={index} className="border-t">
                                    <td className="px-4 py-2">{key.user.name}</td>
                                    <td className="px-4 py-2">{key.description}</td>
                                    <td className="px-4 py-2">{<span
                                        className="px-5 py-1 rounded-full"
                                        style={{
                                            backgroundColor: key.key_type === 1 ? '#B9CEFF' : '#4ABB8C',
                                            color: key.key_type === 1 ? '#2E6CF9' : '#E8FCF3',
                                        }}
                                    >
                                        {key.key_type === 1 ? 'Programacion' : 'Operacion'}
                                    </span>}</td>
                                    <td>
                                        <DropdownMenuList 
                                            id={key.id} 
                                            status={key.status} 
                                            routeEdit=""  // Vacío para abrir modal
                                            routeToggle=""
                                            onOpenModal={() => {
                                                setSelectedId(key.id);
                                                setShowModalEdit(true);
                                            }}
                                        />
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={filter != 'mainusers' ? 5 : 2} className="px-4 py-2 text-center">
                                    No se encontraron claves
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {showModalCrear && (
                <ModalFormCreate
                    title="Registrar Clave"
                    postRoute="claves.createClave"
                    inputs={[
                        {
                            name: 'id_user',
                            label: 'Usuario',
                            type: 'select',
                            options: users.map((u) => ({ value: u.id, label: u.name })),
                        },
                        {
                            name: 'key_type',
                            label: 'Tipo',
                            type: 'select',
                            options: [
                                { value: 1, label: 'Programación' },
                                { value: 2, label: 'Operación' },
                            ],
                        },
                        { name: 'description', label: 'Clave', type: 'text' },

                    ]}
                    onClose={() => setShowModalCrear(false)}
                />
            )}
            {showModalEdit && (
                <ModalFormEdit
                    id={selectedId}
                    fetchRoute="claves.fetchClave" // GET: devuelve { data: { name: 'Adolf', active: true, ... } }
                    postRoute="claves.editClave" // POST o PUT
                    title="Editar Usuario"
                    inputs={[
                        {
                            name: 'id_user',
                            label: 'Usuario',   
                            type: 'select',
                            options: users.map((u) => ({ value: u.id, label: u.name })),
                        },
                        {
                            name: 'key_type',
                            label: 'Tipo',
                            type: 'select',
                            options: [
                                { value: 1, label: 'Programación' },
                                { value: 2, label: 'Operación' },
                            ],
                        },
                        { name: 'description', label: 'Clave', type: 'text' },

                    ]}
                    onClose={() => setShowModalEdit(false)}
                />
            )}

        </AppLayout >
    );
}
