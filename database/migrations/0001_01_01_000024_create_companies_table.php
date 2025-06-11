<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('companies', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Nombre de la empresa
            $table->text('description')->nullable();
            $table->string('rut')->nullable(); // RUT o NIT
            $table->string('main_address')->nullable(); // Dirección principal
            $table->string('contact')->nullable(); // Persona de contacto
            $table->string('address')->nullable(); // Dirección alterna
            $table->string('company_email')->nullable(); // Correo empresa
            $table->string('main_contact')->nullable(); // Contacto principal
            $table->string('phone')->nullable(); // Teléfono
            $table->string('extension')->nullable(); // Extensión
            $table->string('cellphone')->nullable(); // Celular
            $table->string('email')->nullable(); // Correo electrónico secundario
            $table->boolean('status')->default(1); // Activo por defecto
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('companies');
    }
};
