<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('assign_customer_tech_service', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('assign_id');
            $table->unsignedBigInteger('service_id');

            $table->timestamps();

            $table->foreign('assign_id')->references('id')->on('assign_customer_tech')->onDelete('cascade');
            $table->foreign('service_id')->references('id')->on('service')->onDelete('cascade');

            // Para evitar duplicados
            $table->unique(['assign_id', 'service_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('assign_customer_tech_service');
    }
};
