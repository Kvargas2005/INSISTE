<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ActaDelivery extends Model
{
    protected $table = 'acta_delivery';
    public $timestamps = false;

    protected $fillable = [
        'id_acta',
        'id_delivery',
    ];

    public function delivery()
    {
        return $this->belongsTo(DeliveryClass::class, 'id_delivery');
    }

    public function acta()
    {
        return $this->belongsTo(Acta::class, 'id_acta');
    }
}
