<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WarehouseStock extends Model
{
    // Define the table name
    protected $table = 'warehouse_stock';

    // Define the fillable attributes
    protected $fillable = [
        'id_component',
        'id_warehouse',
        'stock',
        'asigned_stock',
    ];
}
