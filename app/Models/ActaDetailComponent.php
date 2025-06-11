<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ActaDetailComponent extends Model
{
    protected $table = 'acta_detail_component';

    protected $fillable = [
        'id_acta', 'id_component', 'quantity', 'notes'
    ];

    public function component() {
        return $this->belongsTo(Component::class, 'id_component');
    }
}
