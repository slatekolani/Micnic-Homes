<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Str;

class Booking extends Model
{
    protected $fillable = [
        'reference', 'property_id', 'guest_id',
        'guest_name', 'guest_email', 'guest_phone',
        'check_in', 'check_out', 'guests',
        'price_per_night', 'cleaning_fee', 'security_deposit', 'total_price',
        'status', 'special_requests', 'cancellation_reason', 'confirmed_at', 'cancelled_at',
    ];

    protected $casts = [
        'check_in'     => 'date',
        'check_out'    => 'date',
        'confirmed_at' => 'datetime',
        'cancelled_at' => 'datetime',
    ];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($booking) {
            $booking->reference = 'MPV-' . strtoupper(Str::random(8));
        });
    }

    public function property(): BelongsTo
    {
        return $this->belongsTo(Property::class);
    }

    public function guest(): BelongsTo
    {
        return $this->belongsTo(User::class, 'guest_id');
    }

    public function review(): HasOne
    {
        return $this->hasOne(Review::class);
    }

    public function getNightsAttribute(): int
    {
        return $this->check_in->diffInDays($this->check_out);
    }

    // Helper: get display name regardless of whether guest has an account
    public function getGuestDisplayNameAttribute(): string
    {
        return $this->guest?->name ?? $this->guest_name ?? 'Guest';
    }

    public function getGuestDisplayEmailAttribute(): string
    {
        return $this->guest?->email ?? $this->guest_email ?? '';
    }
}
