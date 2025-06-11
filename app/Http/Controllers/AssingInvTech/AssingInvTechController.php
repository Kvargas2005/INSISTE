<?php

namespace App\Http\Controllers\AssingInvTech;


use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\AssingInvTech;
use App\Models\Component;
use App\Models\Warehouse;
use App\Models\WarehouseStock;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use inertia\Inertia;
use Illuminate\Support\Facades\Auth;


class AssingInvTechController extends Controller
{

    public function listInv($id)
    {
        $user = User::find($id);

        if (!$user) {
            return redirect()->back()->with('error', 'Usuario no encontrado');
        }

        $warehouses = Warehouse::whereHas('assingInvTech', function ($query) use ($id) {
            $query->where('id_technician', $id);
        })->get();

        $components = Component::whereHas('assingInvTech', function ($query) use ($id) {
            $query->where('id_technician', $id);
        })->get();

        $componentIds = AssingInvTech::where('id_technician', $id)->pluck('id_component')->unique();

        $components = Component::whereIn('id', $componentIds)->get();

        $allComponents = Component::all();

        $allStock = WarehouseStock::where('stock', '>', 0)->get();

        $assignInvTech = AssingInvTech::where('id_technician', $id)
            ->select('id', 'id_technician', 'id_component', 'id_warehouse_origin', 'quantity')
            ->where('id_technician', $id)
            ->get();

        return Inertia::render('assingInvTech/listInvTech', [
            'user' => $user,
            'warehouses' => $warehouses,
            'allComponents' => $allComponents,
            'allStock' => $allStock,
            'components' => $components,
            'assignInvTech' => $assignInvTech,
            'technicians' => User::where('id_role', 3)->get(), // 👈 esta línea
        ]);



    }

    public function listTech()
    {
        $technicians = User::where('id_role', 3)->get();
        return Inertia::render('assingInvTech/listTech', ['technicians' => $technicians]);
    }

    public function assingInv($id)
    {

        $user = User::find($id);

        $warehouses = Warehouse::select('id', 'name', 'adress', 'status')->get();

        $Warehouse_components = WarehouseStock::select('id_warehouse', 'id_component', 'stock', 'asigned_stock')
            ->get()
            ->groupBy('id_warehouse');

        $components = $Warehouse_components->map(function ($warehouseComponents, $warehouseId) {
            $warehouse = Warehouse::select('id', 'name', 'adress')
                ->where('id', $warehouseId)
                ->first();

            $mappedComponents = $warehouseComponents->map(function (WarehouseStock $warehouseComponent) {
                $component = Component::select('id', 'name', 'description', 'part_n')
                    ->where('id', $warehouseComponent->id_component)
                    ->first();

                if ($component) {
                    $component->stock = $warehouseComponent->stock;
                }

                return $component;
            })->filter();

            return [
                'warehouse' => $warehouse,
                'components' => $mappedComponents,
            ];
        })->values();





        return Inertia::render('assingInvTech/assing', [
            'components' => $components,
            'warehouses' => $warehouses,
            'user' => $user,
            'warehouseC' => $Warehouse_components
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'idtechnician' => 'required|exists:users,id',
            'assigned' => 'required|array|min:1',
            'assigned.*.id_warehouse' => 'required|exists:warehouse,id',
            'assigned.*.id_component' => 'required|exists:components,id',
            'assigned.*.stock' => 'required|integer|min:1',
        ]);

        foreach ($request->assigned as $item) {
            $existing = AssingInvTech::where('id_technician', $request->idtechnician)
                ->where('id_component', $item['id_component'])
                ->where('id_warehouse_origin', $item['id_warehouse'])
                ->first();

            if ($existing) {
                $existing->quantity += $item['stock'];
                $existing->save();
            } else {
                AssingInvTech::create([
                    'id_technician' => $request->idtechnician,
                    'id_component' => $item['id_component'],
                    'id_warehouse_origin' => $item['id_warehouse'],
                    'quantity' => $item['stock'],
                ]);
            }
        }


        // Aumentar el campo assigned_stock en lugar de disminuir stock
        foreach ($request->assigned as $item) {
            WarehouseStock::where('id_warehouse', $item['id_warehouse'])
                ->where('id_component', $item['id_component'])
                ->increment('asigned_stock', $item['stock']);

            WarehouseStock::where('id_warehouse', $item['id_warehouse'])
                ->where('id_component', $item['id_component'])
                ->decrement('stock', $item['stock']);

            // Verificar si el stock se ha vuelto cero y eliminar la fila
            WarehouseStock::where('stock', 0)
                ->where('asigned_stock', 0)
                ->where('id_warehouse', $item['id_warehouse'])
                ->where('id_component', $item['id_component'])
                ->delete();
        }



        return redirect()->route('assingInvTech.listTech')->with('success', 'Asignaciones realizadas con éxito');
    }


