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
        Schema::create('families', function (Blueprint $table) {
            $table->id();
            $table->string('name', 255);
            $table->tinyInteger('status')->default(1);
            $table->timestamps();
        });

        DB::table('families')->insert([
            ['name' => 'Panel Incendio', 'status' => 1, ],
            ['name' => 'Sensores', 'status' => 1, ],
            ['name' => 'Bases', 'status' => 1, ],
            ['name' => 'Estaciones Manuales', 'status' => 1, ],
            ['name' => 'Luces Estrobo', 'status' => 1, ],
            ['name' => 'Dispositivos Comunicacion', 'status' => 1, ],
            ['name' => 'Anunciadores Remoto', 'status' => 1, ],
            ['name' => 'Fuentes de Poder', 'status' => 1, ],
            ['name' => 'Otros', 'status' => 1, ],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void 
    {
        Schema::dropIfExists('families');
    }
};
