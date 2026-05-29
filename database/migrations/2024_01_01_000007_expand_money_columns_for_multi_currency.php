<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('properties', function (Blueprint $table) {
            $table->decimal('price_per_night', 14, 2)->change();
            $table->decimal('weekend_price', 14, 2)->nullable()->change();
            $table->decimal('cleaning_fee', 14, 2)->default(0)->change();
            $table->decimal('security_deposit', 14, 2)->default(0)->change();
        });

        Schema::table('bookings', function (Blueprint $table) {
            $table->decimal('price_per_night', 14, 2)->change();
            $table->decimal('cleaning_fee', 14, 2)->default(0)->change();
            $table->decimal('security_deposit', 14, 2)->default(0)->change();
            $table->decimal('total_price', 14, 2)->change();
        });
    }

    public function down(): void
    {
        Schema::table('properties', function (Blueprint $table) {
            $table->decimal('price_per_night', 10, 2)->change();
            $table->decimal('weekend_price', 10, 2)->nullable()->change();
            $table->decimal('cleaning_fee', 8, 2)->default(0)->change();
            $table->decimal('security_deposit', 8, 2)->default(0)->change();
        });

        Schema::table('bookings', function (Blueprint $table) {
            $table->decimal('price_per_night', 10, 2)->change();
            $table->decimal('cleaning_fee', 8, 2)->default(0)->change();
            $table->decimal('security_deposit', 8, 2)->default(0)->change();
            $table->decimal('total_price', 10, 2)->change();
        });
    }
};
