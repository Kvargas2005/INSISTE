<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DashboardTechnicianController;
use App\Http\Controllers\AssignCustomerTech\AssignCustomerTechController;

// Asegúrate de que solo técnicos puedan acceder
Route::middleware(['auth', 'verified', 'rol:tecnico'])->group(function () {

    // Vista del panel del técnico
    Route::get('/dashboardTechnician', [DashboardTechnicianController::class, 'index'])
        ->name('dashboardTechnician');

});

Route::middleware(['rol:tecnico', 'permiso:assing_visits'])->group(function () {
    Route::get('/assignments', [AssignCustomerTechController::class, 'viewTech'])
        ->name('assignments.tech');

    // (Opcional) Obtener asignaciones por AJAX
    Route::get('/technician/assignments', [DashboardTechnicianController::class, 'fetchAssignmentsByTechnician'])
        ->name('assignments.fetchByTechnician');

    // Iniciar trabajo
    Route::post('/assignments/start', [DashboardTechnicianController::class, 'start'])
        ->name('assignments.start');
});

