<?php

namespace App\Http\Controllers\Companies;

use App\Http\Controllers\Controller;
use App\Models\Company;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class CompanyController extends Controller
{
    // Mostrar listado de empresas
    public function list(): Response
    {
        $companies = Company::select(
            'id',
            'name',
            'description',
            'rut',
            'main_address',
            'contact',
            'address',
            'company_email',
            'main_contact',
            'phone',
            'extension',
            'cellphone',
            'email',
            'status'
        )->get();

        return Inertia::render('companies/list', [
            'companies' => $companies,
        ]);
    }

    // Guardar una nueva empresa
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'rut' => 'nullable|string|max:100',
            'main_address' => 'nullable|string|max:255',
            'contact' => 'nullable|string|max:100',
            'address' => 'nullable|string|max:255',
            'company_email' => 'nullable|email|max:100',
            'main_contact' => 'nullable|string|max:100',
            'phone' => 'nullable|string|max:20',
            'extension' => 'nullable|string|max:10',
            'cellphone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:100',
        ]);

        Company::create($request->only([
            'name',
            'description',
            'rut',
            'main_address',
            'contact',
            'address',
            'company_email',
            'main_contact',
            'phone',
            'extension',
            'cellphone',
            'email'
        ]));

        return to_route('company.list')->with('success', 'Empresa registrada correctamente');
    }



    // Cambiar estado activo/inactiv

    public function toggleStatus(Request $request): RedirectResponse
    {
        $company = Company::findOrFail($request->id);
        $company->status = $request->status;
        $company->save();

        return back()->with('success', 'Empresa actualizada correctamente');
    }

    // Actualizar datos de una empresa
    public function update(Request $request, $id): RedirectResponse
    {
        $company = Company::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'rut' => 'required|string|max:100',
            'main_address' => 'required|string|max:255',
            'contact' => 'nullable|string|max:100',
            'address' => 'nullable|string|max:255',
            'company_email' => 'nullable|email|max:100',
            'main_contact' => 'nullable|string|max:100',
            'phone' => 'nullable|string|max:20',
            'extension' => 'nullable|string|max:10',
            'cellphone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:100',
        ]);

        $company->update($request->only([
            'name',
            'description',
            'rut',
            'main_address',
            'contact',
            'address',
            'company_email',
            'main_contact',
            'phone',
            'extension',
            'cellphone',
            'email'
        ]));

        return to_route('company.list')->with('success', 'Empresa actualizada correctamente.');
    }

    // Obtener datos de una empresa para edición
    public function fetch($id)
    {
        $company = Company::findOrFail($id);

        return response()->json([
            'data' => [
                'id' => $company->id,
                'name' => $company->name,
                'description' => $company->description,
                'rut' => $company->rut,
                'main_address' => $company->main_address,
                'contact' => $company->contact,
                'address' => $company->address,
                'company_email' => $company->company_email,
                'main_contact' => $company->main_contact,
                'phone' => $company->phone,
                'extension' => $company->extension,
                'cellphone' => $company->cellphone,
                'email' => $company->email,
                'status' => $company->status,
            ]
        ]);
    }
}
