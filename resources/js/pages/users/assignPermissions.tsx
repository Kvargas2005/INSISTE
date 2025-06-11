import React, { useState, useEffect } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import Swal from 'sweetalert2';
import { Button } from '@/components/ui/button';

interface Permission {
    id: number;
    name: string;
    description: string;
    main?: string;
}

interface User {
    id: number;
    name: string;
    email: string;
    permissions: Permission[];
}

interface Props {
    user: User;
    permissions: Permission[];
}

export default function AssignPermissions({ user, permissions }: Props) {
    const { flash } = usePage().props as unknown as { flash: { success?: string; error?: string } };
    const [selected, setSelected] = useState<number[]>(user.permissions.map(p => p.id));
    const { post, processing, setData, data } = useForm<{ permissions: number[] }>({
        permissions: user.permissions.map(p => p.id),
    });

    const handleToggle = (id: number) => {
        setData(
            'permissions',
            data.permissions.includes(id)
                ? data.permissions.filter(pid => pid !== id)
                : [...data.permissions, id]
        );
        setSelected(prev =>
            prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/users/${user.id}/permissions`);
    };

    // Agrupar permisos por 'main'
    const permisosPorGrupo = permissions.reduce((acc, perm) => {
        const grupo = perm.main || 'Otros';
        if (!acc[grupo]) acc[grupo] = [];
        acc[grupo].push(perm);
        return acc;
    }, {} as Record<string, Permission[]>);


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
        <AppLayout>
            <Head title={`Asignar permisos a ${user.name}`} />
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Permisos de {user.name}</h1>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                        {Object.entries(permisosPorGrupo).map(([grupo, perms]) => (
                            <div key={grupo} className="bg-gray-50 rounded-lg shadow p-4">
                                <h2 className="font-bold text-blue-700 mb-3 text-base border-b pb-1">{grupo}</h2>
                                <div className="flex flex-col gap-2">
                                    {perms.map(perm => (
                                        <label key={perm.id} className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={selected.includes(perm.id)}
                                                onChange={() => handleToggle(perm.id)}
                                                className="accent-blue-600 w-5 h-5"
                                            />
                                            <div>
                                                <div className="font-semibold text-sm">{perm.description || perm.name}</div>
                                                <div className="text-xs text-gray-400">{perm.name}</div>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                    <Button type="submit" disabled={processing}>
                        Guardar Permisos
                    </Button>
                </form>
            </div>
        </AppLayout>
    );
}
