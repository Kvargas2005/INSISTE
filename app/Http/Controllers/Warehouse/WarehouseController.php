<?php

namespace App\Http\Controllers\Warehouse;

use App\Http\Controllers\Controller;
use App\Models\Warehouse;
use App\Models\WarehouseStock;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Http\RedirectResponse;

class WarehouseController extends Controller
{
    public function list()
    {
        $warehouses = Warehouse::select('id', 'name', 'adress', 'status')->get();

        return Inertia::render('warehouse/list', [
            'warehouses' => $warehouses,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'adress' => 'required|string|max:255',
        ]);

        Warehouse::create([
            'name' => $request->name,
            'adress' => $request->adress,
            'status' => 1, // Default activo
        ]);

        return to_route('warehouse.list')->with('success', 'Bodega creada correctamente.');
    }

    public function fetch($id)
    {
        $warehouse = Warehouse::findOrFail($id);

        return response()->json([
            'data' => $warehouse,
        ]);
    }

    public function edit(Request $request, $id): RedirectResponse
    {
        $warehouse = Warehouse::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            'adress' => 'required|string|max:255',
        ]);

        $warehouse->update([
            'name' => $request->name,
            'adress' => $request->adress,
        ]);

        return to_route('warehouse.list')->with('success', 'Bodega actualizada correctamente.');
    }

    public function toggleStatus(Request $request): RedirectResponse
    {
        $warehouse = Warehouse::findOrFail($request->id);
        $warehouseStock = WarehouseStock::where('id_warehouse', $request->id)->first();
        if ($warehouseStock) {
            return back()->with('error', 'No se puede eliminar la bodega porque tiene stock asociado.');
        }
        $warehouse->status = $request->status;
        $warehouse->save();

        return back()->with('success', 'Estado de la bodega actualizado correctamente.');
    }
}
