<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Payment\PaymentController;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/payments', [PaymentController::class, 'list'])->name('payments.list');
    Route::post('/payments/create', [PaymentController::class, 'store'])->name('payments.create');
    Route::get('/payments/fetch/{id}', [PaymentController::class, 'fetch'])->name('payments.fetch');
    Route::post('/payments/edit/{id}', [PaymentController::class, 'edit'])->name('payments.edit');
});