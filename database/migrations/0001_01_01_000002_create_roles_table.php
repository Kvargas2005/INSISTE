<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('roles', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('name')->unique();
            $table->string('color')->unique();
            $table->string('text_color')->nullable();
            $table->timestamps();
        });

        DB::table('roles')->insert([
            ['name' => 'Admin', 'color' => '#94a3f3', 'text_color' => '#4f68ec'],
            ['name' => 'Cliente', 'color' => '#94d3f3', 'text_color' => '#1894d2'],
            ['name' => 'Tecnico', 'color' => '#b594f3', 'text_color' => '#854fec'],
        ]);
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('roles');
    }
};
