<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('id_acta');
            $table->decimal('amount_paid', 10, 2);
            $table->string('concept')->nullable();
            $table->text('notes')->nullable();  // Campo de notas
            $table->date('payment_date')->nullable();  // Campo de fecha de pago
            $table->timestamps();

            // Relación con la tabla acta
            $table->foreign('id_acta')->references('id')->on('acta')->onDelete('cascade');

        });

    }
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }


};
