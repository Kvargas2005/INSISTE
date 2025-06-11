<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\VerificationCodeController;

// Rutas protegidas solo para clientes (rol:cliente)
Route::middleware(['auth', 'verified', 'rol:cliente'])->group(function () {
    Route::get('/codigo-verificacion', [VerificationCodeController::class, 'show'])->name('codigo.verificacion');
});
