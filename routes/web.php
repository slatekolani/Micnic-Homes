<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\PropertyController;
use App\Models\Property;
use Illuminate\Support\Facades\Route;

// Public routes
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/about', [HomeController::class, 'about'])->name('about');
Route::get('/contact', [HomeController::class, 'contact'])->name('contact');
Route::post('/contact', ContactController::class)->name('contact.send');
Route::get('/properties', [PropertyController::class, 'index'])->name('properties.index');
Route::get('/properties/{property:slug}', [PropertyController::class, 'show'])->name('properties.show');

Route::get('/sitemap.xml', function () {
    $baseUrl = 'https://micnichomes.co.tz';
    $staticPages = [
        ['loc' => '/', 'priority' => '1.0', 'changefreq' => 'daily'],
        ['loc' => '/properties', 'priority' => '0.9', 'changefreq' => 'daily'],
        ['loc' => '/about', 'priority' => '0.7', 'changefreq' => 'monthly'],
        ['loc' => '/contact', 'priority' => '0.7', 'changefreq' => 'monthly'],
    ];

    $urls = collect($staticPages)->map(fn($page) => [
        'loc' => $baseUrl . $page['loc'],
        'lastmod' => now()->toDateString(),
        'changefreq' => $page['changefreq'],
        'priority' => $page['priority'],
    ]);

    Property::active()
        ->select(['slug', 'updated_at'])
        ->latest('updated_at')
        ->get()
        ->each(function ($property) use ($urls, $baseUrl) {
            $urls->push([
                'loc' => "{$baseUrl}/properties/{$property->slug}",
                'lastmod' => $property->updated_at?->toDateString() ?? now()->toDateString(),
                'changefreq' => 'weekly',
                'priority' => '0.8',
            ]);
        });

    $xml = view('sitemap', ['urls' => $urls])->render();

    return response($xml, 200)->header('Content-Type', 'application/xml');
})->name('sitemap');

// Public booking (no login needed)
Route::post('/properties/{property:slug}/book', [BookingController::class, 'store'])->name('book');
Route::get('/booking/confirmation/{reference}', [BookingController::class, 'confirmation'])->name('booking.confirmation');

// Auth (admin only)
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login']);
    Route::get('/register', [AuthController::class, 'showRegister'])->name('register');
    Route::post('/register', [AuthController::class, 'register']);
});

Route::post('/logout', [AuthController::class, 'logout'])->name('logout')->middleware('auth');

Route::middleware('auth')->prefix('dashboard')->name('dashboard.')->group(function () {
    Route::get('/', [HomeController::class, 'guestDashboard'])->name('index');
    Route::get('/bookings', [BookingController::class, 'guestBookings'])->name('bookings');
    Route::post('/bookings/{booking}/cancel', [BookingController::class, 'guestCancel'])->name('bookings.cancel');
});

// Admin / Owner Dashboard
Route::middleware(['auth', 'owner.admin'])->prefix('owner')->name('owner.')->group(function () {
    Route::get('/', [HomeController::class, 'ownerDashboard'])->name('index');
    Route::get('/properties', [PropertyController::class, 'ownerIndex'])->name('properties');
    Route::get('/properties/create', [PropertyController::class, 'create'])->name('properties.create');
    Route::post('/properties', [PropertyController::class, 'store'])->name('properties.store');
    Route::get('/properties/{property}/edit', [PropertyController::class, 'edit'])->name('properties.edit');
    Route::put('/properties/{property}', [PropertyController::class, 'update'])->name('properties.update');
    Route::delete('/properties/{property}', [PropertyController::class, 'destroy'])->name('properties.destroy');
    Route::delete('/properties/{property}/images/{image}', [PropertyController::class, 'destroyImage'])->name('properties.images.destroy');
    Route::post('/properties/{property}/images/{image}/primary', [PropertyController::class, 'setPrimaryImage'])->name('properties.images.primary');
    Route::get('/bookings', [BookingController::class, 'ownerBookings'])->name('bookings');
    Route::post('/bookings/{booking}/confirm', [BookingController::class, 'confirm'])->name('bookings.confirm');
    Route::post('/bookings/{booking}/cancel', [BookingController::class, 'cancel'])->name('bookings.cancel');
});
