<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AssignCustomerTech\AssignCustomerTechController;

Route::middleware(['rol:admin,tecnico', 'permiso:view_visits'])->group(function () {
    Route::get('/assignCustomerTech', [AssignCustomerTechController::class, 'list'])->name('assignCustomerTech.list');
    Route::get('/assignCustomerTech/view', [AssignCustomerTechController::class, 'view'])->name('assignCustomerTech.view');
    Route::get('/assignCustomerTech/{id}/fetch', [AssignCustomerTechController::class, 'fetchAssignment'])->name('assignCustomerTech.fetch');
});
Route::middleware(['rol:admin,tecnico', 'permiso:assing_visits'])->group(function () {
    Route::post('/assignCustomerTech/create', [AssignCustomerTechController::class, 'store'])->name('assignCustomerTech.create');
    Route::post('/assignCustomerTech/{id}/edit', [AssignCustomerTechController::class, 'editAssignment'])->name('assignCustomerTech.edit');
    Route::post('/assignCustomerTech/togglestatus', [AssignCustomerTechController::class, 'toggleStatus'])->name('assignCustomerTech.toggleStatus');
});


