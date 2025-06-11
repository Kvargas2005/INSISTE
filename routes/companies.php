<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Companies\CompanyController;

Route::middleware(['rol:admin', 'permiso:view_companies'])->group(function () {
    Route::get('/company', [CompanyController::class, 'list'])->name('company.list');
    Route::get('/company/{id}/fetch', [CompanyController::class, 'fetch'])->name('company.fetchCompany');
});
Route::middleware(['rol:admin', 'permiso:create_companies'])->group(function () {
    Route::post('/company', [CompanyController::class, 'store'])->name('company.store');
});
Route::middleware(['rol:admin', 'permiso:update_companies'])->group(function () {
    Route::post('/company/{id}/edit', [CompanyController::class, 'update'])->name('company.editCompany');
});
Route::middleware(['rol:admin', 'permiso:deactivate_companies'])->group(function () {
    Route::post('/company/togglestatus', [CompanyController::class, 'toggleStatus'])->name('company.toggleStatus');
});
