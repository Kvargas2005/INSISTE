<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('customer_payments', function (Blueprint $table) {
            $table->id();

            // Relación con acta
            $table->unsignedBigInteger('id_acta');
            $table->foreign('id_acta')->references('id')->on('acta')->onDelete('cascade');

            // Información del pago
            $table->string('voucher_number')->nullable();      
            $table->string('reference')->nullable();            
            $table->string('document_number')->nullable();     
            $table->string('transaction_type')->nullable();    
            $table->string('receiver')->nullable();             
            $table->date('payment_date');                       
            $table->string('currency')->default('CRC');        
            $table->decimal('amount', 12, 2);                  
            $table->text('notes')->nullable();                 

            // Estado del pago
            $table->boolean('is_total')->default(false);        
            $table->unsignedBigInteger('linked_payment_id')->nullable(); 
            $table->foreign('linked_payment_id')->references('id')->on('customer_payments')->nullOnDelete();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('customer_payments');
    }
};
