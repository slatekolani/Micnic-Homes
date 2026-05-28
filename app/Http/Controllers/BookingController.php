<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Property;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class BookingController extends Controller
{
    // Public — no login required
    public function store(Request $request, Property $property)
    {
        $data = $request->validate([
            'guest_name'      => 'required|string|max:255',
            'guest_email'     => 'required|email|max:255',
            'guest_phone'     => 'required|string|max:30',
            'check_in'        => 'required|date|after_or_equal:today',
            'check_out'       => 'required|date|after:check_in',
            'guests'          => "required|integer|min:1|max:{$property->max_guests}",
            'special_requests'=> 'nullable|string|max:1000',
        ]);

        $checkIn  = \Carbon\Carbon::parse($data['check_in']);
        $checkOut = \Carbon\Carbon::parse($data['check_out']);
        $nights   = $checkIn->diffInDays($checkOut);

        $subtotal = $property->price_per_night * $nights;
        $cleaningFee = $property->cleaning_fee ?? 0;
        $securityDeposit = $property->security_deposit ?? 0;
        $total = $subtotal + $cleaningFee + $securityDeposit;

        $booking = Booking::create([
            'property_id'      => $property->id,
            'guest_id'         => Auth::id(),
            'guest_name'       => $data['guest_name'],
            'guest_email'      => $data['guest_email'],
            'guest_phone'      => $data['guest_phone'],
            'check_in'         => $data['check_in'],
            'check_out'        => $data['check_out'],
            'guests'           => $data['guests'],
            'price_per_night'  => $property->price_per_night,
            'cleaning_fee'     => $cleaningFee,
            'security_deposit' => $securityDeposit,
            'total_price'      => $total,
            'special_requests' => $data['special_requests'] ?? null,
            'status'           => 'pending',
        ]);

        $booking->load('property.owner');
        $this->sendBookingNotification($booking);

        return redirect()->route('booking.confirmation', $booking->reference);
    }

    public function confirmation(string $reference)
    {
        $booking = Booking::where('reference', $reference)
            ->with('property')
            ->firstOrFail();

        return Inertia::render('Booking/Confirmation', ['booking' => $booking]);
    }

    public function ownerBookings()
    {
        $query = Booking::with(['property'])->latest();

        if (!Auth::user()?->isAdmin()) {
            $query->whereHas('property', fn($q) => $q->where('owner_id', Auth::id()));
        }

        $bookings = $query->paginate(20);

        return Inertia::render('Dashboard/Owner/Bookings', [
            'bookings' => $bookings,
        ]);
    }

    public function confirm(Booking $booking)
    {
        $this->authorizeOwner($booking);
        $booking->update(['status' => 'confirmed', 'confirmed_at' => now()]);
        return back()->with('success', 'Booking confirmed.');
    }

    public function cancel(Booking $booking)
    {
        $this->authorizeOwner($booking);
        $booking->update([
            'status'              => 'cancelled',
            'cancelled_at'        => now(),
            'cancellation_reason' => request('reason'),
        ]);
        return back()->with('success', 'Booking cancelled.');
    }

    private function authorizeOwner(Booking $booking): void
    {
        if (!Auth::user()?->isAdmin() && $booking->property->owner_id !== Auth::id()) {
            abort(403);
        }
    }

    private function sendBookingNotification(Booking $booking): void
    {
        $recipients = $this->bookingNotificationRecipients($booking);

        if (empty($recipients)) {
            Log::warning('Booking created without notification recipients.', ['booking_id' => $booking->id]);
            return;
        }

        try {
            Mail::raw($this->bookingNotificationBody($booking), function ($message) use ($booking, $recipients) {
                $message
                    ->to($recipients)
                    ->replyTo($booking->guest_email, $booking->guest_name)
                    ->subject("New Booking Request {$booking->reference} - {$booking->property->title}");
            });
        } catch (\Throwable $exception) {
            Log::error('Booking notification email failed.', [
                'booking_id' => $booking->id,
                'error' => $exception->getMessage(),
            ]);
        }
    }

    private function bookingNotificationRecipients(Booking $booking): array
    {
        $recipients = User::where('role', 'admin')->pluck('email')->all();

        if ($booking->property?->owner?->email) {
            $recipients[] = $booking->property->owner->email;
        }

        if (empty($recipients) && config('mail.from.address')) {
            $recipients[] = config('mail.from.address');
        }

        return array_values(array_unique(array_filter($recipients)));
    }

    private function bookingNotificationBody(Booking $booking): string
    {
        return implode("\n", [
            'New booking request from Micnic Villa website',
            '',
            'Reference: ' . $booking->reference,
            'Property: ' . $booking->property->title,
            'Property URL: ' . url('/properties/' . $booking->property->slug),
            '',
            'Guest details',
            'Name: ' . $booking->guest_name,
            'Email: ' . $booking->guest_email,
            'Phone: ' . $booking->guest_phone,
            '',
            'Stay details',
            'Check-in: ' . $booking->check_in->toFormattedDateString(),
            'Check-out: ' . $booking->check_out->toFormattedDateString(),
            'Nights: ' . $booking->nights,
            'Guests: ' . $booking->guests,
            'Status: ' . ucfirst($booking->status),
            '',
            'Pricing',
            'Price per night: ' . $booking->property->currency . ' ' . number_format((float) $booking->price_per_night, 2),
            'Cleaning fee: ' . $booking->property->currency . ' ' . number_format((float) $booking->cleaning_fee, 2),
            'Security deposit: ' . $booking->property->currency . ' ' . number_format((float) $booking->security_deposit, 2),
            'Total: ' . $booking->property->currency . ' ' . number_format((float) $booking->total_price, 2),
            '',
            'Special requests:',
            $booking->special_requests ?: 'None',
            '',
            'Admin dashboard: ' . url('/owner/bookings'),
            'Submitted: ' . now()->toDayDateTimeString(),
        ]);
    }
}
