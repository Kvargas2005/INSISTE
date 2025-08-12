<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Permission;

class PermissionSeeder extends Seeder
{
    public function run(): void
    {
        $permissions = [
            ['name' => 'view_user', 'description' => 'Ver usuarios', 'main' => 'Usuarios'],
            ['name' => 'create_user', 'description' => 'Crear usuarios', 'main' => 'Usuarios'],
            ['name' => 'update_user', 'description' => 'Actualizar usuarios', 'main' => 'Usuarios'],
            ['name' => 'deactivate_user', 'description' => 'Desactivar usuarios', 'main' => 'Usuarios'],
            ['name' => 'view_permission', 'description' => 'Ver permisos', 'main' => 'Usuarios'],
            ['name' => 'assign_permissions', 'description' => 'Asignar permisos', 'main' => 'Usuarios'],
            ['name' => 'view_supliers', 'description' => 'Ver proveedores', 'main' => 'Proveedores'],
            ['name' => 'create_supliers', 'description' => 'Crear proveedores', 'main' => 'Proveedores'],
            ['name' => 'update_supliers', 'description' => 'Actualizar proveedores', 'main' => 'Proveedores'],
            ['name' => 'deactivate_supliers', 'description' => 'Desactivar proveedores', 'main' => 'Proveedores'],
            ['name' => 'view_brands', 'description' => 'Ver marcas', 'main' => 'Marcas'],
            ['name' => 'create_brands', 'description' => 'Crear marcas', 'main' => 'Marcas'],
            ['name' => 'update_brands', 'description' => 'Actualizar marcas', 'main' => 'Marcas'],
            ['name' => 'deactivate_brands', 'description' => 'Desactivar marcas', 'main' => 'Marcas'],
            ['name' => 'view_products', 'description' => 'Ver productos', 'main' => 'Productos'],
            ['name' => 'create_products', 'description' => 'Crear productos', 'main' => 'Productos'],
            ['name' => 'update_products', 'description' => 'Actualizar productos', 'main' => 'Productos'],
            ['name' => 'deactivate_products', 'description' => 'Desactivar productos', 'main' => 'Productos'],
            ['name' => 'excel_products', 'description' => 'Exportar productos a Excel', 'main' => 'Productos'],
            ['name' => 'confirm_products', 'description' => 'Confirmar productos', 'main' => 'Productos'],
            ['name' => 'view_inventory', 'description' => 'Ver inventario', 'main' => 'Inventario'],
            ['name' => 'view_services', 'description' => 'Ver servicios', 'main' => 'Servicios'],
            ['name' => 'create_services', 'description' => 'Crear servicios', 'main' => 'Servicios'],
            ['name' => 'update_services', 'description' => 'Actualizar servicios', 'main' => 'Servicios'],
            ['name' => 'deactivate_services', 'description' => 'Desactivar servicios', 'main' => 'Servicios'],
            ['name' => 'view_movements', 'description' => 'Ver movimientos', 'main' => 'Movimientos'],
            ['name' => 'create_movements', 'description' => 'Crear movimientos', 'main' => 'Movimientos'],
            ['name' => 'view_invTech', 'description' => 'Ver inventario tecnico', 'main' => 'Inventario'],
            ['name' => 'assing_invTech', 'description' => 'Asignar inventario tecnico', 'main' => 'Inventario'],
            ['name' => 'devolution_invTech', 'description' => 'Devolución de inventario tecnico', 'main' => 'Inventario'],
            ['name' => 'toTech_invTech', 'description' => 'Enviar a técnico inventario tecnico', 'main' => 'Inventario'],
            ['name' => 'view_warehouse', 'description' => 'Ver almacén', 'main' => 'Almacénes'],
            ['name' => 'create_warehouse', 'description' => 'Crear almacén', 'main' => 'Almacénes'],
            ['name' => 'update_warehouse', 'description' => 'Actualizar almacén', 'main' => 'Almacénes'],
            ['name' => 'deactivate_warehouse', 'description' => 'Desactivar almacén', 'main' => 'Almacénes'],
            ['name' => 'view_entrie', 'description' => 'Ver entradas', 'main' => 'Movimientos'],
            ['name' => 'create_entrie', 'description' => 'Crear entradas', 'main' => 'Movimientos'],
            ['name' => 'view_acta', 'description' => 'Ver acta', 'main' => 'Actas'],
            ['name' => 'create_acta', 'description' => 'Crear acta', 'main' => 'Actas'],
            ['name' => 'update_acta', 'description' => 'Editar acta', 'main' => 'Actas'],
            ['name' => 'view_visits', 'description' => 'Ver visitas', 'main' => 'Actas'],
            ['name' => 'assing_visits', 'description' => 'Asignar visitas', 'main' => 'Actas'],
            ['name' => 'view_keys', 'description' => 'Ver llaves', 'main' => 'Llaves'],
            ['name' => 'create_keys', 'description' => 'Crear llaves', 'main' => 'Llaves'],
            ['name' => 'update_keys', 'description' => 'Actualizar llaves', 'main' => 'Llaves'],
            ['name' => 'deactivate_keys', 'description' => 'Desactivar llaves', 'main' => 'Llaves'],
            ['name' => 'view_local', 'description' => 'Ver local', 'main' => 'Locales'],
            ['name' => 'create_local', 'description' => 'Crear local', 'main' => 'Locales'],
            ['name' => 'update_local', 'description' => 'Actualizar local', 'main' => 'Locales'],
            ['name' => 'deactivate_local', 'description' => 'Desactivar local', 'main' => 'Locales'],
            ['name' => 'view_companies', 'description' => 'Ver empresas', 'main' => 'Empresas'],
            ['name' => 'create_companies', 'description' => 'Crear empresas', 'main' => 'Empresas'],
            ['name' => 'update_companies', 'description' => 'Actualizar empresas', 'main' => 'Empresas'],
            ['name' => 'deactivate_companies', 'description' => 'Desactivar empresas', 'main' => 'Empresas'],
            // Clientes (Casa Matriz)
            ['name' => 'view_clients', 'description' => 'Ver clientes (Casa Matriz)', 'main' => 'Clientes'],
            ['name' => 'create_clients', 'description' => 'Crear clientes (Casa Matriz)', 'main' => 'Clientes'],
            ['name' => 'update_clients', 'description' => 'Actualizar clientes (Casa Matriz)', 'main' => 'Clientes'],
            ['name' => 'deactivate_clients', 'description' => 'Desactivar clientes (Casa Matriz)', 'main' => 'Clientes'],
        ];
        foreach ($permissions as $perm) {
            Permission::firstOrCreate(['name' => $perm['name']], $perm);
        }
    }
}
