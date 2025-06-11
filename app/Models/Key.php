<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Key extends Model
{
    protected $table = 'keys';

    protected $fillable = [
        'id',
        'id_user',
        'description',
        'key_type',
        'status',
    ];
}
