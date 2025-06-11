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
        Schema::create('acta_detail_component', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('id_acta');
            $table->unsignedBigInteger('id_component')->nullable();
            $table->integer('quantity')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->foreign('id_acta')->references('id')->on('acta')->onDelete('cascade');
            $table->foreign('id_component')->references('id')->on('components')->onDelete('cascade');
        });

    }
    public function down(): void
    {
        Schema::dropIfExists('acta_detail_component');
    }

};


