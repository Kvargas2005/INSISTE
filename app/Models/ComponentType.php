<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ComponentType extends Model
{
    protected $table = 'component_type'; // <-- Así lo encuentra
    protected $fillable = [
        'name',
        'description',
        'status',
    ];
}
