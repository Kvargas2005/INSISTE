<?php

namespace App\Http\Controllers\Suppliers;

use App\Http\Controllers\Controller;
use App\Models\Supplier;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class SupplierController extends Controller
{
    // Listar todos los proveedores
    public function list(): Response
    {
        $suppliers = Supplier::select('id', 'name', 'contact', 'tax_id', 'assigned_seller', 'sales_code', 'email', 'address', 'status', 'description')->get();

        return Inertia::render('suppliers/list', [
            'suppliers' => $suppliers,
        ]);
    }

    // Mostrar la vista de creación
    public function create(): Response
    {
        return Inertia::render('suppliers/create');
    }

    // Guardar nuevo proveedor
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:100',
            'contact' => 'required|string|max:100',
            'tax_id' => 'nullable|string|max:100',
            'assigned_seller' => 'nullable|string|max:100',
            'sales_code' => 'nullable|string|max:100',
            'email' => 'nullable|string|max:100',
            'address' => 'nullable|string|max:255',
            'description' => 'nullable|string|max:255',
        ]);

        Supplier::create($request->only([
            'name', 'contact', 'tax_id', 'assigned_seller', 'sales_code', 'email', 'address', 'description'
        ]));

        return to_route('suppliers.list')->with('success', 'Proveedor creado correctamente');
    }

    // Guardar cambios de edición
    public function update(Request $request, $id): RedirectResponse
    {
        $supplier = Supplier::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:100',
            'contact' => 'required|string|max:100',
            'tax_id' => 'nullable|string|max:100',
            'assigned_seller' => 'nullable|string|max:100',
            'sales_code' => 'nullable|string|max:100',
            'email' => 'nullable|string|max:100',
            'address' => 'nullable|string|max:255',
            'description' => 'nullable|string|max:255',
        ]);

        $supplier->update($request->only([
            'name', 'contact', 'tax_id', 'assigned_seller', 'sales_code', 'email', 'address', 'description'
        ]));

        return to_route('suppliers.list')->with('success', 'Proveedor actualizado correctamente');
    }

    public function fetch($id)
    {
        $supplier = Supplier::findOrFail($id);

        return response()->json([
            'data' => [
                'id' => $id,
                'name' => $supplier->name,
                'contact' => $supplier->contact,
                'tax_id' => $supplier->tax_id,
                'assigned_seller' => $supplier->assigned_seller,
                'sales_code' => $supplier->sales_code,
                'email' => $supplier->email,
                'address' => $supplier->address,
                'description' => $supplier->description,
            ]
        ]);
    }

    public function toggleStatus(Request $request): RedirectResponse
    {
        $supplier = Supplier::findOrFail($request->id);
        $supplier->status = $request->status;
        $supplier->save();

        return back()->with('success', 'Proveedor actualizado correctamente');
    }
}
