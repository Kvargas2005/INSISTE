<?php

namespace App\Http\Controllers\Movements;

use App\Http\Controllers\Controller;
use App\Models\InvHistory;
use App\Models\WarehouseStock;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Inertia\Response;


class TransferController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'id_component' => 'required|numeric',
            'from_warehouse' => 'required|numeric|different:to_warehouse',
            'to_warehouse' => 'required|numeric',
            'quantity' => 'required|numeric|min:1',
        ]);

        // Verificar stock disponible en bodega origen
        $stock = WarehouseStock::where([
            'id_component' => $request->id_component,
            'id_warehouse' => $request->from_warehouse,
        ])->first();

        if (!$stock || $stock->stock < $request->quantity) {
            return redirect()->back()->with('error', 'No hay suficiente stock en la bodega de origen para realizar el traslado.');
        }

        // Disminuir stock en bodega origen
        $stock->decrement('stock', $request->quantity);

        // Aumentar stock en bodega destino
        WarehouseStock::updateOrCreate(
            [
                'id_component' => $request->id_component,
                'id_warehouse' => $request->to_warehouse,
            ],
            [
                'stock' => DB::raw('IFNULL(stock, 0) + ' . $request->quantity),
            ]
        );

        // Registrar en historial: salida
        InvHistory::create([
            'id_user' => Auth::id(),
            'mov' => 'Traslado',
            'date' => now(),
            'quantity' => '-'.$request->quantity,
            'id_component' => $request->id_component,
            'id_warehouse' => $request->from_warehouse,
        ]);

        // Registrar en historial: ingreso
        InvHistory::create([
            'id_user' => Auth::id(),
            'mov' => 'Recepción traslado',
            'date' => now(),
            'quantity' => $request->quantity,
            'id_component' => $request->id_component,
            'id_warehouse' => $request->to_warehouse,
        ]);

        return redirect()->route('inv_history.index')->with('success', 'Traslado realizado correctamente.');
    }

    public function getStock(Request $request)
    {
        $request->validate([
            'id_component' => 'required|integer|exists:components,id',
            'id_warehouse' => 'required|integer|exists:warehouse,id',
        ]);
    
        $stock = WarehouseStock::where('id_component', $request->id_component)
            ->where('id_warehouse', $request->id_warehouse)
            ->value('stock');
    
        return response()->json(['stock' => $stock ?? 0]);
    }

}
