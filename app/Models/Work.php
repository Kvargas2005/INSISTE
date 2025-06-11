<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Work extends Model
{
    protected $table = 'work';
    public $timestamps = false;
    protected $fillable = ['description', 'status'];
}
