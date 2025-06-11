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
        Schema::create('acta_job_type', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('id_acta');
            $table->unsignedBigInteger('id_job_types');
            $table->timestamps();
        
            $table->foreign('id_acta')->references('id')->on('acta')->onDelete('cascade');
            $table->foreign('id_job_types')->references('id')->on('job_types')->onDelete('cascade');
        });

    }

    public function down(): void
    {
        Schema::dropIfExists('acta_job_type');
    }
};
