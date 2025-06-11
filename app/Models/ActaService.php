<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ActaService extends Model
{
    protected $table = 'acta_service';

    protected $fillable = [
        'id_acta',
        'id_service'
    ];

    public function service()
    {
        return $this->belongsTo(Service::class, 'id_service');
    }

    public function acta()
    {
        return $this->belongsTo(Acta::class, 'id_acta');
    }
}
