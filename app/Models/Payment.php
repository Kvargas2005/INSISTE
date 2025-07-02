<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    // Especificar la tabla en caso de que no siga la convención de nombres
    protected $table = 'payments';

    // Definir los campos que pueden ser llenados masivamente
    protected $fillable = [
        'id_acta',
        'amount_paid',
        'concept',
        'notes',          
        'payment_date',  
    ];

    // Relación con el modelo de Acta
    public function acta()
    {
        return $this->belongsTo(Acta::class, 'id_acta');
    }
}
