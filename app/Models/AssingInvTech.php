<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AssingInvTech extends Model
{
    protected $table = 'technical_product_assignment';

    protected $fillable = [
        'id_component',
        'id_warehouse_origin',
        'id_technician',
        'quantity',
    ];

    public function component()
    {
        return $this->belongsTo(Component::class, 'id_component');
    }

    public function warehouse()
    {
        return $this->belongsTo(Warehouse::class, 'id_warehouse_origin');
    }

    public function users()
    {
        return $this->belongsTo(User::class, 'id_technician');
    }

}
