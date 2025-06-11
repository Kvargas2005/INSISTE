<?php

namespace App\Http\Controllers;

use App\Models\Family;
use Illuminate\Http\Request;
use App\Models\Component;
use App\Models\Brand;

class ComponentImportController extends Controller
{
    /**
     * Confirmar y guardar productos del Excel, excluyendo duplicados por `Número de Parte`.
     */
    public function confirm(Request $request)
    {
        $request->validate([
            'products' => 'required|array',
            // Opcionalmente, puedes añadir validación para part_n:
            // 'products.*.part_n' => 'nullable|string',
        ]);

        foreach ($request->products as $productData) {
            // Verifica si ya existe el producto por nombre
            if (Component::where('name', $productData['name'])->exists()) {
                continue; // Omitir duplicado
            }

            // Normaliza part_n: si no está definido, o es la cadena 'Undefined', lo dejamos como ''
            $part_n = (isset($productData['part_n']) && $productData['part_n'] !== 'Undefined')
                ? $productData['part_n']
                : '';

            Component::create([
                'id_brand' => $productData['id_brand'],
                'id_family' => $productData['id_family'],
                'name' => $productData['name'],
                'description' => $productData['description'],
                'purchase_price' => $productData['purchase_price'],
                'sale_price' => $productData['sale_price'],
                'part_n' => $part_n,
                'status' => 1,
            ]);
        }

        return to_route('components.list')
            ->with('success', 'Productos agregados exitosamente');
    }


    /**
     * Comprobar si hay productos ya registrados por `Número de Parte`.
     */
    public function checkDuplicates(Request $request)
    {
        $request->validate([
            'part_numbers' => 'required|array',
        ]);

        $existing = Component::whereIn('part_n', $request->part_numbers)
            ->pluck('part_n')
            ->toArray();

        return response()->json([
            'existing_part_numbers' => $existing,
        ]);
    }



    public function fetchBrands()
    {

        $brands = Brand::all();

        return response()->json($brands);
    }

    public function fetchFamily()
    {

        $familys = Family::all();

        return response()->json($familys);
    }
}
