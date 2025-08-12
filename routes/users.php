<?php


use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Users\UsersController;
use App\Http\Controllers\Users\CasaMatrizController;

Route::middleware(['rol:admin', 'permiso:view_user'])->group(function () {
    Route::get('/users/list', [UsersController::class, 'list'])->name('users.list');
    Route::get('/users/listAdmin', [UsersController::class, 'listAdmin'])->name('users.listAdmin');
    Route::get('/users/administradores/{id}', [UsersController::class, 'adminDetail'])->name('users.adminDetail');
});

Route::middleware(['rol:admin', 'permiso:create_user'])->group(function () {
    Route::get('/users/create/admin', [UsersController::class, 'createAdmin'])->name('users.createAdmin');
    Route::get('/users/create/cliente', [UsersController::class, 'createClient'])->name('users.createClient');
    Route::get('/users/create/tecnico', [UsersController::class, 'createTecnico'])->name('users.createTecnico');
    Route::get('/users/create/casamatriz', [CasaMatrizController::class, 'createCasamatriz'])->name('users.createCasamatriz');
    Route::get('/users/new/casamatriz', [CasaMatrizController::class, 'createCasamatriz']);
    Route::post('register', [UsersController::class, 'store']);
    Route::post('registerCasaMatriz', [CasaMatrizController::class, 'storeCasaMatriz'])->name('users.registerCasaMatriz');
});

Route::middleware(['rol:admin', 'permiso:update_user'])->group(function () {
    Route::get('/users/{id}/edit', [UsersController::class, 'edit'])->name('users.edit');
    Route::post('/users/{id}/edit/admin', [UsersController::class, 'editSaveAdmin'])->name('users.editSaveAdmin');
    Route::post('/users/{id}/edit/cliente', [UsersController::class, 'editSaveClient'])->name('users.editSaveClient');
    Route::post('/users/{id}/edit/tecnico', [UsersController::class, 'editSaveTecnico'])->name('users.editSaveTecnico');
    Route::get('/users/{id}/edit/casamatriz', [CasaMatrizController::class, 'edit'])->name('casamatriz.edit');
    Route::post('/users/{id}/edit/casamatriz', [CasaMatrizController::class, 'editSaveCasamatriz'])->name('users.editSaveCasamatriz');
});

Route::middleware(['rol:admin', 'permiso:deactivate_user'])->group(function () {
    Route::post('/users/toggle-status', [UsersController::class, 'toggleStatus'])->name('users.toggle-status');
});


Route::middleware('rol:admin,tecnico')->group(function () {

    Route::middleware(['permiso:view_clients'])->group(function () {
        Route::get('/users/clientes', [UsersController::class, 'listClients'])->name('users.listClients');
        Route::get('/users/clientes/{id}', [CasaMatrizController::class, 'detail'])->name('users.casamatrizDetail');
    });
    // Toggle Casa Matriz status
    Route::middleware(['permiso:deactivate_clients'])->group(function () {
        Route::post('/users/casamatriz/toggle-status', [CasaMatrizController::class, 'toggleStatus'])->name('casamatriz.toggle-status');
    });

    Route::get('/users/locales', [UsersController::class, 'listLocals'])->name('users.listLocals');

    Route::get('/users/tecnicos', [UsersController::class, 'listTechnicians'])->name('users.listTechnicians');

    Route::get('/users/tecnicos/{id}', [UsersController::class, 'techDetail'])->name('users.techDetail');

    Route::get('/users/locales/{id}', [UsersController::class, 'localDetail'])->name('users.localDetail');
});

// Proteger rutas de permisos
Route::middleware(['rol:admin', 'permiso:assign_permissions'])->group(function () {
    Route::get('/users/{id}/permissions', [UsersController::class, 'showPermissions'])->name('users.showPermissions');
    Route::post('/users/{id}/permissions', [UsersController::class, 'assignPermissions'])->name('users.assignPermissions');
});
