<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CustomerPayments\CustomerPaymentController;

Route::prefix('customerPayments')->name('customerPayments.')->group(function () {
    Route::get('/', [CustomerPaymentController::class, 'list'])->name('list');
    Route::post('/store', [CustomerPaymentController::class, 'store'])->name('store');
    Route::post('/toggle', [CustomerPaymentController::class, 'toggleStatus'])->name('toggle');
    Route::post('/edit/{id}', [CustomerPaymentController::class, 'update'])->name('edit');
    Route::get('/fetch/{id}', [CustomerPaymentController::class, 'fetch'])->name('fetch');
    Route::delete('/delete/{id}', [CustomerPaymentController::class, 'destroy'])->name('delete');
    Route::get('/show/{id}', [CustomerPaymentController::class, 'show'])->name('show');
});
