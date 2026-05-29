<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PropertyImage extends Model
{
    protected $fillable = ['property_id', 'url', 'caption', 'sort_order', 'is_primary'];

    protected $casts = [
        'property_id' => 'integer',
        'sort_order' => 'integer',
        'is_primary' => 'boolean',
    ];

    public function getUrlAttribute($value): string
    {
        if (!$value) {
            return '';
        }

        $path = parse_url($value, PHP_URL_PATH) ?: $value;

        if (str_contains($path, '/storage/properties/')) {
            $path = str_replace('/storage/properties/', '/uploads/properties/', $path);
        }

        if (str_contains($path, '/uploads/properties/')) {
            return asset(ltrim($path, '/'));
        }

        if (str_starts_with($value, 'http')) {
            return $value;
        }

        return asset(ltrim($path, '/'));
    }

    public function property(): BelongsTo
    {
        return $this->belongsTo(Property::class);
    }
}
