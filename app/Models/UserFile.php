<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class UserFile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'filename',
        'path',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
