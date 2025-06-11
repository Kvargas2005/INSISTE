<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('warehouse_stock', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('id_component');
            $table->unsignedBigInteger('id_warehouse');
            $table->integer('stock');
            $table->integer('asigned_stock')->default(0);
            $table->timestamps();

            $table->foreign('id_component')->references('id')->on('components')->onDelete('cascade');
            $table->foreign('id_warehouse')->references('id')->on('warehouse')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('warehouse_stock');
    }
};
