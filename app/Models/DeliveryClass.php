<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DeliveryClass extends Model
{
    protected $table = 'delivery_classes';
    protected $fillable = ['name'];

    public function actas()
    {
        return $this->belongsToMany(Acta::class, 'acta_delivery_class');
    }
}
