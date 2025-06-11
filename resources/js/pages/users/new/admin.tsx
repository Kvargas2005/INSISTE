import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { type BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import AdressForm from '@/components/AdressForm';
import { showError } from '@/components/SwalUtils';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Nuevo Usuario',
        href: '/users/new/admin',
    },
];

type RegisterForm = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    rol: number;
    provincia: string;
    canton: string;
    distrito: string;
    adress: string;
    phone: string;
};

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm<Required<RegisterForm>>({
        name: '',
        email: '',
        password: '12345678',
        password_confirmation: '12345678',
        rol: 1,
        provincia: '',
        canton: '',
        distrito: '',
        adress: '',
        phone: '',
    });


    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Registrar Usuario" />
            <form className="flex flex-col gap-6 m-4" onSubmit={submit}>
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Nombre</Label>
                        <Input
                            id="name"
                            type="text"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            disabled={processing}
                            placeholder="Juan Perez"
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email">Correo</Label>
                        <Input
                            id="email"
                            type="email"
                            required
                            tabIndex={2}
                            autoComplete="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            disabled={processing}
                            placeholder="email@example.com"
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="phone">Telefono</Label>
                        <Input
                            id="phone"
                            type="phone"
                            required
                            tabIndex={2}
                            autoComplete="phone"
                            value={data.phone}
                            onChange={(e) => setData('phone', e.target.value)}
                            disabled={processing}
                            placeholder="8888-8888"
                        />
                        <InputError message={errors.phone} />
                    </div>

                    <div className="col-span-2 mt-4">
                        <AdressForm
                            values={{
                                provincia: data.provincia,
                                canton: data.canton,
                                distrito: data.distrito,
                            }}
                            onChange={setData}
                            errors={errors}
                        />
                    </div>

                    <div className="col-span-2">
                        <Label htmlFor="adress">Dirección</Label>
                        <Input
                            id="adress"
                            value={data.adress}
                            onChange={(e) => setData('adress', e.target.value)}
                            placeholder='100 metros al norte de la escuela'
                        />
                        <InputError message={errors.adress} />
                    </div>


                    <div className="col-span-2 mt-4 grid grid-cols-2 gap-x-6 gap-y-4">
                        <a href="/users/listAdmin" >
                            <Button className='w-full' type='button'>
                                Cancelar
                            </Button>
                        </a>
                        <Button type="submit" disabled={processing}>
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Guardar
                        </Button>
                    </div>
                </div>
            </form>
        </AppLayout>
    );
}
