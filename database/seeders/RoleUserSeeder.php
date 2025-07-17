<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class RoleUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'name' => 'Admin',
            'email' => 'admin@example.com',
            'password' => Hash::make('bismillah'),
            'role' => 'admin',
        ]);

        User::create([
            'name' => 'Organizer A',
            'email' => 'organizer@example.com',
            'password' => Hash::make('bismillah'),
            'role' => 'event_organizer',
        ]);

        User::create([
            'name' => 'Participant X',
            'email' => 'participant@example.com',
            'password' => Hash::make('bismillah'),
            'role' => 'participant',
        ]);
    }
}