    public function transferTech(Request $request)
    {
        $validated = $request->validate([
            'id_component' => 'required|integer|exists:components,id',
            'origin_id' => 'required|integer|exists:users,id',
            'destination_id' => 'required|integer|exists:users,id|different:origin_id',
            'quantity' => 'required|integer|min:1',
        ]);

        // Buscar entrada existente del origen
        $originEntry = AssingInvTech::where('id_component', $validated['id_component'])
            ->where('id_technician', $validated['origin_id'])
            ->first();

        if (!$originEntry || $originEntry->quantity < $validated['quantity']) {
            return back()->with('error', 'Stock insuficiente para realizar el traslado.');
        }

        // Restar del técnico origen
        $originEntry->quantity -= $validated['quantity'];
        $originEntry->save();

        // Eliminar si la cantidad queda en 0
        if ($originEntry->quantity <= 0) {
            $originEntry->delete();
        }

        // Agregar al técnico destino
        $destinationEntry = AssingInvTech::firstOrCreate(
            [
                'id_component' => $validated['id_component'],
                'id_technician' => $validated['destination_id'],
                'id_warehouse_origin' => $originEntry->id_warehouse_origin,
            ],
            ['quantity' => 0]
        );

        $destinationEntry->quantity += $validated['quantity'];
        $destinationEntry->save();

        return redirect()->back()->with('success', 'Traslado realizado con éxito');
    }

    public function getTechStock(Request $request)
    {
        $request->validate([
            'id_technician' => 'required|exists:users,id',
            'id_warehouse' => 'required|exists:warehouse,id',
        ]);

        $stocks = AssingInvTech::where('id_technician', $request->id_technician)
            ->where('id_warehouse_origin', $request->id_warehouse)
            ->with('component:id,description')
            ->get()
            ->map(function ($item) {
                return [
                    'id_component' => $item->id_component,
                    'component_name' => $item->component->description,
                    'quantity' => $item->quantity
                ];
            });

        return response()->json($stocks);
    }

    public function getTechStockWhitoutWarehouse(Request $request)
    {
        $request->validate([
            'id_technician' => 'required|exists:users,id',
        ]);

        $stocks = AssingInvTech::where('id_technician', $request->id_technician)
            ->with('component:id,description')
            ->with('warehouse:id,name')
            ->get()
            ->map(function ($item) {
                return [
                    'id_component' => $item->id_component,
                    'component_name' => $item->component->description,
                    'id_warehouse' => $item->warehouse->id,
                    'warehouse_name' => $item->warehouse->name,
                    'quantity' => $item->quantity
                ];
            });

        return response()->json($stocks);
    }



    public function transferBetweenTechnicians(Request $request)
    {
        $request->validate([
            'id_component' => 'required|exists:components,id',
            'idTechnician' => 'required|exists:users,id',
            'destination_id' => 'required|exists:users,id|different:idTechnician',
            'id_warehouse' => 'required|exists:warehouse,id',
            'quantity' => 'required|integer|min:1',
        ]);

        $componentId = $request->id_component;
        $originTechId = $request->idTechnician;
        $destTechId = $request->destination_id;
        $warehouseId = $request->id_warehouse;
        $quantity = $request->quantity;

        // Buscar asignación actual
        $assignment = AssingInvTech::where('id_component', $componentId)
            ->where('id_technician', $originTechId)
            ->where('id_warehouse_origin', $warehouseId)
            ->first();

        if (!$assignment || $assignment->quantity < $quantity) {
            return response()->json(['error' => 'Cantidad no disponible para traslado.'], 422);
        }

        // Disminuir del técnico origen
        $assignment->decrement('quantity', $quantity);

        // Eliminar si queda en 0
        if ($assignment->quantity <= 0) {
            $assignment->delete();
        }

        // Asignar al técnico destino (o incrementar si ya existe la asignación)
        $destAssignment = AssingInvTech::firstOrNew([
            'id_component' => $componentId,
            'id_technician' => $destTechId,
            'id_warehouse_origin' => $warehouseId
        ]);

        $destAssignment->quantity += $quantity;
        $destAssignment->save();

        return response()->json(['success' => 'Traslado realizado con éxito.']);
    }


    public function myInventory()
    {
        $user = Auth::user();

        $assignments = \App\Models\AssingInvTech::with([
            'component.brand',
            'component.family',
            'warehouse'
        ])
            ->where('id_technician', $user->id)
            ->get();

        return Inertia::render('assingInvTech/ListMyInventory', [
            'assignInvTech' => $assignments,
        ]);
    }

    public function devolution(Request $request)
    {
        $request->validate([
            'id_component' => 'required|exists:components,id',
            'id_technician' => 'required|exists:users,id',
            'id_warehouse' => 'required|exists:warehouse,id',
            'quantity' => 'required|integer|min:1',
        ]);

        $assignment = AssingInvTech::where('id_component', $request->id_component)
            ->where('id_technician', $request->id_technician)
            ->where('id_warehouse_origin', $request->id_warehouse)
            ->first();

        if (!$assignment || $assignment->quantity < $request->quantity) {
            return redirect()->back()->with('error', 'Cantidad insuficiente para devolución.');
        }

        // Decrementar la cantidad asignada
        $assignment->quantity -= $request->quantity;
        $assignment->save();

        // Eliminar si la cantidad queda en 0
        if ($assignment->quantity <= 0) {
            $assignment->delete();
        }

        // Sumar la cantidad devuelta al stock del almacén correspondiente
        $warehouseStock = WarehouseStock::where('id_warehouse', $request->id_warehouse)
            ->where('id_component', $request->id_component)
            ->first();

        if ($warehouseStock) {
            $warehouseStock->increment('stock', $request->quantity);
            $warehouseStock->decrement('asigned_stock', $request->quantity);
        } else {
            // Si no existe el registro, crearlo
            WarehouseStock::create([
                'id_warehouse' => $request->id_warehouse,
                'id_component' => $request->id_component,
                'stock' => $request->quantity,
                'asigned_stock' => 0,
            ]);
        }

        return redirect()->back()->with('success', 'Devolución realizada con éxito.');
    }

}
