<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Property;
use App\Models\PropertyImage;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        // Top 5 for hero carousel (highest rated / most reviewed)
        $carousel = Property::active()
            ->with(['images' => fn($q) => $q->orderByDesc('is_primary')->orderBy('sort_order')])
            ->topRated()
            ->take(5)
            ->get();

        $marketingImages = $this->randomPropertyImages(8);

        // Latest listings grid
        $latest = Property::active()
            ->with(['images' => fn($q) => $q->orderByDesc('is_primary')->orderBy('sort_order')])
            ->latest()
            ->take(8)
            ->get();

        // Category counts
        $categories = Property::active()
            ->selectRaw('type, count(*) as count')
            ->groupBy('type')
            ->orderByDesc('count')
            ->get()
            ->map(fn($row) => ['type' => $row->type, 'count' => $row->count]);

        return Inertia::render('Home', [
            'carousel'   => $carousel,
            'latest'     => $latest,
            'categories' => $categories,
            'marketingImages' => $marketingImages,
        ]);
    }

    public function about()
    {
        return Inertia::render('About', [
            'heroImages' => $this->randomPropertyImages(8),
        ]);
    }

    public function contact()
    {
        return Inertia::render('Contact', [
            'heroImages' => $this->randomPropertyImages(8),
        ]);
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

    public function ownerDashboard()
    {
        $user  = Auth::user();
        $propertiesQuery = $user?->isAdmin()
            ? Property::query()
            : $user->properties();

        $bookingsQuery = Booking::query();

        if (!$user?->isAdmin()) {
            $bookingsQuery->whereHas('property', fn($q) => $q->where('owner_id', $user->id));
        }

        $stats = [
            'total_properties' => (clone $propertiesQuery)->count(),
            'active_listings'  => (clone $propertiesQuery)->where('status', 'active')->count(),
            'total_bookings'   => (clone $bookingsQuery)->count(),
            'pending_bookings' => (clone $bookingsQuery)->where('status', 'pending')->count(),
        ];

        return Inertia::render('Dashboard/Owner/Index', ['stats' => $stats]);
    }
}
