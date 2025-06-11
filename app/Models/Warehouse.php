<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Warehouse extends Model
{
    protected $table = 'warehouse';

    protected $fillable = [
        'name',
        'adress',
        'status',
    ];

    public function assingInvTech()
    {
        return $this->hasMany(AssingInvTech::class, 'id_warehouse_origin');
    }
}

