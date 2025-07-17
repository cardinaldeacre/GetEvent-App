<?php

namespace Database\Seeders;

use App\Models\Event;
use App\Models\Participant;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ParticipantSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $participantUser = User::where('role', 'participant')->first();
        $eventTech = Event::where('title', 'Tech Summit 2025: AI & Future')->first();
        $eventIndie = Event::where('title', 'Indie Music Fest 2025')->first();

        if ($participantUser && $eventTech && $eventIndie) {
            // Participant User registers for Tech Summit
            Participant::create([
                'event_id' => $eventTech->id,
                'user_id' => $participantUser->id,
                'name' => $participantUser->name,
                'email' => $participantUser->email,
                'status' => 'pending', // or 'confirmed' after payment
                'qr_code_data' => Str::random(32),
                'registration_date' => now(),
            ]);

            // Guest registers for Indie Music Fest
            Participant::create([
                'event_id' => $eventIndie->id,
                'user_id' => null, // Guest
                'name' => 'Guest Participant',
                'email' => 'guest@example.com',
                'status' => 'confirmed',
                'qr_code_data' => Str::random(32),
                'registration_date' => now(),
            ]);
        } else {
            $this->command->info('Please run RoleUserSeeder and EventSeeder first.');
        }
    }
}