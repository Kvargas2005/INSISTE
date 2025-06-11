<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('entries', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('id_component');
            $table->unsignedBigInteger('id_warehouse');
            $table->integer('quantity');
            $table->timestamp('entry_date');
            $table->primary('id');
            $table->timestamps();

            $table->foreign('id_component')->references('id')->on('components')->onDelete('cascade');
            $table->foreign('id_warehouse')->references('id')->on('warehouse')->onDelete('cascade');
        });


    }

    public function down(): void
    {
        Schema::dropIfExists('entries');
    }
};
