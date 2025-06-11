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
        Schema::create('assign_customer_tech', function (Blueprint $table) {
            $table->id(); // Llave primaria
            $table->unsignedBigInteger('id_technician');
            $table->unsignedBigInteger('id_customer');
            $table->dateTime('assign_date')->useCurrent(); // Fecha de asignación (default ahora)
            $table->string('comments')->nullable(); // Comentarios (opcional)
            $table->integer('alert_days')->nullable(); // <-- Aquí está el campo que faltaba
            $table->tinyInteger('tech_status')->default(1); // Pendiente por default
            $table->dateTime('start_date')->nullable(); // Fecha inicio (puede ser nula)
            $table->dateTime('end_date')->nullable(); // Fecha finalización (puede ser nula)
            $table->tinyInteger('status')->default(1); // Estado general (activo por default)
            $table->timestamps(); // created_at y updated_at

            // Llaves foráneas
            $table->foreign('id_technician')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('id_customer')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('assign_customer_tech');
    }
};
