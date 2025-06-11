<?php

namespace App\Http\Controllers\Entries;

use App\Http\Controllers\Controller;
use App\Models\Entrie;
use App\Models\Component;
use App\Models\Warehouse;
use App\Models\WarehouseStock;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use App\Models\InvHistory;

class EntrieController extends Controller
{
    public function list()
    {
        // Traemos componentes con relaciones brand y family para filtrar en frontend
        $components = Component::with(['brand:id,name', 'family:id,name'])
            ->select('id', 'description', 'id_brand', 'id_family')
            ->get()
            ->map(function ($component) {
                return [
                    'id' => $component->id,
                    'description' => $component->description,
                    'brandName' => $component->brand->name ?? '',
                    'familyName' => $component->family->name ?? '',
                ];
            });

        $entries = Entrie::select('id', 'entry_date', 'id_component', 'id_warehouse', 'quantity')->get();
        $warehouses = Warehouse::select('id', 'name', 'adress')->get()->map(function ($warehouse) {
            $warehouse->name = $warehouse->name . ' - ' . $warehouse->adress;
            return $warehouse;
        });

        return Inertia::render('entries/list', [
            'components' => $components,
            'entries' => $entries,
            'warehouses' => $warehouses,
        ]);
    }
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'id_component' => 'required|numeric',
            'id_warehouse' => 'required|numeric',
            'quantity' => 'required|numeric|min:1',
        ], [
            'quantity.min' => 'La cantidad debe ser mayor a 1.',
            'required' => 'Este campo es obligatorio.',
        ]);

        Entrie::create([
            'id_component' => $request->id_component,
            'id_warehouse' => $request->id_warehouse,
            'quantity' => $request->quantity,
            'entry_date' => now(),
        ]);

        WarehouseStock::updateOrCreate(
            [
                'id_component' => $request->id_component,
                'id_warehouse' => $request->id_warehouse,
            ],
            [
                'stock' => DB::raw('IFNULL(stock, 0) + ' . $request->quantity),
            ]
        );

        InvHistory::create([
            'id_user' => Auth::id(),
            'mov' => 'Entrada', // Puedes poner 'Entrada manual', 'Carga inicial', etc.
            'entry_date' => now(),
            'quantity' => $request->quantity,
            'id_component' => $request->id_component,
            'id_warehouse' => $request->id_warehouse,
        ]);



        return to_route('entries.list')->with('success', 'Entrada creada correctamente, stock actualizado.');
    }
}
