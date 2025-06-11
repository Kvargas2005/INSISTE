<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Family extends Model
{
    protected $table = 'families';
    protected $fillable = [
        'name',
        'status',
    ];
}
