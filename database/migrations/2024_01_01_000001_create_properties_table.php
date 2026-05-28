<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('properties', function (Blueprint $table) {
            $table->id();
            $table->foreignId('owner_id')->constrained('users')->cascadeOnDelete();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description');
            $table->string('short_description')->nullable();
            $table->enum('type', ['villa', 'apartment', 'cottage', 'penthouse', 'chalet', 'bungalow', 'studio'])->default('villa');

            // Location
            $table->string('address');
            $table->string('city');
            $table->string('state')->nullable();
            $table->string('country');
            $table->string('zip_code')->nullable();
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();

            // Pricing
            $table->decimal('price_per_night', 10, 2);
            $table->decimal('weekend_price', 10, 2)->nullable();
            $table->decimal('cleaning_fee', 8, 2)->default(0);
            $table->decimal('security_deposit', 8, 2)->default(0);
            $table->string('currency', 3)->default('USD');

            // Details
            $table->unsignedTinyInteger('bedrooms')->default(1);
            $table->unsignedTinyInteger('bathrooms')->default(1);
            $table->unsignedSmallInteger('max_guests')->default(2);
            $table->unsignedSmallInteger('area_sqm')->nullable();
            $table->unsignedSmallInteger('min_stay_nights')->default(1);
            $table->unsignedSmallInteger('max_stay_nights')->nullable();

            // Amenities & Rules (JSON)
            $table->json('amenities')->nullable();
            $table->json('house_rules')->nullable();

            // Check-in / Check-out
            $table->time('check_in_time')->default('14:00:00');
            $table->time('check_out_time')->default('11:00:00');

            // Cancellation
            $table->enum('cancellation_policy', ['flexible', 'moderate', 'strict'])->default('moderate');

            // Status
            $table->enum('status', ['draft', 'active', 'inactive'])->default('draft');
            $table->boolean('featured')->default(false);
            $table->decimal('avg_rating', 3, 2)->default(0);
            $table->unsignedInteger('review_count')->default(0);

            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('properties');
    }
};
