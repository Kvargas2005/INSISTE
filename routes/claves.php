<?php


use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ClavesController;

Route::middleware(['rol:admin,tecnico', 'permiso:view_keys'])->group(function () {
    Route::get('/claves/list', [ClavesController::class, 'list'])->name('claves.list');
    Route::get('/clave/{id}/fetch', [ClavesController::class, 'fetch'])->name('claves.fetchClave');
});
Route::middleware(['rol:admin,tecnico', 'permiso:create_keys'])->group(function () {
    Route::post('createClave', [ClavesController::class,'store'])->name('claves.createClave');
});
Route::middleware(['rol:admin,tecnico', 'permiso:update_keys'])->group(function () {
    Route::post('/clave/{id}/edit', [ClavesController::class,'edit'])->name('claves.editClave');
});
