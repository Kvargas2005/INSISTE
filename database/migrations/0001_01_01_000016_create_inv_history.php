<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('inv_history', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('id_user');
            $table->string('mov');
            $table->timestamp('date');
            $table->integer('quantity');
            $table->unsignedBigInteger('id_component');
            $table->unsignedBigInteger('id_warehouse');
            $table->timestamps();

            $table->foreign('id_user')->references('id')->on('users');
            $table->foreign('id_component')->references('id')->on('components');
            $table->foreign('id_warehouse')->references('id')->on('warehouse');

        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inv_history');
    }
};
