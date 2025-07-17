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
        Schema::create('participants', function (Blueprint $table) {
            $table->id();
            // foreign key events
            $table->foreignId('event_id')->constrained('events')->onDelete('cascade');
            // foreign key users
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null');
            // ondelete set null for records
            $table->string('name');
            $table->string('email');
            $table->enum('status', ['pending', 'confirmed', 'rejected'])->default('pending');
            $table->string('qr_code_data')->nullable()->unique();
            $table->dateTime('registration_date')->useCurrent();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('participants');
    }
};
