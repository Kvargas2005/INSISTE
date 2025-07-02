<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Acta extends Model
{
    protected $table = 'acta';

    protected $fillable = [
        'id_created_by',
        'id_for',
        'contact',
        'project',
        'service_location',
        'phone',
        'code',
        'delivery_scope',
        'delivery_category_detail',
        'job_type_detail',
        'service_detail',
        'description',
        'visit_type',
        'start_time',
        'end_time',
        'technician_signature',
        'client_signature',
        'notes',
        'is_open',
    ];

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'id_created_by');
    }

    public function client(): BelongsTo
    {
        return $this->belongsTo(User::class, 'id_for');
    }

    public function components(): HasMany
    {
        return $this->hasMany(ActaDetailComponent::class, 'id_acta');
    }

    public function services(): HasMany
    {
        return $this->hasMany(ActaService::class, 'id_acta');
    }

    public function deliverys(): HasMany
    {
        return $this->hasMany(ActaDelivery::class, 'id_acta');
    }

    public function jobs(): HasMany
    {
        return $this->hasMany(ActaJobType::class, 'id_acta');
    }

    public function jobTypes()
    {
        return $this->belongsToMany(JobType::class, 'acta_job_type', 'id_acta', 'id_job_types');
    }

    public function deliveryClasses()
    {
        return $this->belongsToMany(DeliveryClass::class, 'acta_delivery', 'id_acta', 'id_delivery');
    }

    public function technician()
    {
        return $this->belongsTo(User::class, 'id_created_by');
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class, 'id_acta');
    }


}
