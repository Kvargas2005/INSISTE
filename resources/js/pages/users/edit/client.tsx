import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { LoaderCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { FormEventHandler } from 'react';
import InputError from '@/components/input-error';
import AdressForm from '@/components/AdressForm';
import { showError } from '@/components/SwalUtils';


const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Editar Usuario',
    href: '/users/edit/client',
  },
];

interface Role {
  id: number;
  name: string;
  color: string;
  text_color: string;
}


interface MainUser {
  id: number;
  name: string;
  description: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  id_role: number;
  provincia: string;
  canton: string;
  distrito: string;
  adress: string;
  phone: string;
  mails: string;
  id_main_user: number;
  hiringdate: string;
  rut_nit: string;

  contact1_name: string;
  contact1_phone: string;
  contact1_email: string;

  contact2_name: string;
  contact2_phone: string;
  contact2_email: string;

  opening_hours: string;
  closing_hours: string;
}

type RegisterForm = {
  name: string;
  email: string;
  rol: number;
  provincia: string;
  canton: string;
  distrito: string;
  adress: string;
  phone: string;
  mails: string;
  id_main_user: number;
  hiringdate: string;
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


interface Props {
  user: User;
  roles: Role[];
  main_users: MainUser[];
}

export default function EditUser({ user, roles, main_users }: Props) {
  const { data, setData, post, processing, errors, reset } = useForm<Required<RegisterForm>>({
    name: user.name,
    email: user.email,
    rol: user.id_role,
    provincia: user.provincia,
    canton: user.canton,
    distrito: user.distrito,
    adress: user.adress,
    phone: user.phone,
    mails: user.mails,
    id_main_user: user.id_main_user,
    hiringdate: user.hiringdate,
    rut_nit: user.rut_nit,

    contact1_name: user.contact1_name,
    contact1_phone: user.contact1_phone,
    contact1_email: user.contact1_email,
    contact2_name: user.contact2_name,
    contact2_phone: user.contact2_phone,
    contact2_email: user.contact2_email,
    opening_hours: user.opening_hours,
    closing_hours: user.closing_hours,
  });


  const submit: FormEventHandler = (e) => {
    e.preventDefault();

    if (!data.name || !data.email || !data.rol || !data.provincia || !data.canton || !data.distrito || !data.adress) {
      showError('Por favor, complete todos los campos requeridos.');
      return;
    }

    post(route('users.editSaveClient', { id: user.id }), {});
  };


  return (
    <>
      <AppLayout breadcrumbs={breadcrumbs}>
        <Head title="Editar Usuario" />

        <div className="p-4">
          <h1 className="text-2xl font-bold mb-4">Editar Cliente</h1>

          <form onSubmit={submit} className="grid grid-cols-2 gap-x-6 gap-y-4">
            <div>
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
              />
              <InputError message={errors.name} />
            </div>

            <div>
              <Label htmlFor="email">Correo</Label>
              <Input
                id="email"
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
              />
              <InputError message={errors.email} />
            </div>


            <div>
              <Label htmlFor="phone">Telefono</Label>
              <Input
                id="phone"
                value={data.phone}
                onChange={(e) => setData('phone', e.target.value)}
              />
              <InputError message={errors.phone} />
            </div>

            <div>
              <Label htmlFor="rol">Rol</Label>
              <select
                id="rol"
                value={data.rol}
                onChange={(e) => setData('rol', Number(e.target.value))}
                className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Seleccione un rol</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>{role.name}</option>
                ))}
              </select>
              <InputError message={errors.rol} />
            </div>

            <div>
              <Label htmlFor="mails">Correos adicionales</Label>
              <Input
                id="mails"
                value={data.mails}
                onChange={(e) => setData('mails', e.target.value)}
              />
              <InputError message={errors.mails} />
            </div>

            <div>
              <Label htmlFor="main_user">Cliente</Label>
              <select
                id="main_user"
                value={data.id_main_user}
                onChange={(e) => setData('id_main_user', Number(e.target.value))}
                className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Seleccione Cliente</option>
                {main_users.map((main_user) => (
                  <option key={main_user.id} value={main_user.id}>{main_user.name}</option>
                ))}
              </select>
              <InputError message={errors.id_main_user} />
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
              />
              <InputError message={errors.adress} />
            </div>

            <div>
              <Label htmlFor="hiring_date">Fecha de Contratación</Label>
              <input
                type="date"
                id="hiring_date"
                value={
                  data.hiringdate
                    ? new Date(data.hiringdate).toISOString().split('T')[0] // Asegura el formato YYYY-MM-DD
                    : '' // Si es inválido, muestra una cadena vacía
                }
                onChange={(e) => setData('hiringdate', e.target.value)} // Guarda el valor en el estado
                className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <InputError message={errors.hiringdate} />
            </div>

            <div className="">
              <Label htmlFor="rut_nit">RUT/NIT</Label>
              <Input
                id="rut_nit"
                value={data.rut_nit}
                onChange={(e) => setData('rut_nit', e.target.value)}
                placeholder='34987148739233124'
              />
              <InputError message={errors.rut_nit} />
            </div>
            <div className="col-span-2">
              <h2 className="text-lg font-semibold mt-6 mb-2">Contacto 1</h2>
            </div>

            <div>
              <Label htmlFor="contact1_name">Nombre completo</Label>
              <Input
                id="contact1_name"
                value={data.contact1_name}
                onChange={(e) => setData('contact1_name', e.target.value)}
              />
              <InputError message={errors.contact1_name} />
            </div>

            <div>
              <Label htmlFor="contact1_phone">Teléfono (Celular)</Label>
              <Input
                id="contact1_phone"
                value={data.contact1_phone}
                onChange={(e) => setData('contact1_phone', e.target.value)}
              />
              <InputError message={errors.contact1_phone} />
            </div>

            <div className="col-span-2">
              <Label htmlFor="contact1_email">Correo Electrónico</Label>
              <Input
                id="contact1_email"
                value={data.contact1_email}
                onChange={(e) => setData('contact1_email', e.target.value)}
              />
              <InputError message={errors.contact1_email} />
            </div>

            <div className="col-span-2">
              <h2 className="text-lg font-semibold mt-6 mb-2">Contacto 2</h2>
            </div>

            <div>
              <Label htmlFor="contact2_name">Nombre completo</Label>
              <Input
                id="contact2_name"
                value={data.contact2_name}
                onChange={(e) => setData('contact2_name', e.target.value)}
              />
              <InputError message={errors.contact2_name} />
            </div>

            <div>
              <Label htmlFor="contact2_phone">Teléfono (Celular)</Label>
              <Input
                id="contact2_phone"
                value={data.contact2_phone}
                onChange={(e) => setData('contact2_phone', e.target.value)}
              />
              <InputError message={errors.contact2_phone} />
            </div>

            <div className="col-span-2">
              <Label htmlFor="contact2_email">Correo Electrónico</Label>
              <Input
                id="contact2_email"
                value={data.contact2_email}
                onChange={(e) => setData('contact2_email', e.target.value)}
              />
              <InputError message={errors.contact2_email} />
            </div>

            <div>
              <Label htmlFor="opening_hours">Horario Apertura</Label>
              <Input
                id="opening_hours"
                value={data.opening_hours}
                onChange={(e) => setData('opening_hours', e.target.value)}
                placeholder="08:00"
              />
              <InputError message={errors.opening_hours} />
            </div>

            <div>
              <Label htmlFor="closing_hours">Horario Cierre</Label>
              <Input
                id="closing_hours"
                value={data.closing_hours}
                onChange={(e) => setData('closing_hours', e.target.value)}
                placeholder="17:00"
              />
              <InputError message={errors.closing_hours} />
            </div>



            <div className="col-span-2 mt-4 grid grid-cols-2 gap-x-6 gap-y-4">
              <a href="/users/locales" >
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
      </AppLayout >
    </>
  );
}
