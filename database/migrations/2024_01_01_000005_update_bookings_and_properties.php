<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Allow guest bookings without an account
        Schema::table('bookings', function (Blueprint $table) {
            $table->foreignId('guest_id')->nullable()->change();
            $table->string('guest_name')->nullable()->after('guest_id');
            $table->string('guest_email')->nullable()->after('guest_name');
            $table->string('guest_phone')->nullable()->after('guest_email');
        });

        // Add Google Maps location URL to properties
        Schema::table('properties', function (Blueprint $table) {
            $table->string('location_url', 1000)->nullable()->after('longitude');
        });
    }

    public function down(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->dropColumn(['guest_name', 'guest_email', 'guest_phone']);
        });
        Schema::table('properties', function (Blueprint $table) {
            $table->dropColumn('location_url');
        });
    }
};
