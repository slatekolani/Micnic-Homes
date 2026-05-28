<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class ContactController extends Controller
{
    private const NOTIFICATION_EMAIL = 'info@micnichomes.co.tz';

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
            Mail::html($this->messageHtml($data), function ($message) use ($data, $recipients) {
                $message
                    ->to($recipients)
                    ->replyTo($data['email'], $data['name'])
                    ->subject('New Contact Inquiry - Micnic Homes');
            });

            Mail::html($this->senderConfirmationHtml($data), function ($message) use ($data) {
                $message
                    ->to($data['email'], $data['name'])
                    ->replyTo(self::NOTIFICATION_EMAIL, 'Micnic Homes')
                    ->subject('We received your message - Micnic Homes');
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
        $recipients = [self::NOTIFICATION_EMAIL];

        return array_values(array_unique(array_filter($recipients)));
    }

    private function messageHtml(array $data): string
    {
        return $this->emailShell(
            'New contact inquiry',
            'A visitor sent a message from the Micnic Homes website.',
            [
                'Name' => $data['name'],
                'Email' => $data['email'],
                'Phone' => $data['phone'] ?? 'Not provided',
                'Interest' => $data['interest'],
                'Submitted' => now()->toDayDateTimeString(),
            ],
            $data['message']
        );
    }

    private function senderConfirmationHtml(array $data): string
    {
        return $this->emailShell(
            'Message received',
            'Hi ' . e($data['name']) . ', thanks for contacting Micnic Homes. Our team has received your inquiry and will get back to you soon.',
            [
                'Interest' => $data['interest'],
                'Your email' => $data['email'],
                'Phone' => $data['phone'] ?? 'Not provided',
            ],
            'For urgent support, call or WhatsApp us on 0620188878.'
        );
    }

    private function emailShell(string $title, string $intro, array $rows, string $message): string
    {
        $rowHtml = collect($rows)->map(fn($value, $label) => sprintf(
            '<tr><td style="padding:10px 0;color:#64748b;font-size:13px;">%s</td><td style="padding:10px 0;color:#0f172a;font-size:14px;font-weight:700;text-align:right;">%s</td></tr>',
            e($label),
            e((string) $value)
        ))->implode('');

        return '<div style="margin:0;padding:0;background:#f5f7fb;font-family:Arial,sans-serif;color:#0f172a;">'
            . '<div style="max-width:640px;margin:0 auto;padding:28px 16px;">'
            . '<div style="background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 16px 48px rgba(15,23,42,.10);">'
            . '<div style="background:#0b1b33;padding:28px;color:#ffffff;">'
            . '<p style="margin:0 0 8px;color:#6fb3ef;font-size:12px;font-weight:800;letter-spacing:.18em;text-transform:uppercase;">Micnic Homes</p>'
            . '<h1 style="margin:0;font-size:26px;line-height:1.25;">' . e($title) . '</h1>'
            . '<p style="margin:12px 0 0;color:rgba(255,255,255,.72);font-size:15px;line-height:1.7;">' . $intro . '</p>'
            . '</div>'
            . '<div style="padding:26px 28px;">'
            . '<table style="width:100%;border-collapse:collapse;">' . $rowHtml . '</table>'
            . '<div style="margin-top:20px;padding:18px;border-radius:18px;background:#f8fafc;border:1px solid #e5edf6;">'
            . '<p style="margin:0;color:#0f172a;font-size:14px;line-height:1.8;">' . nl2br(e($message)) . '</p>'
            . '</div>'
            . '<p style="margin:24px 0 0;color:#64748b;font-size:13px;line-height:1.7;">Micnic Homes<br>info@micnichomes.co.tz | 0620188878</p>'
            . '</div></div></div></div>';
    }
}
