import { type SharedData } from '@/types'; // Importa el tipo `SharedData` desde el archivo de tipos del proyecto.
import { Head, Link, usePage } from '@inertiajs/react'; // Importa componentes y hooks de Inertia.js.
import { useEffect } from 'react';


export default function Welcome() {
    // Obtiene las propiedades compartidas de la página actual usando el hook `usePage`.
    // En este caso, se espera que `auth` sea parte de las propiedades compartidas.
    const { auth } = usePage<SharedData>().props;

    useEffect(() => {
        // Si el usuario está autenticado, redirige a la ruta 'dashboard'.
        if (auth.user) {  
            window.location.href = route('dashboard');
        }
        if (!auth.user) {
            window.location.href = route('login');
        }
    }
    , [auth.user]); // El efecto se ejecuta cuando `auth.user` cambia.
}