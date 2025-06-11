<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDeliveryClassesTable extends Migration
{
    public function up()
    {
        Schema::create('delivery_classes', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->timestamps();
        });

        DB::table('delivery_classes')->insert([
            ['name' => 'Instalación', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Reparación', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Rehubicación', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Sustitución', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Materiales', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Mano Obra', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Otros', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    public function down()
    {
        Schema::dropIfExists('delivery_classes');
    }
}
