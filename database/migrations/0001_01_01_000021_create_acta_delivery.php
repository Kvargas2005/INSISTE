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
        Schema::create('acta_delivery', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('id_acta');
            $table->unsignedBigInteger('id_delivery');
            $table->timestamps();

            // Make sure the referenced columns in acta and delivery tables are unsignedBigInteger
            $table->foreign('id_acta')->references('id')->on('acta')->onDelete('cascade');
            $table->foreign('id_delivery')->references('id')->on('delivery_classes')->onDelete('cascade');
        });

    }

    public function down(): void
    {
        Schema::dropIfExists('acta_delivery');
    }
};
