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
        Schema::create('technical_product_assignment', function (Blueprint $table) {
            $table->id(); // Primary key
            $table->unsignedBigInteger('id_component');
            $table->unsignedBigInteger('id_warehouse_origin'); // Assuming it's an integer
            $table->unsignedBigInteger('id_technician');
            $table->integer('quantity');
            $table->timestamps(); // Adds created_at and updated_at

            $table->foreign('id_component')->references('id')->on('components')->onDelete('cascade');
            $table->foreign('id_warehouse_origin')->references('id')->on('warehouse')->onDelete('cascade');
            $table->foreign('id_technician')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('technical_product_assignment');
    }
};
