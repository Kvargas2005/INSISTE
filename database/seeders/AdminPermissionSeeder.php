<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Permission;

class AdminPermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Busca un admin por email (ajusta el email si es necesario)
        $admin = User::where('email', 'admin@example.com')->first();
        if (!$admin) {
            $this->command->warn('No se encontró el usuario admin@example.com');
            return;
        }
        // Crear el permiso si no existe
        $perm = Permission::firstOrCreate([
            'name' => 'assign_permissions'
        ], [
            'description' => 'Asignar permisos',
            'main' => 'Usuarios',
        ]);
        // Asigna todos los permisos existentes + assign_permissions
        $allPermissions = Permission::pluck('id')->toArray();
        if (!in_array($perm->id, $allPermissions)) {
            $allPermissions[] = $perm->id;
        }
        $admin->permissions()->sync($allPermissions);
        $this->command->info('Permisos asignados al admin.');
    }
}
