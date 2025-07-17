<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Category::create(['name' => 'Electronics', 'description' => 'Electronics products']);
        Category::create(['name' => 'Technology', 'description' => 'Events related to technology and innovation.']);
        Category::create(['name' => 'Music', 'description' => 'Concerts and music festivals.']);
        Category::create(['name' => 'Education', 'description' => 'Workshops and seminars for learning.']);
        Category::create(['name' => 'Art', 'description' => 'Exhibitions and creative workshops.']);
        Category::create(['name' => 'Sport', 'description' => 'Sporting events and competitions.']);
    }
}
