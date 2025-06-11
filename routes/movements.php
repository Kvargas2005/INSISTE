<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Movements\InvHistoryController;
use App\Http\Controllers\Movements\TransferController;

Route::middleware('rol:admin')->group(callback: function () {
    Route::middleware(['permiso:view_movements'])->group(function () {
        Route::get('/inv-history', [InvHistoryController::class, 'index'])->name('inv_history.index');
        Route::get('/api/stock', [TransferController::class, 'getStock']);
    });
    Route::middleware(['permiso:create_movements'])->group(function () {
        Route::post('/transfers', [TransferController::class, 'store'])->name('transfers.create');
    });
});
