<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ActaDetail extends Model
{
    protected $table = 'acta_detail';
    public $timestamps = false;
    protected $fillable = ['id_acta', 'id_component', 'cant', 'note'];

    public function acta(): BelongsTo
    {
        return $this->belongsTo(Acta::class, 'id_acta');
    }

    public function component(): BelongsTo
    {
        return $this->belongsTo(Component::class, 'id_component');
    }
}
