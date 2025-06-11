<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    protected $table = 'service'; // <-- Aquí corregimos

    protected $fillable = [
        'description',
        'status',
        'sale_price',
        'purchase_price',
    ];
}
