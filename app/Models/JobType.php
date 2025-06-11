<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JobType extends Model
{
    protected $table = 'job_types';
    protected $fillable = ['name'];

    public function actas()
    {
        return $this->belongsToMany(Acta::class, 'acta_job_type');
    }
}
