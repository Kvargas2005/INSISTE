<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InvHistory extends Model
{
    use HasFactory;

    protected $table = 'inv_history';

    protected $fillable = [
        'id_user',
        'mov',
        'date',
        'quantity',
        'id_component',
        'id_warehouse'
    ];

    // Relación con el modelo User
    public function user()
    {
        return $this->belongsTo(User::class, 'id_user');
    }

    public function component()
    {
        return $this->belongsTo(Component::class, 'id_component');
    }

    public function warehouse()
    {
        return $this->belongsTo(Warehouse::class, 'id_warehouse');
    }
}
