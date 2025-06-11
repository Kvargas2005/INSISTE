<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Brand\BrandController;

Route::middleware(['rol:admin', 'permiso:view_brands'])->group(function () {
    Route::get('/brands', [BrandController::class, 'list'])->name('brands.list');
    Route::get('/brands/{id}/fetch', [BrandController::class, 'fetch'])->name('brands.fetch');
});
Route::middleware(['rol:admin', 'permiso:create_brands'])->group(function () {
    Route::post('/brands/create', [BrandController::class, 'store'])->name('brands.create');
});
Route::middleware(['rol:admin', 'permiso:update_brands'])->group(function () {
    Route::post('/brands/{id}/edit', [BrandController::class, 'edit'])->name('brands.edit');
});
Route::middleware(['rol:admin', 'permiso:deactivate_brands'])->group(function () {
    Route::post('/brands/toggle-status', [BrandController::class, 'toggleStatus'])->name('brands.toggleStatus');
});
