<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;



Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    Route::get('dashboardInv', function () {
        return Inertia::render('dashboardInv');
    })->name('dashboardInv');
    Route::get('dashboardAcc', function () {
        return Inertia::render('dashboardAcc');
    })->name('dashboardAcc');
    Route::get('calendar', [\App\Http\Controllers\CalendarController::class, 'index'])->name('calendar.index');

});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
require __DIR__ . '/users.php';
require __DIR__ . '/claves.php';
require __DIR__ . '/suppliers.php';
require __DIR__ . '/components.php';
require __DIR__ . '/warehouse.php';
require __DIR__ . '/service.php';
require __DIR__ . '/entries.php';
require __DIR__ . '/excel.php';
require __DIR__ . '/assignCustomerTech.php';
require __DIR__ . '/assingInvTech.php';
require __DIR__ . '/brands.php';
require __DIR__ . '/movements.php';
require __DIR__ . '/actas.php';
require __DIR__ . '/dashboardTechnician.php';
require __DIR__ . '/dashboard.php';
require __DIR__ . '/verificationCode.php';
require __DIR__ . '/companies.php';
require __DIR__ . '/payments.php';
