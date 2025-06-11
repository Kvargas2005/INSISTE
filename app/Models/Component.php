<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Component extends Model
{
    protected $table = "components";

    protected $fillable = [
        'id_family',
        'id_brand',
        'name',
        'description',
        'status',
        'purchase_price',
        'sale_price',
        'part_n',
    ];

    protected $appends = ['stock'];

    public function getStockAttribute()
    {
        return $this->attributes['stock'] ?? null;
    }

    public function getAssignedStockAttribute()
    {
        return $this->attributes['assigned_stock'] ?? null;
    }

    // Relaciones actualizadas

    public function family()
    {
        return $this->belongsTo(Family::class, 'id_family');
    }

    public function brand()
    {
        return $this->belongsTo(Brand::class, 'id_brand');
    }

    public function assingInvTech()
    {
        return $this->hasMany(AssingInvTech::class, 'id_warehouse_origin');
    }
}
