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
    href: '/users/edit/admin',
  },
];

interface Role {
  id: number;
  name: string;
  color: string;
  text_color: string;
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
};


interface Props {
  user: User;
  roles: Role[];
}

export default function EditUser({ user, roles }: Props) {
  const { data, setData, post, processing, errors, reset } = useForm<Required<RegisterForm>>({
    name: user.name,
    email: user.email,
    rol: user.id_role,
    provincia: user.provincia,
    canton: user.canton,
    distrito: user.distrito,
    adress: user.adress,
    phone: user.phone,
  });


  const submit: FormEventHandler = (e) => {
    e.preventDefault();

    if (!data.name || !data.email || !data.rol || !data.provincia || !data.canton || !data.distrito || !data.adress) {
      showError('Por favor, complete todos los campos requeridos.');
      return;
    }

    post(route('users.editSaveAdmin', { id: user.id }), {});
  };


  return (
    <>
      <AppLayout breadcrumbs={breadcrumbs}>
        <Head title="Editar Usuario" />

        <div className="p-4">
          <h1 className="text-2xl font-bold mb-4">Editar Usuario</h1>

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
            
          </form>

        </div>
      </AppLayout >
    </>
  );
}
