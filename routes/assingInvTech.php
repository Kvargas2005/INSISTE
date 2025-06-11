<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AssingInvTech\AssingInvTechController;

Route::middleware(['rol:admin,tecnico', 'permiso:view_invTech'])->group(function () {
    Route::get('assingTech/TechList', [AssingInvTechController::class, 'listTech'])->name('assingInvTech.listTech');
    Route::get('assingTech/InvList/{id}', [AssingInvTechController::class, 'listInv'])->name('assingInvTech.listInv');
});
Route::middleware(['rol:admin,tecnico', 'permiso:assing_invTech'])->group(function () {
    Route::get('assingTech/assingInv/{id}', [AssingInvTechController::class, 'assingInv'])->name('assingInvTech.assingInv');
    Route::post('assingTech/assingInv', [AssingInvTechController::class, 'store'])->name('assingInvTech.assingInvStore');
    Route::post('/api/transfer-tech', [AssingInvTechController::class, 'transferBetweenTechnicians'])->name('assingInvTech.transferBetweenTechs');
});
Route::middleware(['rol:admin', 'permiso:view_invTech'])->group(function () {
    Route::get('/api/tech-stock', [AssingInvTechController::class, 'getTechStock']);
});
Route::middleware(['rol:admin,tecnico', 'permiso:devolution_invTech'])->group(function () {
    Route::post('/api/devolution', [AssingInvTechController::class, 'devolution'])->name('assingInvTech.devolution');
});
Route::middleware(['rol:tecnico', 'permiso:view_invTech'])->group(function () {
    Route::get('/assingInvTech/my', [AssingInvTechController::class, 'myInventory'])->name('assingInvTech.myInventory');
});


