<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DeliveryType extends Model
{
    protected $table = 'delivery_type';
    public $timestamps = false;
    protected $fillable = ['description', 'status'];
}
