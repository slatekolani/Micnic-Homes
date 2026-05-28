<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class ContactController extends Controller
{
    public function __invoke(Request $request)
    {
        $data = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|max:255',
            'phone'    => 'nullable|string|max:30',
            'interest' => 'required|string|max:100',
            'message'  => 'required|string|max:2000',
        ]);

        $recipients = $this->notificationRecipients();

        if (empty($recipients)) {
            Log::warning('Contact inquiry submitted without notification recipients.', [
                'email' => $data['email'],
            ]);

            return back()
                ->withInput()
                ->with('error', 'Your message could not be sent because no receiving email is configured.');
        }

        try {
            Mail::raw($this->messageBody($data), function ($message) use ($data, $recipients) {
                $message
                    ->to($recipients)
                    ->replyTo($data['email'], $data['name'])
                    ->subject('New Contact Inquiry - Micnic Villa');
            });
        } catch (\Throwable $exception) {
            Log::error('Contact inquiry email failed.', [
                'email' => $data['email'],
                'error' => $exception->getMessage(),
            ]);

            return back()
                ->withInput()
                ->with('error', 'Your message could not be sent right now. Please call or email us directly.');
        }

        return back()->with('success', 'Your inquiry has been sent. Our team will get back to you soon.');
    }

    private function notificationRecipients(): array
    {
        $recipients = User::where('role', 'admin')->pluck('email')->all();

        if (empty($recipients) && config('mail.from.address')) {
            $recipients[] = config('mail.from.address');
        }

        return array_values(array_unique(array_filter($recipients)));
    }

    private function messageBody(array $data): string
    {
        return implode("\n", [
            'New contact inquiry from Micnic Villa website',
            '',
            'Name: ' . $data['name'],
            'Email: ' . $data['email'],
            'Phone: ' . ($data['phone'] ?? 'Not provided'),
            'Interest: ' . $data['interest'],
            '',
            'Message:',
            $data['message'],
            '',
            'Submitted: ' . now()->toDayDateTimeString(),
        ]);
    }
}
