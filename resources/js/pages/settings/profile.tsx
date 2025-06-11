import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import DeleteUser from '@/components/delete-user';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Configuracion de Perfil',
        href: '/settings/profile',
    },
];

type Role = {
    id: number;
    name: string;
};

type ProfileForm = {
    name: string;
    email: string;
    rol: string;
}




export default function Profile({
    mustVerifyEmail,
    status,
    roles, // <- importante
}: {
    mustVerifyEmail: boolean;
    status?: string;
    roles: Role[];
}) {
    const { auth } = usePage<SharedData>().props;

    if (Number(auth.user.id_role) !== 1) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <SettingsLayout></SettingsLayout>
                <Head title="Acceso Denegado" />
                <div className="text-center mt-10">
                    <h1 className="text-2xl font-bold text-red-600">No tiene permitido el acceso</h1>
                </div>
            </AppLayout>
        );
    }

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm<Required<ProfileForm>>({
        name: auth.user.name,
        email: auth.user.email,
        rol: String(auth.user.id_role),
    });


    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        patch(route('profile.update'), {
            preserveScroll: true,
        });

    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Configuracion de Perfil" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Informacion del Perfil" description="Edita tu usuario y correo electronico" />

                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Nombre</Label>

                            <Input
                                id="name"
                                className="mt-1 block w-full"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                                autoComplete="name"
                                placeholder="Nombre completo"
                            />

                            <InputError className="mt-2" message={errors.name} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="email">Correo Electronico</Label>

                            <Input
                                id="email"
                                type="email"
                                className="mt-1 block w-full"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                required
                                autoComplete="username"
                                placeholder="Correo electronico"
                            />

                            <InputError className="mt-2" message={errors.email} />
                        </div>

                        <div className="flex items-center gap-4">
                            <Button disabled={processing}>Guardar</Button>

                            <Transition
                                show={recentlySuccessful}
                                enter="transition ease-in-out"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out"
                                leaveTo="opacity-0"
                            >
                                <p className="text-sm text-neutral-600">Guardado</p>
                            </Transition>
                        </div>
                    </form>
                </div>

                <DeleteUser />
            </SettingsLayout>
        </AppLayout>
    );
}
