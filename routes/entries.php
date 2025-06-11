<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Entries\EntrieController;

Route::middleware(['rol:admin', 'permiso:view_entrie'])->group(function () {
    Route::get('/entries', [EntrieController::class, 'list'])->name('entries.list');
});
Route::middleware(['rol:admin', 'permiso:create_entrie'])->group(function () {
    Route::post('createEntrie', [EntrieController::class, 'store'])->name('entries.create');
});
