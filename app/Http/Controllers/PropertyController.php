<?php

namespace App\Http\Controllers;

use App\Models\Property;
use App\Models\PropertyImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PropertyController extends Controller
{
    // ── Public ──────────────────────────────────────────────────────────────

    public function index(Request $request)
    {
        $query = Property::active()
            ->with(['images' => fn($q) => $q->orderByDesc('is_primary')->orderBy('sort_order')])
            ->withCount('reviews');

        if ($request->filled('search')) {
            $q = $request->search;
            $query->where(function ($sq) use ($q) {
                $sq->where('title',   'like', "%{$q}%")
                  ->orWhere('city',    'like', "%{$q}%")
                  ->orWhere('country', 'like', "%{$q}%")
                  ->orWhere('address', 'like', "%{$q}%");
            });
        }

        if ($request->filled('type'))      $query->where('type', $request->type);
        if ($request->filled('min_price')) $query->where('price_per_night', '>=', (float) $request->min_price);
        if ($request->filled('max_price')) $query->where('price_per_night', '<=', (float) $request->max_price);
        if ($request->filled('bedrooms'))  $query->where('bedrooms', '>=', (int) $request->bedrooms);
        if ($request->filled('guests'))    $query->where('max_guests', '>=', (int) $request->guests);
        if ($request->filled('featured'))  $query->where('featured', true);

        $sortMap = [
            'price_asc'  => ['price_per_night', 'asc'],
            'price_desc' => ['price_per_night', 'desc'],
            'rating'     => ['avg_rating',      'desc'],
            'newest'     => ['created_at',      'desc'],
        ];

        [$sortCol, $sortDir] = $sortMap[$request->sort ?? 'newest'] ?? ['created_at', 'desc'];
        $query->orderBy($sortCol, $sortDir);

        $properties = $query->paginate(12)->withQueryString();

        return Inertia::render('Properties/Index', [
            'properties' => $properties,
            'filters'    => $request->only(['search', 'type', 'min_price', 'max_price', 'bedrooms', 'guests', 'sort', 'featured']),
            'heroImages' => $this->randomPropertyImages(8),
        ]);
    }

    public function show(Property $property)
    {
        $property->load(['images', 'owner', 'reviews.reviewer']);

        return Inertia::render('Properties/Show', [
            'property' => $property,
        ]);
    }

    // ── Owner ────────────────────────────────────────────────────────────────

    public function ownerIndex()
    {
        $query = Auth::user()?->isAdmin()
            ? Property::query()
            : Auth::user()->properties();

        $properties = $query
            ->with(['images' => fn($q) => $q->orderByDesc('is_primary')->orderBy('sort_order')])
            ->withCount(['bookings', 'reviews'])
            ->latest()
            ->get();

        return Inertia::render('Dashboard/Owner/Properties', [
            'properties' => $properties,
        ]);
    }

    public function create()
    {
        return Inertia::render('Dashboard/Owner/CreateProperty');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title'               => 'required|string|max:255',
            'description'         => 'required|string',
            'short_description'   => 'nullable|string|max:300',
            'type'                => 'required|in:villa,apartment,cottage,penthouse,chalet,bungalow,studio',
            'address'             => 'required|string|max:255',
            'city'                => 'required|string|max:100',
            'state'               => 'nullable|string|max:100',
            'country'             => 'required|string|max:100',
            'zip_code'            => 'nullable|string|max:20',
            'location_url'        => 'nullable|string|max:1000',
            'currency'            => 'nullable|in:USD,EUR,GBP,TZS,KES,ZAR,AED',
            'price_per_night'     => 'required|numeric|min:1|max:99999',
            'weekend_price'       => 'nullable|numeric|min:1|max:99999',
            'cleaning_fee'        => 'nullable|numeric|min:0|max:9999',
            'security_deposit'    => 'nullable|numeric|min:0|max:99999',
            'bedrooms'            => 'required|integer|min:0|max:20',
            'bathrooms'           => 'required|integer|min:1|max:20',
            'max_guests'          => 'required|integer|min:1|max:50',
            'area_sqm'            => 'nullable|integer|min:1|max:9999',
            'min_stay_nights'     => 'nullable|integer|min:1|max:365',
            'max_stay_nights'     => 'nullable|integer|min:1|max:365',
            'amenities'           => 'nullable|array',
            'amenities.*'         => 'string|max:50',
            'house_rules'         => 'nullable|array',
            'smoking_allowed'     => 'nullable|boolean',
            'pets_allowed'        => 'nullable|boolean',
            'parties_allowed'     => 'nullable|boolean',
            'check_in_time'       => 'nullable|date_format:H:i',
            'check_out_time'      => 'nullable|date_format:H:i',
            'cancellation_policy' => 'required|in:flexible,moderate,strict',
            'images'              => 'nullable|array|max:10',
            'images.*'            => 'image|mimes:jpeg,jpg,png,webp|max:10240',
            'image_urls'          => 'nullable|array',
            'image_urls.*'        => 'nullable|string|max:2000',
        ]);

        $data['owner_id'] = Auth::id();
        $data['status']   = 'draft';
        $data['smoking_allowed']  = $request->boolean('smoking_allowed');
        $data['pets_allowed']     = $request->boolean('pets_allowed');
        $data['parties_allowed']  = $request->boolean('parties_allowed');

        $uploadedFiles = $data['images'] ?? [];
        $imageUrls     = $data['image_urls'] ?? [];
        unset($data['images'], $data['image_urls']);

        $property = Property::create($data);

        $sortIndex = 0;
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $url = $this->storePublicPropertyImage($property, $image);
                if (!$url) {
                    Log::warning('Property image upload did not create a readable file.', [
                        'property_id' => $property->id,
                        'filename' => $image->getClientOriginalName(),
                    ]);
                    continue;
                }

                PropertyImage::create([
                    'property_id' => $property->id,
                    'url'         => $url,
                    'sort_order'  => $sortIndex,
                    'is_primary'  => $sortIndex === 0,
                ]);
                $sortIndex++;
            }
        }

        foreach ($imageUrls as $url) {
            if (!$url) continue;
            if ($sortIndex >= 10) break;
            PropertyImage::create([
                'property_id' => $property->id,
                'url'         => $url,
                'sort_order'  => $sortIndex,
                'is_primary'  => $sortIndex === 0,
            ]);
            $sortIndex++;
        }

        return redirect()->route('owner.properties')->with('success', 'Property listed! Set it to Active when ready to publish.');
    }

    public function edit(Property $property)
    {
        $this->authorize('update', $property);
        $property->load('images');
        return Inertia::render('Dashboard/Owner/EditProperty', ['property' => $property]);
    }

    public function update(Request $request, Property $property)
    {
        $this->authorize('update', $property);

        $data = $request->validate([
            'title'               => 'required|string|max:255',
            'description'         => 'required|string',
            'short_description'   => 'nullable|string|max:300',
            'type'                => 'required|in:villa,apartment,cottage,penthouse,chalet,bungalow,studio',
            'address'             => 'required|string|max:255',
            'city'                => 'required|string|max:100',
            'state'               => 'nullable|string|max:100',
            'country'             => 'required|string|max:100',
            'zip_code'            => 'nullable|string|max:20',
            'location_url'        => 'nullable|string|max:1000',
            'currency'            => 'nullable|in:USD,EUR,GBP,TZS,KES,ZAR,AED',
            'price_per_night'     => 'required|numeric|min:1|max:99999',
            'weekend_price'       => 'nullable|numeric|min:1|max:99999',
            'cleaning_fee'        => 'nullable|numeric|min:0|max:9999',
            'security_deposit'    => 'nullable|numeric|min:0|max:99999',
            'bedrooms'            => 'required|integer|min:0|max:20',
            'bathrooms'           => 'required|integer|min:1|max:20',
            'max_guests'          => 'required|integer|min:1|max:50',
            'area_sqm'            => 'nullable|integer|min:1|max:9999',
            'min_stay_nights'     => 'nullable|integer|min:1|max:365',
            'max_stay_nights'     => 'nullable|integer|min:1|max:365',
            'amenities'           => 'nullable|array',
            'amenities.*'         => 'string|max:50',
            'house_rules'         => 'nullable|array',
            'smoking_allowed'     => 'nullable|boolean',
            'pets_allowed'        => 'nullable|boolean',
            'parties_allowed'     => 'nullable|boolean',
            'check_in_time'       => 'nullable|date_format:H:i',
            'check_out_time'      => 'nullable|date_format:H:i',
            'cancellation_policy' => 'required|in:flexible,moderate,strict',
            'status'              => 'required|in:draft,active,inactive',
            'images'              => 'nullable|array|max:10',
            'images.*'            => 'image|mimes:jpeg,jpg,png,webp|max:10240',
            'image_urls'          => 'nullable|array',
            'image_urls.*'        => 'nullable|string|max:2000',
        ]);

        $data['smoking_allowed']  = $request->boolean('smoking_allowed');
        $data['pets_allowed']     = $request->boolean('pets_allowed');
        $data['parties_allowed']  = $request->boolean('parties_allowed');

        $imageUrls = $data['image_urls'] ?? [];
        unset($data['images'], $data['image_urls']);

        $property->update($data);

        $sortMax = $property->images()->max('sort_order') ?? -1;
        $addedCount = 0;

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                if ($property->images()->count() + $addedCount >= 10) break;
                $url = $this->storePublicPropertyImage($property, $image);
                if (!$url) {
                    Log::warning('Property image upload did not create a readable file.', [
                        'property_id' => $property->id,
                        'filename' => $image->getClientOriginalName(),
                    ]);
                    continue;
                }

                PropertyImage::create([
                    'property_id' => $property->id,
                    'url'         => $url,
                    'sort_order'  => $sortMax + $addedCount + 1,
                    'is_primary'  => $property->images()->count() === 0 && $addedCount === 0,
                ]);
                $addedCount++;
            }
        }

        foreach ($imageUrls as $url) {
            if (!$url) continue;
            if ($property->images()->count() + $addedCount >= 10) break;
            PropertyImage::create([
                'property_id' => $property->id,
                'url'         => $url,
                'sort_order'  => $sortMax + $addedCount + 1,
                'is_primary'  => $property->images()->count() === 0 && $addedCount === 0,
            ]);
            $addedCount++;
        }

        return redirect()->route('owner.properties')->with('success', 'Property updated successfully!');
    }

    public function destroy(Property $property)
    {
        $this->authorize('delete', $property);
        $property->delete();
        return redirect()->route('owner.properties')->with('success', 'Property removed.');
    }

    public function destroyImage(Property $property, PropertyImage $image)
    {
        $this->authorize('update', $property);
        abort_unless((int) $image->property_id === (int) $property->id, 404);

        if ($path = $this->publicUploadPathFromUrl($image->getRawOriginal('url') ?: $image->url)) {
            @unlink(public_path($path));
        } elseif ($path = $this->publicStoragePathFromUrl($image->getRawOriginal('url') ?: $image->url)) {
            Storage::disk('public')->delete($path);
        }

        $wasPrimary = $image->is_primary;
        $image->delete();

        if ($wasPrimary) {
            $property->images()->orderBy('sort_order')->first()?->update(['is_primary' => true]);
        }

        return back()->with('success', 'Image removed.');
    }

    public function setPrimaryImage(Property $property, PropertyImage $image)
    {
        $this->authorize('update', $property);
        abort_unless((int) $image->property_id === (int) $property->id, 404);

        $property->images()->update(['is_primary' => false]);
        $image->update(['is_primary' => true]);
        return back()->with('success', 'Cover image updated.');
    }

    private function storePublicPropertyImage(Property $property, \Illuminate\Http\UploadedFile $image): ?string
    {
        $directory = public_path('uploads/properties/' . $property->id);

        if (!is_dir($directory) && !mkdir($directory, 0775, true) && !is_dir($directory)) {
            return null;
        }

        $filename = $image->hashName();
        $image->move($directory, $filename);

        $relativePath = 'uploads/properties/' . $property->id . '/' . $filename;

        return is_file(public_path($relativePath)) ? asset($relativePath) : null;
    }

    private function publicUploadPathFromUrl(string $url): ?string
    {
        $path = parse_url($url, PHP_URL_PATH) ?: $url;
        $marker = '/uploads/';

        if (!str_contains($path, $marker)) {
            return null;
        }

        return ltrim(substr($path, strpos($path, $marker) + 1), '/');
    }

    private function publicStoragePathFromUrl(string $url): ?string
    {
        $path = parse_url($url, PHP_URL_PATH) ?: $url;
        $marker = '/storage/';

        if (!str_contains($path, $marker)) {
            return null;
        }

        return ltrim(substr($path, strpos($path, $marker) + strlen($marker)), '/');
    }

    private function randomPropertyImages(int $limit)
    {
        return PropertyImage::query()
            ->whereHas('property', fn($query) => $query->active())
            ->with('property:id,title,slug')
            ->inRandomOrder()
            ->limit($limit)
            ->get()
            ->map(fn($image) => [
                'id' => $image->id,
                'url' => $image->url,
                'caption' => $image->caption,
                'property_title' => $image->property?->title,
                'property_slug' => $image->property?->slug,
            ]);
    }
}
