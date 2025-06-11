<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Warehouse\WarehouseController;
use App\Http\Controllers\Warehouse\WarehouseStockController;

Route::middleware(['rol:admin', 'permiso:view_warehouse'])->group(function () {
    Route::get('/warehouse', [WarehouseController::class, 'list'])->name('warehouse.list');
});

Route::middleware(['rol:admin', 'permiso:view_inventory'])->group(function () {
    Route::get('/warehouseStock/{id}/stock', [WarehouseStockController::class, 'listComponents'])->name('warehouseStock.listComponents');
    Route::get('/warehouse/{id}/fetch', [WarehouseController::class, 'fetch'])->name('warehouse.fetchWarehouse');
    Route::get('/warehouseStock/list', [WarehouseStockController::class, 'listWarehouse'])->name('warehouseStock.listWarehouse');
});


Route::middleware(['rol:admin', 'permiso:create_warehouse'])->group(function () {
    Route::post('createWarehouse', [WarehouseController::class, 'store'])->name('warehouse.createWarehouse');
});
Route::middleware(['rol:admin', 'permiso:update_warehouse'])->group(function () {
    Route::post('/warehouse/{id}/edit', [WarehouseController::class, 'edit'])->name('warehouse.editWarehouse');
});
Route::middleware(['rol:admin', 'permiso:deactivate_warehouse'])->group(function () {
    Route::post('/warehouse/togglestatus', [WarehouseController::class, 'toggleStatus'])->name('warehouse.toggleStatus');
});
