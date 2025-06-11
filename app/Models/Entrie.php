<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Entrie extends Model
{
    protected $table = "entries";

    protected $fillable = [
        'id',
        'id_component',
        'id_warehouse',
        'quantity',
        'entry_date',
    ];

    
}
