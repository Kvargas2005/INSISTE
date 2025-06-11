<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Suppliers\SupplierController;

Route::middleware(['rol:admin', 'permiso:view_supliers'])->group(function () {
    Route::get('/suppliers', [SupplierController::class, 'list'])->name('suppliers.list');
});
Route::middleware(['rol:admin', 'permiso:create_supliers'])->group(function () {
    Route::post('createSuppliers', [SupplierController::class, 'store'])->name('suppliers.createSupplier');
});
Route::middleware(['rol:admin', 'permiso:update_supliers'])->group(function () {
    Route::post('/suppliers/{id}/edit', [SupplierController::class,'update'])->name('suppliers.editSupplier');
});
Route::middleware(['rol:admin', 'permiso:view_supliers'])->group(function () {
    Route::get('/suppliers/{id}/fetch', [SupplierController::class, 'fetch'])->name('suppliers.fetchSupplier');
});
Route::middleware(['rol:admin', 'permiso:deactivate_supliers'])->group(function () {
    Route::post('/suppliers/togglestatus', [SupplierController::class,'toggleStatus'])->name('suppliers.toggleStatus');
});
