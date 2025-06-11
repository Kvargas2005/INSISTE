<?php

namespace App\Http\Controllers\Service;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB; // Asegúrate de tener esto arriba

class ServiceController extends Controller
{
    public function list()
    {
        $services = Service::select('id', 'description', 'status', 'sale_price', 'purchase_price')->get();

        return Inertia::render('service/list', [
            'services' => $services,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'description' => 'required|string|max:255',
            'sale_price' => 'required|numeric',
            'purchase_price' => 'required|numeric',
        ]);

        Service::create([
            'description' => $request->description,
            'sale_price' => $request->sale_price,
            'purchase_price' => $request->purchase_price,
            'status' => 1, // Default activo
        ]);

        return to_route('service.list')->with('success', 'Servicio creado correctamente.');
    }


    public function edit(Request $request, $id): RedirectResponse
    {
        $service = Service::findOrFail($id);

        $request->validate([
            'description' => 'required|string|max:255',
            'sale_price' => 'required|numeric',
            'purchase_price' => 'required|numeric',
        ]);

        $service->update([
            'description' => $request->description,
            'sale_price' => $request->sale_price,
            'purchase_price' => $request->purchase_price,
        ]);

        return to_route('service.list')->with('success', 'Servicio actualizado correctamente.');
    }


    public function fetch($id)
{
    $service = Service::findOrFail($id); // Cambié Supplier por Service

    return response()->json([
        'data' => [
            'id' => $service->id,
            'description' => $service->description,
            'sale_price' => $service->sale_price,
            'purchase_price' => $service->purchase_price,
        ]
    ]);
}


    public function toggleStatus(Request $request): RedirectResponse
    {
        $service = Service::findOrFail($request->id); 
        $service->status = $request->status; 
        $service->save();
    
        return back()->with('success', 'Servicio eliminado correctamente.');
    }

}
    
