<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('events', function (Blueprint $table) {
            $table->id();

            // Foreign Key users
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            // Foreign Key categories
            $table->foreignId('category_id')->constrained('categories')->onDelete('cascade');

            $table->string('title');
            $table->string('thumbnail_url')->nullable();
            $table->text('description');
            $table->unsignedInteger('capacity')->default(0);
            $table->string('contact_info');
            $table->string('social_share_link')->nullable();
            $table->string('location');
            $table->dateTime('start_time');
            $table->dateTime('end_time');

            // Opsi untuk event berbayar
            $table->boolean('is_paid')->default(false);
            $table->decimal('price', 10, 2)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
