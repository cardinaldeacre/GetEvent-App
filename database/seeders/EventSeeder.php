<?php

namespace Database\Seeders;

use App\Models\Event;
use App\Models\User;
use App\Models\Category;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class EventSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $organizer = User::where('role', 'event_organizer')->first();
        $techCategory = Category::where('name', 'Technology')->first();
        $musicCategory = Category::where('name', 'Music')->first();
        $eduCategory = Category::where('name', 'education')->first();
        $artCategory = Category::where('name', 'Art')->first();
        $sportCategory = Category::where('name', 'Sport')->first();

        if ($organizer && $techCategory && $musicCategory && $eduCategory) {
            Event::create([
                'user_id' => $organizer->id,
                'category_id' => $techCategory->id,
                'title' => 'Tech Summit 2025: AI & Future',
                'thumbnail_url' => 'https://via.placeholder.com/640x360.png?text=Tech+Summit',
                'description' => 'An insightful summit covering the latest in Artificial Intelligence and future technologies.',
                'capacity' => 500,
                'contact_info' => 'info@techsummit.com',
                'social_share_link' => 'https://facebook.com/techsummit',
                'location' => 'Jakarta Convention Center',
                'start_time' => now()->addDays(10)->startOfDay(),
                'end_time' => now()->addDays(12)->endOfDay(),
                'is_paid' => true,
                'price' => 150000.00,
            ]);

            Event::create([
                'user_id' => $organizer->id,
                'category_id' => $musicCategory->id,
                'title' => 'Indie Music Fest 2025',
                'thumbnail_url' => 'https://via.placeholder.com/640x360.png?text=Indie+Fest',
                'description' => 'A two-day festival celebrating local indie music talents.',
                'capacity' => 1000,
                'contact_info' => 'contact@indiefest.com',
                'social_share_link' => 'https://instagram.com/indiefest',
                'location' => 'Bandung Park',
                'start_time' => now()->addDays(20)->startOfDay(),
                'end_time' => now()->addDays(21)->endOfDay(),
                'is_paid' => false,
                'price' => null,
            ]);

            Event::create([
                'user_id' => $organizer->id,
                'category_id' => $eduCategory->id,
                'title' => 'Python for Beginners Workshop',
                'thumbnail_url' => 'https://via.placeholder.com/640x360.png?text=Python+Workshop',
                'description' => 'An online workshop to get started with Python programming.',
                'capacity' => 100,
                'contact_info' => 'workshop@python.com',
                'social_share_link' => 'https://twitter.com/pythonworkshop',
                'location' => 'Online (Zoom)',
                'start_time' => now()->addDays(5)->setTime(9, 0, 0),
                'end_time' => now()->addDays(5)->setTime(17, 0, 0),
                'is_paid' => false,
                'price' => null,
            ]);
        } else {
            $this->command->info('Please run RoleUserSeeder and CategorySeeder first.');
        }
    }
}
