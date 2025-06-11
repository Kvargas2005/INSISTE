<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

class VerificationCode extends Model
{
    use HasFactory;

    protected $fillable = [
        'id_user',
        'code',
        'expires_at',
    ];

    protected $dates = [
        'expires_at',
    ];

    // Relación con el usuario
    public function user()
    {
        return $this->belongsTo(User::class, 'id_user');
    }

    // Método para verificar si está vigente
    public function isValid(): bool
    {
        return $this->expires_at->isFuture();
    }

    // Scope para obtener solo códigos válidos
    public function scopeValid($query)
    {
        return $query->where('expires_at', '>', Carbon::now());
    }
}
