<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Review extends Model
{
    use HasFactory;

    protected $table = 'reviews';

    protected $fillable = [
        'id_technician',
        'id_acta',
        'rating',
        'comment',
        'status',
    ];
    
    public function technician()
    {
        return $this->belongsTo(User::class, 'id_technician');
    }

    public function acta()
    {
        return $this->belongsTo(Acta::class, 'id_acta');
    }
}
