<?php

namespace App\Http\Controllers\Brand;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Models\Supplier;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class BrandController extends Controller
{
    public function list(): Response
    {
        $brands = Brand::with('supplier:id,name')
            ->select('id', 'id_supplier', 'name', 'description', 'status')
            ->get();

        $suppliers = Supplier::select('id', 'name')->get();

        return Inertia::render('brand/list', [
            'brands' => $brands,
            'suppliers' => $suppliers,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'id_supplier' => 'required|exists:suppliers,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:255',
        ]);

        Brand::create([
            'id_supplier' => $request->id_supplier,
            'name' => $request->name,
            'description' => $request->description,
            'status' => 1,
        ]);

        return back()->with('success', 'Marca creada correctamente.');

        
    }

    public function fetch($id)
    {
        $brand = Brand::findOrFail($id);

        return response()->json(['data' => $brand]);
    }

    public function edit(Request $request, $id): RedirectResponse
    {
        $request->validate([
            'id_supplier' => 'required|exists:suppliers,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:255',
        ]);

        $brand = Brand::findOrFail($id);
        $brand->update($request->only('id_supplier', 'name', 'description'));

        return to_route('brand.list')->with('success', 'Marca actualizada correctamente.');
    }

    public function toggleStatus(Request $request): RedirectResponse
    {
        $brand = Brand::findOrFail($request->id);
        $brand->status = $request->status;
        $brand->save();

        return back()->with('success', 'Estado de la marca actualizado.');
    }
}
