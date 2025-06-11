<?php

namespace App\Http\Controllers\Movements;

use App\Http\Controllers\Controller;
use App\Models\InvHistory;
use App\Models\Component;
use App\Models\Warehouse;
use Inertia\Inertia;
use Inertia\Response;

class InvHistoryController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('movements/HistoryList', [
            'history' => InvHistory::with(['user', 'component', 'warehouse'])
                ->latest('date')
                ->get(),

            // Traer componentes con brand y family para mostrar en el select
            'components' => Component::with(['brand:id,name', 'family:id,name'])
                ->select('id', 'description', 'id_brand', 'id_family')
                ->get()
                ->map(function ($component) {
                    return [
                        'id' => $component->id,
                        'description' => $component->description,
                        'brandName' => $component->brand->name ?? '',
                        'familyName' => $component->family->name ?? '',
                    ];
                }),
            'warehouses' => Warehouse::select('id', 'name')->get(),
        ]);
    }
}
