<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('id_role')->nullable();
            $table->unsignedBigInteger('id_main_user')->nullable();
            $table->string('name')->unique();
            $table->string('email')->unique();
            $table->string('password');
            $table->string('phone');
            $table->string('hiringdate')->nullable();
            $table->string('provincia');
            $table->string('canton');
            $table->string('distrito');
            $table->string('adress');
            $table->string('specialization')->nullable();
            $table->string('mails')->nullable();
            $table->string('rut_nit')->nullable();
            $table->text('tech_signature')->nullable();
            $table->string('contact')->nullable();
            $table->string('code')->nullable();
            $table->string('remember_token')->nullable();

            $table->string('driver_license')->nullable();
            $table->string('vehicle_brand')->nullable();
            $table->string('vehicle_plate')->nullable();
            $table->string('social_security')->nullable();
            $table->string('personal_email')->nullable();
            $table->string('tech_type')->nullable();


            $table->string('contact1_name')->nullable(); // nombre y apellido juntos
            $table->string('contact1_phone')->nullable();
            $table->string('contact1_email')->nullable();

            $table->string('contact2_name')->nullable(); // nombre y apellido juntos
            $table->string('contact2_phone')->nullable();
            $table->string('contact2_email')->nullable();

            $table->string('opening_hours')->nullable();
            $table->string('closing_hours')->nullable();

            $table->date('deactivation_date')->nullable();
            $table->text('deactivation_note')->nullable();

            $table->timestamps();
            $table->tinyInteger('status')->default(1);

            $table->foreign('id_role')->references('id')->on('roles')->onDelete('set null');
            $table->foreign('id_main_user')->references('id')->on('main_user')->onDelete('set null');
        });

        DB::table('users')->insert([
            [
                'name' => 'Admin',
                'email' => 'admin@example.com',
                'id_role' => '1',
                'id_main_user' => null,
                'status' => '1',
                'password' => bcrypt('12345678'),
                'phone' => '8888-8888',
                'hiringdate' => null,
                'provincia' => '3',
                'canton' => '1',
                'distrito' => '1',
                'adress' => 'Frente Mercado Central',
                'specialization' => null,
                'mails' => null,
                'rut_nit' => null,
                'tech_signature' => null,
                'contact' => null,
                'code' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
