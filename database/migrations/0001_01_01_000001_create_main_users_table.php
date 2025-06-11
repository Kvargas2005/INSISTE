<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('main_user', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('name');
            $table->string('description')->nullable();

            $table->date('registration_date')->nullable();                     // Fecha de Registro
            $table->string('rut_nit')->nullable();                             // RUT / NIT
            $table->string('main_address')->nullable();                        // Dirección principal
            $table->string('main_phone')->nullable();                          // Teléfono principal
            $table->string('main_email')->nullable();                          // Email cliente principal
            $table->string('contact_firstname')->nullable();                  // Nombre contacto principal
            $table->string('contact_lastname')->nullable();                   // Apellido contacto principal
            $table->string('contact_phone')->nullable();                      // Teléfono contacto principal
            $table->string('contact_phone_ext')->nullable();                  // Extensión telefónica
            $table->string('contact_mobile')->nullable();                     // Celular contacto principal
            $table->string('contact_email')->nullable();                      // Correo contacto principal

            $table->tinyInteger('status')->default(1);
            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('main_user');
    }
};
