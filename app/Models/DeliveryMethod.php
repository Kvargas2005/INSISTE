<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DeliveryMethod extends Model
{
    protected $table = 'delivery_method';
    public $timestamps = false;
    protected $fillable = ['description', 'status'];
}
