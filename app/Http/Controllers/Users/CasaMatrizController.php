<?php

namespace App\Http\Controllers\Users;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\MainUser;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;

class CasaMatrizController extends Controller
{
    public function createCasamatriz(): Response
    {
        return Inertia::render('users/new/casamatriz', [
            'main_users' => MainUser::select(['id', 'name', 'description', 'status', 'main_phone', 'main_email', 'registration_date'])->get(),
        ]);
    }

    public function storeCasamatriz(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:255',
            'registration_date' => 'nullable|date',
            'rut_nit' => 'nullable|string|max:255',
            'main_address' => 'nullable|string|max:500',
            'main_phone' => 'nullable|string|max:100',
            'main_email' => 'nullable|email|max:255',
            'contact_firstname' => 'nullable|string|max:255',
            'contact_lastname' => 'nullable|string|max:255',
            'contact_phone' => 'nullable|string|max:100',
            'contact_phone_ext' => 'nullable|string|max:20',
            'contact_mobile' => 'nullable|string|max:100',
            'contact_email' => 'nullable|email|max:255',
        ]);

        MainUser::create($request->only([
            'name',
            'description',
            'registration_date',
            'rut_nit',
            'main_address',
            'main_phone',
            'main_email',
            'contact_firstname',
            'contact_lastname',
            'contact_phone',
            'contact_phone_ext',
            'contact_mobile',
            'contact_email',
        ]));

        return to_route('users.listClients')->with('success', 'Cliente creado correctamente');
    }

    public function edit($id): Response
    {
        $mainUser = MainUser::findOrFail($id);

        return Inertia::render('users/edit/casamatriz', [
            'mainUser' => $mainUser,
        ]);
    }

    public function editSaveCasamatriz($id, Request $request): RedirectResponse
    {
        $mainUser = MainUser::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:255',
            'registration_date' => 'nullable|date',
            'rut_nit' => 'nullable|string|max:255',
            'main_address' => 'nullable|string|max:500',
            'main_phone' => 'nullable|string|max:100',
            'main_email' => 'nullable|email|max:255',
            'contact_firstname' => 'nullable|string|max:255',
            'contact_lastname' => 'nullable|string|max:255',
            'contact_phone' => 'nullable|string|max:100',
            'contact_phone_ext' => 'nullable|string|max:20',
            'contact_mobile' => 'nullable|string|max:100',
            'contact_email' => 'nullable|email|max:255',
        ]);

        $mainUser->update($request->only([
            'name',
            'description',
            'registration_date',
            'rut_nit',
            'main_address',
            'main_phone',
            'main_email',
            'contact_firstname',
            'contact_lastname',
            'contact_phone',
            'contact_phone_ext',
            'contact_mobile',
            'contact_email',
        ]));

        return to_route('users.listClients')->with('success', 'Cliente actualizado correctamente');
    }

    public function toggleStatus(Request $request): RedirectResponse
    {
        $request->validate([
            'id' => 'required|exists:main_user,id',
            'status' => 'required|in:1,2', // ⚠️ acepta 1 (activo) o 2 (desactivado)
        ]);

        $mainUser = MainUser::findOrFail($request->id);
        $mainUser->status = $request->status;
        $mainUser->save();

        return back()->with('success', 'Estado actualizado correctamente');
    }


}
