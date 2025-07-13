<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Review\ReviewController;

Route::middleware(['auth'])->group(function () {
    // Guardar una review (cliente)
    Route::post('/reviews', [ReviewController::class, 'store'])->name('reviews.store');
    // Listar reviews para admin
    Route::get('/reviews', [ReviewController::class, 'index'])->name('reviews.index');
    // Detalle de reviews de un técnico
    Route::get('/reviews/tecnico/{id}', [ReviewController::class, 'detailTech'])->name('reviews.detailTech');
    // Listar y calificar reviews del cliente
    Route::get('/mis-reseñas', [ReviewController::class, 'myReviews'])->name('reviews.my');
});
