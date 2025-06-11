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

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Nuevo Local',
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
    mails: string;
    hiringdate: string;
    id_main_user: number;
    rut_nit: string;

    contact1_name: string;
    contact1_phone: string;
    contact1_email: string;

    contact2_name: string;
    contact2_phone: string;
    contact2_email: string;

    opening_hours: string;
    closing_hours: string;
};


interface MainUser {
    id: number;
    name: string;
    description: string;
}


interface Props {
    main_users: MainUser[];
}

export default function Register({ main_users }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm<Required<RegisterForm>>({
        name: '',
        email: '',
        password: '12345678',
        password_confirmation: '12345678',
        rol: 2,
        provincia: '',
        canton: '',
        distrito: '',
        adress: '',
        phone: '',
        mails: '',
        id_main_user: 0,
        hiringdate: new Date().toISOString().split('T')[0],
        rut_nit: '',
        contact1_name: '',
        contact1_phone: '',
        contact1_email: '',
        contact2_name: '',
        contact2_phone: '',
        contact2_email: '',
        opening_hours: '',
        closing_hours: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Registrar Local" />
            <div className="p-4">
                <h1 className="text-2xl font-bold mb-4">Registrar Local</h1>
                <form onSubmit={submit} className="grid grid-cols-2 gap-x-6 gap-y-4">
                    {/* Datos básicos */}
                    <div>
                        <Label htmlFor="name">Nombre</Label>
                        <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                        <InputError message={errors.name} />
                    </div>

                    <div>
                        <Label htmlFor="email">Correo</Label>
                        <Input id="email" value={data.email} onChange={(e) => setData('email', e.target.value)} />
                        <InputError message={errors.email} />
                    </div>

                    <div>
                        <Label htmlFor="phone">Teléfono</Label>
                        <Input id="phone" value={data.phone} onChange={(e) => setData('phone', e.target.value)} />
                        <InputError message={errors.phone} />
                    </div>

                    <div>
                        <Label htmlFor="mails">Correos de Acta</Label>
                        <Input id="mails" value={data.mails} onChange={(e) => setData('mails', e.target.value)} />
                        <InputError message={errors.mails} />
                    </div>

                    <div>
                        <Label htmlFor="main_user">Casa Matriz</Label>
                        <select
                            id="main_user"
                            value={data.id_main_user}
                            onChange={(e) => setData('id_main_user', Number(e.target.value))}
                            className="block w-full border rounded px-3 py-2 text-sm bg-white"
                        >
                            <option value="">Seleccione una Casa Matriz</option>
                            {main_users.map((main_user) => (
                                <option key={main_user.id} value={main_user.id}>{main_user.name}</option>
                            ))}
                        </select>
                        <InputError message={errors.id_main_user} />
                    </div>

                    <div className="col-span-2 mt-4">
                        <AdressForm
                            values={{ provincia: data.provincia, canton: data.canton, distrito: data.distrito }}
                            onChange={setData}
                            errors={errors}
                        />
                    </div>

                    <div className="col-span-2">
                        <Label htmlFor="adress">Dirección</Label>
                        <Input id="adress" value={data.adress} onChange={(e) => setData('adress', e.target.value)} />
                        <InputError message={errors.adress} />
                    </div>

                    {/* Horarios */}
                    <div>
                        <Label htmlFor="opening_hours">Horario Apertura</Label>
                        <Input id="opening_hours" value={data.opening_hours} onChange={(e) => setData('opening_hours', e.target.value)} placeholder="08:00" />
                        <InputError message={errors.opening_hours} />
                    </div>

                    <div>
                        <Label htmlFor="closing_hours">Horario Cierre</Label>
                        <Input id="closing_hours" value={data.closing_hours} onChange={(e) => setData('closing_hours', e.target.value)} placeholder="18:00" />
                        <InputError message={errors.closing_hours} />
                    </div>

                    {/* Contacto 1 */}
                    {/* Contacto 1 */}
                    <div className="col-span-2 mt-6">
                        <h2 className="text-lg font-semibold text-gray-700">Contacto 1</h2>
                    </div>

                    <div>
                        <Label htmlFor="contact1_name">Nombre completo</Label>
                        <Input id="contact1_name" value={data.contact1_name} onChange={(e) => setData('contact1_name', e.target.value)} />
                        <InputError message={errors.contact1_name} />
                    </div>

                    <div>
                        <Label htmlFor="contact1_phone">Teléfono (Celular)</Label>
                        <Input id="contact1_phone" value={data.contact1_phone} onChange={(e) => setData('contact1_phone', e.target.value)} />
                        <InputError message={errors.contact1_phone} />
                    </div>

                    <div>
                        <Label htmlFor="contact1_email">Correo electrónico</Label>
                        <Input id="contact1_email" value={data.contact1_email} onChange={(e) => setData('contact1_email', e.target.value)} />
                        <InputError message={errors.contact1_email} />
                    </div>

                    {/* Contacto 2 */}
                    <div className="col-span-2 mt-6">
                        <h2 className="text-lg font-semibold text-gray-700">Contacto 2</h2>
                    </div>

                    <div>
                        <Label htmlFor="contact2_name">Nombre completo</Label>
                        <Input id="contact2_name" value={data.contact2_name} onChange={(e) => setData('contact2_name', e.target.value)} />
                        <InputError message={errors.contact2_name} />
                    </div>

                    <div>
                        <Label htmlFor="contact2_phone">Teléfono (Celular)</Label>
                        <Input id="contact2_phone" value={data.contact2_phone} onChange={(e) => setData('contact2_phone', e.target.value)} />
                        <InputError message={errors.contact2_phone} />
                    </div>

                    <div>
                        <Label htmlFor="contact2_email">Correo electrónico</Label>
                        <Input id="contact2_email" value={data.contact2_email} onChange={(e) => setData('contact2_email', e.target.value)} />
                        <InputError message={errors.contact2_email} />
                    </div>


                    <div>
                        <Label htmlFor="hiring_date">Fecha de Registro</Label>
                        <input
                            type="date"
                            id="hiring_date"
                            value={data.hiringdate}
                            onChange={(e) => setData('hiringdate', e.target.value)}
                            className="block w-full border rounded px-3 py-2 text-sm bg-white"
                        />
                        <InputError message={errors.hiringdate} />
                    </div>

                    <div>
                        <Label htmlFor="rut_nit">RUT/NIT</Label>
                        <Input id="rut_nit" value={data.rut_nit} onChange={(e) => setData('rut_nit', e.target.value)} />
                        <InputError message={errors.rut_nit} />
                    </div>

                    <div className="col-span-2 mt-4 grid grid-cols-2 gap-x-6 gap-y-4">
                        <a href="/users/locales">
                            <Button className='w-full' type='button'>
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

