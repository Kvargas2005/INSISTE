<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AssignCustomerTech extends Model
{
    protected $table = 'assign_customer_tech';

    protected $fillable = [
        'id_technician',
        'id_customer',
        'assign_date',
        'comments',
        'alert_days',
        'tech_status',
        'start_date',
        'end_date',
        'status',
    ];
    

    public function technician()
    {
        return $this->belongsTo(User::class, 'id_technician');
    }

    public function customer()
    {
        return $this->belongsTo(User::class, 'id_customer');
    }
}
