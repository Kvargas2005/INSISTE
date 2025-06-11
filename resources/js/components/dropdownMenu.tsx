import { Menu } from '@headlessui/react'
import { MoreVertical } from 'lucide-react'
import { useForm } from '@inertiajs/react'
import { FormEventHandler } from 'react'
import { router } from '@inertiajs/react';
import Swal from 'sweetalert2';

interface DropdownMenuProps {
    id: number;
    status: number;
    routeEdit: string;  // Si viene vacío, abre modal
    routeToggle: string;
    onOpenModal?: () => void;  // Nueva prop opcional
}

export default function DropdownMenuList({ id, status, routeEdit, routeToggle, onOpenModal }: DropdownMenuProps) {

    const handleEdit = () => {
        if (routeEdit) {
            router.get(route(routeEdit, { id }));
        } else if (onOpenModal) {
            onOpenModal(); // Ejecuta el modal si no hay ruta
        }
    };

    const handleToggleStatus = () => {
        const nuevoEstado = status === 2 ? 1 : 2;
        if (nuevoEstado === 2) {
            Swal.fire({
                title: 'Motivo de desactivación',
                input: 'textarea',
                inputLabel: 'Por favor, ingresa el motivo de desactivación',
                inputPlaceholder: 'Motivo...',
                inputAttributes: {
                    'aria-label': 'Motivo de desactivación'
                },
                showCancelButton: true,
                confirmButtonText: 'Desactivar',
                cancelButtonText: 'Cancelar',
                inputValidator: (value) => {
                    if (!value) {
                        return 'Debes ingresar un motivo';
                    }
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    router.post(route(routeToggle), {
                        id,
                        status: nuevoEstado,
                        deactivation_note: result.value
                    });
                }
            });
        } else {
            router.post(route(routeToggle), {
                id,
                status: nuevoEstado
            });
        }
    };

    return (
        <Menu as="div" className="relative inline-block text-left">
            <Menu.Button className="p-2 hover:bg-gray-200 rounded-full">
                <MoreVertical className="w-5 h-5" />
            </Menu.Button>

            <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-black text-white dark:bg-white dark:text-black shadow-lg ring-1 ring-black/5 focus:outline-none z-50">
                <div className="py-1">
                    <Menu.Item>
                        {({ active }) => (
                            <button
                                className={`block w-full text-left px-4 py-2 text-sm ${active ? 'dark:bg-gray-100 bg-gray-800' : ''}`}
                                onClick={handleEdit}
                            >
                                Editar
                            </button>
                        )}
                    </Menu.Item>
                    {routeToggle !== '' && (
                        <Menu.Item>
                            {({ active }) => (
                                <button
                                    className={`block w-full text-left px-4 py-2 text-sm ${status == 2 ? 'text-green-600' : 'text-red-600'} ${active ? 'dark:bg-gray-100 bg-gray-800' : ''}`}
                                    onClick={handleToggleStatus}
                                >
                                    {status == 2 ? 'Activar' : 'Desactivar'}
                                </button>
                            )}
                        </Menu.Item>
                    )}
                </div>
            </Menu.Items>
        </Menu>
    );
}
