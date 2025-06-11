<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('components', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('id_brand');
            $table->unsignedBigInteger('id_family'); // antes era id_component_type
            $table->string('name', 255)->nullable();
            $table->string('description', 255)->nullable();
            $table->tinyInteger('status')->default(1);
            $table->decimal('purchase_price', 10, 2);
            $table->decimal('sale_price', 10, 2);
            $table->string('part_n', 100);
            $table->timestamps();

            $table->foreign('id_brand')->references('id')->on('brands')->onDelete('cascade');
            $table->foreign('id_family')->references('id')->on('families')->onDelete('cascade');
        });
    }

    public function down(): void {
        Schema::dropIfExists('components');
    }
};
