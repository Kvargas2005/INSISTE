<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Permission extends Model
{
    protected $table = 'permissions';
    protected $fillable = ['name', 'description', 'main'];

    public function users()
    {
        return $this->belongsToMany(User::class, 'user_permission');
    }
}
