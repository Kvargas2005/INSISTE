<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ActaJobType extends Model
{
    protected $table = 'acta_job_type';
    public $timestamps = false;

    protected $fillable = [
        'id_acta',
        'id_job_types',
    ];

    public function job()
    {
        return $this->belongsTo(JobType::class, 'id_job_types');
    }

    public function acta()
    {
        return $this->belongsTo(Acta::class, 'id_acta');
    }
}
