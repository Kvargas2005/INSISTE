import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface LoginForm {
  email: string;
  password: string;
  remember: boolean;
  [key: string]: string | boolean; // <- esto permite acceso dinámico por string
}


interface LoginProps {
  status?: string;
  canResetPassword: boolean;
}

const primaryColor = '#3376fe';
const primaryColorHover = '#275edc';

export default function Login({ status, canResetPassword }: LoginProps) {
  const { data, setData, post, processing, errors, reset } = useForm<LoginForm>({
    email: '',
    password: '',
    remember: false,
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    post(route('login'), {
      onFinish: () => reset('password'),
    });
  };

  return (
    <>
      <Head title="Iniciar sesión" />

      <div className="min-h-screen flex">
        {/* Lado izquierdo: imagen ocupa todo */}
        <div className="hidden md:block w-1/2">
          <img
            src="/images/loginimg.jpg"
            alt="Ilustración Focus"
            className="object-cover w-full h-full"
          />
        </div>

        {/* Lado derecho: formulario */}
        <div className="flex flex-col justify-center w-full md:w-1/2 px-10 md:px-20 py-12">
          {/* Logo svg centrado arriba */}
          <div className="flex justify-center mb-8">
            <img src="/images/logo.svg" alt="Logo Focus" className="h-20 w-auto" />
          </div>

          {/* Título principal */}
          <h2 className="text-3xl font-bold mb-2 text-gray-900 text-center">¡Bienvenido!</h2>
          <p className="text-gray-500 mb-12 text-center">Inicia sesión para continuar</p>

          <form className="flex flex-col gap-8" onSubmit={submit}>
            <div className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email" className="font-semibold text-gray-700">
                  Correo electrónico
                </Label>
                <Input
                  id="email"
                  type="email"
                  required
                  autoFocus
                  tabIndex={1}
                  autoComplete="email"
                  value={data.email}
                  onChange={(e) => setData('email', e.target.value)}
                  placeholder="correo@ejemplo.com"
                  className="py-3 px-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#3376fe]"
                />
                <InputError message={errors.email} />
              </div>

              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password" className="font-semibold text-gray-700">
                    Contraseña
                  </Label>
                  {canResetPassword && (
                    <TextLink
                      href={route('password.request')}
                      className="ml-auto text-sm text-[#3376fe] hover:underline"
                      tabIndex={5}
                    >
                      ¿Olvidaste tu contraseña?
                    </TextLink>
                  )}
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  tabIndex={2}
                  autoComplete="current-password"
                  value={data.password}
                  onChange={(e) => setData('password', e.target.value)}
                  placeholder="8+ caracteres"
                  className="py-3 px-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#3376fe]"
                />
                <InputError message={errors.password} />
              </div>

              <div className="flex items-center space-x-3">
                <Checkbox
                  id="remember"
                  name="remember"
                  checked={data.remember}
                  onClick={() => setData('remember', !data.remember)}
                  tabIndex={3}
                />
                <Label htmlFor="remember" className="text-gray-700 font-medium">
                  Recordarme
                </Label>
              </div>
            </div>

            <button
              type="submit"
              disabled={processing}
              tabIndex={4}
              className="w-full py-4 bg-[#3376fe] hover:bg-[#275edc] text-white font-bold text-lg rounded-full transition-colors duration-300 flex items-center justify-center gap-2"
            >
              {processing && <LoaderCircle className="h-6 w-6 animate-spin" />}
              Iniciar sesión
            </button>
          </form>

          {status && (
            <div className="mt-6 text-center text-sm font-medium text-green-600">
              {status}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
