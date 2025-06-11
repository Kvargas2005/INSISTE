<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('acta', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('id_created_by');
            $table->unsignedBigInteger('id_for');
            $table->string('contact')->nullable();
            $table->string('project');
            $table->string('service_location');
            $table->string('phone');
            $table->string('code')->unique();
            $table->string('delivery_scope');
            $table->string('delivery_category_detail')->nullable();
            $table->string('job_type_detail')->nullable();
            $table->string('service_detail')->nullable();
            $table->text('description')->nullable();
            $table->string('visit_type');
            $table->string('start_time')->default(now());
            $table->string('end_time')->default(now());
            $table->longText('technician_signature')->nullable();
            $table->longText('client_signature')->nullable();
            $table->text('notes')->nullable();
            $table->boolean('is_open')->default(false);
            $table->timestamps();

            $table->foreign('id_created_by')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('id_for')->references('id')->on('users')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('acta');
    }
};