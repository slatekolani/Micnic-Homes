import { Link } from '@inertiajs/react';
import { CheckCircle, Calendar, MapPin, Users, Clock, ArrowRight } from 'lucide-react';
import AppLayout from '../../layouts/AppLayout';
import SeoHead from '../../components/SeoHead';
import { Booking } from '../../types';

interface Props {
    booking: Booking;
}

export default function Confirmation({ booking }: Props) {
    const currency = booking.property?.currency || '';
    const checkIn = new Date(booking.check_in);
    const checkOut = new Date(booking.check_out);
    const nights = Math.max(0, Math.round((checkOut.getTime() - checkIn.getTime()) / 86400000));
    const subtotal = Number(booking.price_per_night) * nights;
    const cleaningFee = Number(booking.cleaning_fee) || 0;
    const securityDeposit = Number(booking.security_deposit) || 0;

    return (
        <AppLayout>
            <SeoHead title="Booking Request Sent" description="Your Micnic Homes booking request has been submitted." noindex />

            <div className="min-h-screen bg-navy-50 flex items-center justify-center px-4 py-20">
                <div className="max-w-lg w-full">
                    {/* Success card */}
                    <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                        {/* Header */}
                        <div className="bg-gradient-to-br from-navy-900 to-navy-800 px-8 py-10 text-center">
                            <div className="w-16 h-16 bg-gold-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="w-8 h-8 text-gold-400" />
                            </div>
                            <h1 className="font-display text-2xl font-semibold text-white mb-2">
                                Booking Request Sent!
                            </h1>
                            <p className="text-white/60 text-sm">
                                Our team will review your request and confirm within 24 hours.
                            </p>
                        </div>

                        {/* Body */}
                        <div className="px-8 py-7 space-y-5">
                            {/* Reference */}
                            <div className="flex items-center justify-between py-3 border-b border-gray-100">
                                <span className="text-sm text-navy-500">Reference</span>
                                <span className="font-mono font-semibold text-gold-600 text-sm">{booking.reference}</span>
                            </div>

                            {/* Property */}
                            {booking.property && (
                                <div className="flex items-start gap-3">
                                    <MapPin className="w-4 h-4 text-gold-500 mt-0.5 shrink-0" />
                                    <div>
                                        <p className="font-semibold text-navy-800 text-sm">{booking.property.title}</p>
                                        <p className="text-navy-400 text-xs">{booking.property.city}, {booking.property.country}</p>
                                    </div>
                                </div>
                            )}

                            {/* Dates */}
                            <div className="flex items-start gap-3">
                                <Calendar className="w-4 h-4 text-gold-500 mt-0.5 shrink-0" />
                                <div>
                                    <p className="font-semibold text-navy-800 text-sm">
                                        {new Date(booking.check_in).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                                        {' → '}
                                        {new Date(booking.check_out).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </p>
                                </div>
                            </div>

                            {/* Guests */}
                            <div className="flex items-center gap-3">
                                <Users className="w-4 h-4 text-gold-500 shrink-0" />
                                <p className="text-navy-800 text-sm">{booking.guests} guest{booking.guests !== 1 ? 's' : ''}</p>
                            </div>

                            {/* Total */}
                            <div className="space-y-2 rounded-xl bg-navy-50 px-4 py-3 text-sm">
                                <div className="flex items-center justify-between text-navy-600">
                                    <span>{currency} {Number(booking.price_per_night).toLocaleString()} × {nights} night{nights !== 1 ? 's' : ''}</span>
                                    <span>{currency} {subtotal.toLocaleString()}</span>
                                </div>
                                {cleaningFee > 0 && (
                                    <div className="flex items-center justify-between text-navy-600">
                                        <span>Cleaning fee</span>
                                        <span>{currency} {cleaningFee.toLocaleString()}</span>
                                    </div>
                                )}
                                {securityDeposit > 0 && (
                                    <div className="flex items-center justify-between text-navy-600">
                                        <span>Security deposit</span>
                                        <span>{currency} {securityDeposit.toLocaleString()}</span>
                                    </div>
                                )}
                                <div className="flex items-center justify-between border-t border-gray-200 pt-2 font-semibold text-navy-900">
                                    <span>Estimated Total</span>
                                    <span>{currency} {Number(booking.total_price).toLocaleString()}</span>
                                </div>
                            </div>

                            {/* Next steps */}
                            <div className="bg-gold-50 border border-gold-100 rounded-xl p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Clock className="w-4 h-4 text-gold-600" />
                                    <span className="text-gold-700 font-semibold text-sm">What happens next?</span>
                                </div>
                                <ul className="text-sm text-gold-700/80 space-y-1 list-disc list-inside">
                                    <li>Our team reviews your request</li>
                                    <li>You'll receive a confirmation call/email within 24 hours</li>
                                    <li>Payment details will be shared upon confirmation</li>
                                </ul>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-8 pb-8 flex flex-col sm:flex-row gap-3">
                            <Link
                                href="/properties"
                                className="flex-1 text-center py-3 bg-navy-900 hover:bg-navy-800 text-white font-semibold rounded-xl text-sm transition-all"
                            >
                                Browse More
                            </Link>
                            <Link
                                href="/"
                                className="flex-1 text-center py-3 border border-gray-200 hover:border-gray-300 text-navy-700 font-semibold rounded-xl text-sm transition-all flex items-center justify-center gap-2"
                            >
                                Home <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
