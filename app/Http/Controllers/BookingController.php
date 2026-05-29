<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Property;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class BookingController extends Controller
{
    private const NOTIFICATION_EMAIL = 'info@micnichomes.co.tz';

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

    public function guestBookings()
    {
        $bookings = Booking::with(['property.images'])
            ->where('guest_id', Auth::id())
            ->latest()
            ->paginate(20);

        return Inertia::render('Dashboard/Guest/Bookings', [
            'bookings' => $bookings,
        ]);
    }

    public function guestCancel(Booking $booking)
    {
        abort_unless((int) $booking->guest_id === (int) Auth::id(), 403);

        $booking->update([
            'status' => 'cancelled',
            'cancelled_at' => now(),
            'cancellation_reason' => request('reason'),
        ]);

        return back()->with('success', 'Booking cancelled.');
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
            Mail::html($this->bookingNotificationHtml($booking), function ($message) use ($booking, $recipients) {
                $message
                    ->to($recipients)
                    ->replyTo($booking->guest_email, $booking->guest_name)
                    ->subject("New Booking Request {$booking->reference} - {$booking->property->title}");
            });

            Mail::html($this->guestConfirmationHtml($booking), function ($message) use ($booking) {
                $message
                    ->to($booking->guest_email, $booking->guest_name)
                    ->replyTo(self::NOTIFICATION_EMAIL, 'Micnic Homes')
                    ->subject("Booking Request Received {$booking->reference} - Micnic Homes");
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
        $recipients = [self::NOTIFICATION_EMAIL];

        if ($booking->property?->owner?->email) {
            $recipients[] = $booking->property->owner->email;
        }

        return array_values(array_unique(array_filter($recipients)));
    }

    private function bookingNotificationHtml(Booking $booking): string
    {
        return $this->emailShell(
            'New booking request',
            'A guest submitted a booking request on the Micnic Homes website.',
            [
                'Reference' => $booking->reference,
                'Property' => $booking->property->title,
                'Guest' => $booking->guest_name,
                'Email' => $booking->guest_email,
                'Phone' => $booking->guest_phone,
                'Check-in' => $booking->check_in->toFormattedDateString(),
                'Check-out' => $booking->check_out->toFormattedDateString(),
                'Nights' => $booking->nights,
                'Guests' => $booking->guests,
                'Total' => $this->money($booking, $booking->total_price),
            ],
            [
                ['label' => 'View property', 'url' => url('/properties/' . $booking->property->slug)],
                ['label' => 'Open bookings', 'url' => url('/owner/bookings')],
            ],
            $booking->special_requests ?: 'No special requests provided.'
        );
    }

    private function guestConfirmationHtml(Booking $booking): string
    {
        return $this->emailShell(
            'Booking request received',
            'Hi ' . e($booking->guest_name) . ', thanks for choosing Micnic Homes. We received your request and our team will review it shortly.',
            [
                'Reference' => $booking->reference,
                'Property' => $booking->property->title,
                'Check-in' => $booking->check_in->toFormattedDateString(),
                'Check-out' => $booking->check_out->toFormattedDateString(),
                'Nights' => $booking->nights,
                'Guests' => $booking->guests,
                'Estimated total' => $this->money($booking, $booking->total_price),
            ],
            [
                ['label' => 'View property', 'url' => url('/properties/' . $booking->property->slug)],
            ],
            'Our team will contact you through email, phone, or WhatsApp to confirm availability and payment details. For urgent help, call or WhatsApp 0620188878.'
        );
    }

    private function money(Booking $booking, mixed $amount): string
    {
        return $booking->property->currency . ' ' . number_format((float) $amount, 2);
    }

    private function emailShell(string $title, string $intro, array $rows, array $buttons = [], string $note = ''): string
    {
        $rowHtml = collect($rows)->map(fn($value, $label) => sprintf(
            '<tr><td style="padding:10px 0;color:#64748b;font-size:13px;">%s</td><td style="padding:10px 0;color:#0f172a;font-size:14px;font-weight:700;text-align:right;">%s</td></tr>',
            e($label),
            e((string) $value)
        ))->implode('');

        $buttonHtml = collect($buttons)->map(fn($button) => sprintf(
            '<a href="%s" style="display:inline-block;margin:16px 10px 0 0;padding:12px 18px;border-radius:14px;background:#1060a8;color:#ffffff;text-decoration:none;font-size:13px;font-weight:800;">%s</a>',
            e($button['url']),
            e($button['label'])
        ))->implode('');

        return '<div style="margin:0;padding:0;background:#f5f7fb;font-family:Arial,sans-serif;color:#0f172a;">'
            . '<div style="max-width:680px;margin:0 auto;padding:28px 16px;">'
            . '<div style="background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 16px 48px rgba(15,23,42,.10);">'
            . '<div style="background:#0b1b33;padding:30px;color:#ffffff;">'
            . '<p style="margin:0 0 8px;color:#6fb3ef;font-size:12px;font-weight:800;letter-spacing:.18em;text-transform:uppercase;">Micnic Homes</p>'
            . '<h1 style="margin:0;font-size:27px;line-height:1.25;">' . e($title) . '</h1>'
            . '<p style="margin:12px 0 0;color:rgba(255,255,255,.72);font-size:15px;line-height:1.7;">' . $intro . '</p>'
            . '</div>'
            . '<div style="padding:26px 30px;">'
            . '<table style="width:100%;border-collapse:collapse;">' . $rowHtml . '</table>'
            . ($note ? '<div style="margin-top:20px;padding:18px;border-radius:18px;background:#f8fafc;border:1px solid #e5edf6;"><p style="margin:0;color:#0f172a;font-size:14px;line-height:1.8;">' . nl2br(e($note)) . '</p></div>' : '')
            . $buttonHtml
            . '<p style="margin:24px 0 0;color:#64748b;font-size:13px;line-height:1.7;">Micnic Homes<br>info@micnichomes.co.tz | 0620188878</p>'
            . '</div></div></div></div>';
    }
}
