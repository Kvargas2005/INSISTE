<?php

namespace App\Imports;

use App\Models\Component;
use Maatwebsite\Excel\Concerns\ToModel;

class ComponentsImport implements ToModel
{
    public function model(array $row)
    {
        // Saltar fila de encabezados si es necesario
        if ($row[0] === 'No. de Parte' || $row[0] === null) {
            return null;
        }

        return new Component([
            'id_brand' => $row[7],
            'id_family' => $row[8],
            'name' => $row[1],
            'description' => $row[2],
            'purchase_price' => $row[5],
            'sale_price' => $row[6],
            'part_n' => $row[0],
            'status' => 1,
        ]);
    }
}
