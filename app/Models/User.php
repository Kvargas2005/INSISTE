<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */

    protected $table = 'users'; // Nombre de la tabla en la base de datos

    protected $fillable = [
        'name',
        'email',
        'password',
        'id_role',
        'status',
        'id_main_user',
        'phone',
        'hiringdate',
        'provincia',
        'canton',
        'distrito',
        'adress',
        'code',
        'specialization',
        'tech_signature',
        'mails',
        'rut_nit',
        'contact',

        // Técnicos
        'driver_license',
        'vehicle_brand',
        'vehicle_plate',
        'social_security',
        'personal_email',
        'tech_type',

        // Clientes
        'contact1_name',
        'contact1_phone',
        'contact1_email',
        'contact2_name',
        'contact2_phone',
        'contact2_email',
        'opening_hours',
        'closing_hours',

        'deactivation_date',
        'deactivation_note',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];




    // App\Models\User.php
    protected $casts = [
        'hiring_date' => 'date',
        'deactivation_date' => 'date',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function files()
    {
        return $this->hasMany(UserFile::class, 'user_id');
    }

    public function permissions()
    {
        return $this->belongsToMany(Permission::class, 'user_permission');
    }

    public function hasPermission($permissionName)
    {
        return $this->permissions()->where('name', $permissionName)->exists();
    }

    // Added: relation to parent main user (cliente)
    public function mainUser()
    {
        return $this->belongsTo(MainUser::class, 'id_main_user');
    }
}
