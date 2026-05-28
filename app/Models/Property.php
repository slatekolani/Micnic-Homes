<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Property extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'owner_id', 'title', 'slug', 'description', 'short_description', 'type',
        'address', 'city', 'state', 'country', 'zip_code', 'latitude', 'longitude',
        'location_url',
        'price_per_night', 'weekend_price', 'cleaning_fee', 'security_deposit', 'currency',
        'bedrooms', 'bathrooms', 'max_guests', 'area_sqm', 'min_stay_nights', 'max_stay_nights',
        'amenities', 'house_rules', 'smoking_allowed', 'pets_allowed', 'parties_allowed',
        'check_in_time', 'check_out_time',
        'cancellation_policy', 'status',
    ];

    protected $casts = [
        'amenities'        => 'array',
        'house_rules'      => 'array',
        'featured'         => 'boolean',
        'smoking_allowed'  => 'boolean',
        'pets_allowed'     => 'boolean',
        'parties_allowed'  => 'boolean',
        'avg_rating'       => 'float',
    ];

    protected $appends = ['map_embed_url'];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($property) {
            if (empty($property->slug)) {
                $property->slug = Str::slug($property->title) . '-' . Str::random(5);
            }
        });
    }

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function images(): HasMany
    {
        return $this->hasMany(PropertyImage::class)->orderBy('sort_order');
    }

    public function primaryImage()
    {
        return $this->hasOne(PropertyImage::class)->where('is_primary', true)->orderBy('sort_order');
    }

    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeFeatured($query)
    {
        return $query->where('featured', true);
    }

    public function scopeTopRated($query)
    {
        return $query->orderByDesc('avg_rating')->orderByDesc('review_count');
    }

    // Build a free Google Maps embed URL (no API key required).
    // If location_url contains coordinates (@lat,lng) we use them for precision,
    // otherwise we fall back to the property address.
    public function getMapEmbedUrlAttribute(): ?string
    {
        if (!$this->location_url && !$this->address) return null;

        // Already an embed-style URL — use as-is
        if ($this->location_url && (
            str_contains($this->location_url, 'output=embed') ||
            str_contains($this->location_url, '/maps/embed')
        )) {
            return $this->location_url;
        }

        // Extract coordinates from a standard Google Maps share URL
        if ($this->location_url && preg_match('/@(-?\d+\.?\d*),(-?\d+\.?\d*)/', $this->location_url, $m)) {
            $q = urlencode("{$m[1]},{$m[2]}");
            return "https://maps.google.com/maps?q={$q}&output=embed&hl=en&z=15";
        }

        // Fallback: address-based embed (no API key needed with this format)
        $q = urlencode(trim("{$this->address}, {$this->city}, {$this->country}"));
        return "https://maps.google.com/maps?q={$q}&output=embed&hl=en&z=15";
    }
}
