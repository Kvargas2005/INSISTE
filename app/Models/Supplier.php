<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Supplier extends Model
{
    protected $table = 'suppliers';

    protected $fillable = [
        'name',
        'contact',
        'tax_id',
        'assigned_seller',
        'sales_code',
        'email',
        'address',
        'status',
        'description',
    ];
}
