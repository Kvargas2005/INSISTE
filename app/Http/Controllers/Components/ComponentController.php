<?php

namespace App\Http\Controllers\Components;

use App\Http\Controllers\Controller;
use App\Models\Component;
use App\Models\Brand;
use App\Models\Family;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Http\RedirectResponse;
use App\Models\Supplier;

class ComponentController extends Controller
{
    public function list()
    {
        $components = Component::with(['brand:id,name', 'family:id,name'])
            ->select('id', 'id_family', 'id_brand', 'description', 'name', 'status', 'purchase_price', 'sale_price', 'part_n')
            ->get();

        $brands = Brand::select('id', 'name')->get();
        $families = Family::select('id', 'name')->get();
        $suppliers = Supplier::select('id', 'name')->get();

        return Inertia::render('components/list', [
            'components' => $components,
            'brands' => $brands,
            'families' => $families,
            'suppliers' => $suppliers,
        ]);
    }


    public function fetch($id)
    {
        $component = Component::findOrFail($id);

        return response()->json([
            'data' => [
                'id' => $component->id,
                'id_brand' => $component->id_brand,
                'id_family' => $component->id_family,
                'name' => $component->name,
                'description' => $component->description,
                'status' => $component->status,
                'purchase_price' => $component->purchase_price,
                'sale_price' => $component->sale_price,
                'part_n' => $component->part_n,
            ],
        ]);
    }

    public function create()
    {
        $brands = Brand::select('id', 'name')->get();
        $families = Family::select('id', 'name')->get();

        return Inertia::render('components/create', [
            'brands' => $brands,
            'families' => $families,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'id_brand' => 'required|exists:brands,id',
            'id_family' => 'required|exists:families,id',
            'name' => 'nullable|string|max:255',
            'description' => 'nullable|string|max:255',
            'purchase_price' => 'nullable|numeric',
            'sale_price' => 'nullable|numeric',
            'part_n' => 'nullable|string|max:100',
        ]);

        Component::create($request->all());

        return to_route('components.list')->with('success', 'Artículo creado correctamente.');
    }

    public function edit($id)
    {
        $component = Component::findOrFail($id);
        $brands = Brand::select('id', 'name')->get();
        $families = Family::select('id', 'name')->get();

        return Inertia::render('components/edit', [
            'component' => $component,
            'brands' => $brands,
            'families' => $families,
        ]);
    }

    public function update(Request $request, $id): RedirectResponse
    {
        $component = Component::findOrFail($id);

        $request->validate([
            'id_brand' => 'required|exists:brands,id',
            'id_family' => 'required|exists:families,id',
            'name' => 'nullable|string|max:255',
            'description' => 'nullable|string|max:255',
            'purchase_price' => 'nullable|numeric',
            'sale_price' => 'nullable|numeric',
            'part_n' => 'nullable|string|max:100',
        ]);

        $component->update($request->all());

        return to_route('components.list')->with('success', 'Artículo actualizado correctamente.');
    }

    public function toggleStatus(Request $request): RedirectResponse
    {
        $component = Component::findOrFail($request->id);
        $component->status = $request->status;
        $component->save();

        return back()->with('success', 'Estado del artículo actualizado correctamente.');
    }
}
