<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Acta\ActaController;
use Inertia\Inertia;
use App\Http\Controllers\AssingInvTech\AssingInvTechController;
use App\Http\Controllers\Users\UsersController;


Route::middleware('rol:admin,tecnico,cliente')->group(callback: function () {
    // Listar actas
    Route::middleware(['permiso:view_acta'])->group(function () {
        Route::get('/actas/list', [ActaController::class, 'index'])->name('actas.index');
    });

    // Crear acta (vista)
    Route::middleware(['permiso:create_acta'])->group(function () {
        Route::get('/actas/create', [ActaController::class, 'create'])->name('actas.create');

        // Guardar acta
        Route::post('/actas/store', [ActaController::class, 'store'])->name('actas.store');

        Route::get('/users/getData/{id}', [UsersController::class, 'getData'])->name('users.getData');

        // Crear con tarea
        Route::get('/actas/createWhitAssigment/{id}', [ActaController::class, 'createWhitAssigment'])->name('actas.createWhitAssigment');
    });

    // Mostrar detalle
    Route::get('/actas/show/{id}', [ActaController::class, 'show'])->name('actas.show');

    // Editar acta
    Route::middleware(['permiso:update_acta'])->group(function () {
        Route::get('/actas/edit/{id}', [ActaController::class, 'edit'])->name('actas.edit');
        Route::put('/actas/update/{id}', [ActaController::class, 'update'])->name('actas.update');

        Route::post('/actas/close/{id}', [ActaController::class, 'close'])->name('actas.close');
        Route::post('/actas/open/{id}', [ActaController::class, 'open'])->name('actas.open');
    });

});

Route::middleware(['rol:admin,tecnico,cliente', 'permiso:view_invTech'])->group(function () {
    Route::get('/tech-stock', [AssingInvTechController::class, 'getTechStockWhitoutWarehouse'])
        ->name('assingInvTech.getTechStock');
});

Route::middleware(['rol:admin,tecnico,cliente', 'permiso:view_user'])->group(function () {
    Route::get('/tech-code', [UsersController::class, 'getTechCode'])
        ->name('users.techcode');
});
