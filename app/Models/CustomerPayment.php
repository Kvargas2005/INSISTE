<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CustomerPayment extends Model
{
    use HasFactory;

    protected $table = 'customer_payments';

    protected $fillable = [
        'id_acta',
        'voucher_number',
        'reference',
        'document_number',
        'transaction_type',
        'receiver',
        'payment_date',
        'currency',
        'amount',
        'notes',
        'is_total',
        'linked_payment_id',
    ];

    protected $casts = [
        'payment_date' => 'date',
        'amount' => 'decimal:2',
        'is_total' => 'boolean',
    ];

    // Relaciones
    public function acta()
    {
        return $this->belongsTo(Acta::class, 'id_acta');
    }

    public function linkedPayment()
    {
        return $this->belongsTo(CustomerPayment::class, 'linked_payment_id');
    }

    public function relatedPayments()
    {
        return $this->hasMany(CustomerPayment::class, 'linked_payment_id');
    }
}
