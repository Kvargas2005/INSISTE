<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MainUser extends Model
{
    protected $table = 'main_user';

    protected $fillable = [
        'id',
        'name',
        'description',
        'registration_date',
        'rut_nit',
        'main_address',
        'main_phone',
        'main_email',
        'contact_firstname',
        'contact_lastname',
        'contact_phone',
        'contact_phone_ext',
        'contact_mobile',
        'contact_email',
        'status',
    ];

    protected $casts = [
        'registration_date' => 'date',
    ];
}
