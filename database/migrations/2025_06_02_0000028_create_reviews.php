<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('id_technician');
            $table->unsignedBigInteger('id_acta');
            $table->tinyInteger('rating')->unsigned();
            $table->text('comment')->nullable();
            $table->tinyInteger('status')->default(1);
            $table->timestamps();

            // Relación con la tabla acta
            $table->foreign('id_technician')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('id_acta')->references('id')->on('acta')->onDelete('cascade');

        });

    }
    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }


};
