import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { type BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Nueva Cliente',
        href: '/users/new/casamatriz',
    },
];

type RegisterForm = {
    name: string;
    description: string;
    registration_date: string;
    rut_nit: string;
    main_address: string;
    main_phone: string;
    main_email: string;
    contact_firstname: string;
    contact_lastname: string;
    contact_phone: string;
    contact_phone_ext: string;
    contact_mobile: string;
    contact_email: string;
};

export default function Register() {
    const { data, setData, post, processing, errors } = useForm<RegisterForm>({
        name: '',
        description: '',
        registration_date: new Date().toISOString().split('T')[0],
        rut_nit: '',
        main_address: '',
        main_phone: '',
        main_email: '',
        contact_firstname: '',
        contact_lastname: '',
        contact_phone: '',
        contact_phone_ext: '',
        contact_mobile: '',
        contact_email: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('users.registerCasaMatriz'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Registrar Clientes" />

            <div className="p-4">
                <h1 className="text-2xl font-bold mb-4">Registrar Cliente</h1>

                <form onSubmit={submit} className="grid grid-cols-2 gap-x-6 gap-y-4">
                    <div>
                        <Label htmlFor="name">Nombre</Label>
                        <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                        <InputError message={errors.name} />
                    </div>

                    <div>
                        <Label htmlFor="description">Descripción</Label>
                        <Input id="description" value={data.description} onChange={(e) => setData('description', e.target.value)} />
                        <InputError message={errors.description} />
                    </div>

                    <div>
                        <Label htmlFor="registration_date">Fecha de Registro</Label>
                        <Input type="date" id="registration_date" value={data.registration_date} onChange={(e) => setData('registration_date', e.target.value)} />
                        <InputError message={errors.registration_date} />
                    </div>

                    <div>
                        <Label htmlFor="rut_nit">RUT / NIT</Label>
                        <Input id="rut_nit" value={data.rut_nit} onChange={(e) => setData('rut_nit', e.target.value)} />
                        <InputError message={errors.rut_nit} />
                    </div>

                    <div>
                        <Label htmlFor="main_address">Dirección Principal</Label>
                        <Input id="main_address" value={data.main_address} onChange={(e) => setData('main_address', e.target.value)} />
                        <InputError message={errors.main_address} />
                    </div>

                    <div>
                        <Label htmlFor="main_phone">Teléfono Principal</Label>
                        <Input id="main_phone" value={data.main_phone} onChange={(e) => setData('main_phone', e.target.value)} />
                        <InputError message={errors.main_phone} />
                    </div>

                    <div>
                        <Label htmlFor="main_email">Email Cliente (Principal)</Label>
                        <Input id="main_email" value={data.main_email} onChange={(e) => setData('main_email', e.target.value)} />
                        <InputError message={errors.main_email} />
                    </div>

                    <div>
                        <Label htmlFor="contact_firstname">Nombre Contacto Principal</Label>
                        <Input id="contact_firstname" value={data.contact_firstname} onChange={(e) => setData('contact_firstname', e.target.value)} />
                        <InputError message={errors.contact_firstname} />
                    </div>

                    <div>
                        <Label htmlFor="contact_lastname">Apellido Contacto Principal</Label>
                        <Input id="contact_lastname" value={data.contact_lastname} onChange={(e) => setData('contact_lastname', e.target.value)} />
                        <InputError message={errors.contact_lastname} />
                    </div>

                    <div>
                        <Label htmlFor="contact_phone">Teléfono Contacto Principal</Label>
                        <Input id="contact_phone" value={data.contact_phone} onChange={(e) => setData('contact_phone', e.target.value)} />
                        <InputError message={errors.contact_phone} />
                    </div>

                    <div>
                        <Label htmlFor="contact_phone_ext">Extensión Telefónica</Label>
                        <Input id="contact_phone_ext" value={data.contact_phone_ext} onChange={(e) => setData('contact_phone_ext', e.target.value)} />
                        <InputError message={errors.contact_phone_ext} />
                    </div>

                    <div>
                        <Label htmlFor="contact_mobile">Celular Contacto</Label>
                        <Input id="contact_mobile" value={data.contact_mobile} onChange={(e) => setData('contact_mobile', e.target.value)} />
                        <InputError message={errors.contact_mobile} />
                    </div>

                    <div>
                        <Label htmlFor="contact_email">Correo Electrónico Contacto</Label>
                        <Input id="contact_email" value={data.contact_email} onChange={(e) => setData('contact_email', e.target.value)} />
                        <InputError message={errors.contact_email} />
                    </div>

                    <div className="col-span-2 mt-4 grid grid-cols-2 gap-x-6 gap-y-4">
                        <a href="/users/clientes">
                            <Button className="w-full" type="button">
                                Cancelar
                            </Button>
                        </a>
                        <Button type="submit" disabled={processing}>
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Guardar
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
