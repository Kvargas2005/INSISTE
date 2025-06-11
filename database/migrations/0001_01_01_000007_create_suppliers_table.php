<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('suppliers', function (Blueprint $table) {
            $table->id(); 
            $table->string('name', 100);
            $table->string('contact', 100);
            $table->string('tax_id', 100);          // Cedula jurídica
            $table->string('assigned_seller', 100); // Vendedor asignado
            $table->string('sales_code', 100);      // Código venta
            $table->string('email', 100);           // Correo
            $table->string('address', 255);         // Dirección
            $table->tinyInteger('status')->default(1);
            $table->string('description', 255)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('suppliers');
    }
};
