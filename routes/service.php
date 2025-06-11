<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Service\ServiceController;

Route::middleware(['rol:admin', 'permiso:view_services'])->group(function () {
    Route::get('/service', [ServiceController::class, 'list'])->name('service.list');
    Route::get('/service/{id}/fetch', [ServiceController::class, 'fetch'])->name('service.fetchService');
});
Route::middleware(['rol:admin', 'permiso:create_services'])->group(function () {
    Route::post('createService', [ServiceController::class, 'store'])->name('service.createService');
});
Route::middleware(['rol:admin', 'permiso:update_services'])->group(function () {
    Route::post('/service/{id}/edit', [ServiceController::class, 'edit'])->name('service.editService');
});
Route::middleware(['rol:admin', 'permiso:deactivate_services'])->group(function () {
    Route::post('/service/togglestatus', [ServiceController::class,'toggleStatus'])->name('service.toggleStatus');
});
