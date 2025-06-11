<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateJobTypesTable extends Migration
{
    public function up()
    {
        Schema::create('job_types', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->timestamps();
        });

        DB::table('job_types')->insert([
            ['name' => 'Mant. Preventivo', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Mant. Correctivo', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Entrega Proyecto', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Entrega Materiales', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Capacitación', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Supervisión', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Otro', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    public function down()
    {
        Schema::dropIfExists('job_types');
    }
}
