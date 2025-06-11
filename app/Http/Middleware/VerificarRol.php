<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class VerificarRol
{
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        if (!Auth::check()) {
            abort(403, 'No autenticado');
        }

        $userRole = Auth::user()->id_role;

        $allowedRoles = [
            'admin' => 1,
            'tecnico' => 3,
            'cliente' => 2,
        ];

        $allowedIds = array_map(fn($r) => $allowedRoles[$r] ?? null, $roles);

        if (!in_array($userRole, $allowedIds)) {
            abort(403, 'Acceso no autorizado');
        }

        return $next($request);
    }
}
