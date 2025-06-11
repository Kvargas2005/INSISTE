<?php

namespace App\Http\Controllers\Warehouse;

use App\Http\Controllers\Controller;
use App\Models\WarehouseStock;
use App\Models\Warehouse;
use App\Models\Component;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Http\RedirectResponse;

class WarehouseStockController extends Controller
{
    public function listWarehouse()
    {
        $warehousesStock = WarehouseStock::select('id_warehouse')->distinct()->get();

        return Inertia::render('stock/ListWarehouses', [
            'warehouses' => Warehouse::select('id', 'name', 'adress', 'status')
                ->whereIn('id', $warehousesStock)
                ->get(),
        ]);
    }

    public function listComponents($id)
    {
        $Warehouse_components = WarehouseStock::where('id_warehouse', $id)
            ->select('id_component', 'stock', 'asigned_stock')
            ->get();

        $components = $Warehouse_components->map(function ($warehouseComponent) {
            $component = Component::select('id', 'name', 'description', 'status')
                ->where('id', $warehouseComponent->id_component)
                ->first();

            if ($component) {
                $component->stock = $warehouseComponent->stock;
                $component->assigned_stock = $warehouseComponent->asigned_stock;
            }

            return $component;
        })->filter();

        return Inertia::render('stock/ListComponents', [
            'warehouse' => Warehouse::select('id', 'name', 'adress')
                ->where('id', $id)
                ->first(),
            'components' => $components,
        ]);
    }

}
