<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Components\ComponentController;

Route::middleware(['rol:admin', 'permiso:view_products'])->group(function () {
    Route::get('/components', [ComponentController::class, 'list'])->name('components.list');
    Route::get('/components/{id}/fetch', [ComponentController::class, 'fetch'])->name('components.fetchComponent');
});
Route::middleware(['rol:admin', 'permiso:create_products'])->group(function () {
    Route::post('createComponent', [ComponentController::class, 'store'])->name('components.createComponent');
});
Route::middleware(['rol:admin', 'permiso:update_products'])->group(function () {
    Route::post('/components/{id}/edit', [ComponentController::class, 'update'])->name('components.editComponent');
});
Route::middleware(['rol:admin', 'permiso:deactivate_products'])->group(function () {
    Route::post('/components/togglestatus', [ComponentController::class,'toggleStatus'])->name('components.toggleStatus');
});
