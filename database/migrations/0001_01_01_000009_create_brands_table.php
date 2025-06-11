<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('brands', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('id_supplier');
            $table->string('name', 255);
            $table->string('description')->nullable();
            $table->tinyInteger('status')->default(1);
            $table->timestamps();

            $table->foreign('id_supplier')->references('id')->on('suppliers')->onDelete('cascade');
        });
    }

    public function down(): void {
        Schema::dropIfExists('brands');
    }
};
