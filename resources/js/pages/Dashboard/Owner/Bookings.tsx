import { Head, Link, router } from '@inertiajs/react';
import { Calendar, User, MapPin, Check, X, Clock, CheckCircle } from 'lucide-react';
import AppLayout from '../../../layouts/AppLayout';
import { Booking, PaginatedData } from '../../../types';

interface Props {
    bookings: PaginatedData<Booking>;
}

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
    pending:   { label: 'Pending',   color: 'bg-amber-100 text-amber-700',  icon: Clock },
    confirmed: { label: 'Confirmed', color: 'bg-green-100 text-green-700',  icon: CheckCircle },
    cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-600',      icon: X },
    completed: { label: 'Completed', color: 'bg-navy-100 text-navy-600',    icon: CheckCircle },
};

export default function OwnerBookings({ bookings }: Props) {
    const confirmBooking = (id: number) => router.post(`/owner/bookings/${id}/confirm`);
    const cancelBooking  = (id: number) => {
        if (window.confirm('Decline this booking request?')) router.post(`/owner/bookings/${id}/cancel`);
    };

    return (
        <AppLayout>
            <Head title="Manage Bookings" />

            <div className="bg-navy-950 pt-40 pb-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-2 text-white/50 text-sm mb-4">
                        <Link href="/owner" className="hover:text-gold-400">Dashboard</Link>
                        <span>/</span>
                        <span className="text-white/80">Bookings</span>
                    </div>
                    <h1 className="font-display text-2xl sm:text-3xl font-semibold text-white">Booking Requests</h1>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {bookings.data.length === 0 ? (
                    <div className="text-center py-24 bg-white rounded-2xl border border-gray-100">
                        <div className="text-6xl mb-4">📅</div>
                        <h3 className="font-display text-xl font-semibold text-navy-800 mb-2">No bookings yet</h3>
                        <p className="text-navy-400 text-sm">Bookings will appear here when guests reserve your properties</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {bookings.data.map((booking) => {
                            const cfg = statusConfig[booking.status];
                            const StatusIcon = cfg.icon;
                            const nights = Math.ceil((new Date(booking.check_out).getTime() - new Date(booking.check_in).getTime()) / (1000 * 60 * 60 * 24));

                            return (
                                <div key={booking.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                        <div className="flex-1">
                                            {/* Ref + Status */}
                                            <div className="flex items-center gap-3 mb-2 flex-wrap">
                                                <span className="font-mono text-xs font-bold text-navy-400 bg-navy-50 px-2 py-1 rounded-lg">{booking.reference}</span>
                                                <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${cfg.color}`}>
                                                    <StatusIcon className="w-3 h-3" /> {cfg.label}
                                                </span>
                                            </div>

                                            {/* Property */}
                                            {booking.property && (
                                                <div className="flex items-center gap-1.5 text-navy-600 font-semibold text-sm mb-2">
                                                    <MapPin className="w-3.5 h-3.5 text-gold-500 shrink-0" />
                                                    {booking.property.title}
                                                </div>
                                            )}

                                            {/* Guest — account user OR anonymous */}
                                            {(booking.guest || booking.guest_name) && (
                                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-navy-400 text-sm mb-3">
                                                    <div className="flex items-center gap-1.5">
                                                        <User className="w-3.5 h-3.5 shrink-0" />
                                                        <span className="font-medium text-navy-600">
                                                            {booking.guest?.name ?? booking.guest_name}
                                                        </span>
                                                    </div>
                                                    {(booking.guest?.email ?? booking.guest_email) && (
                                                        <span className="text-xs">· {booking.guest?.email ?? booking.guest_email}</span>
                                                    )}
                                                    {booking.guest_phone && (
                                                        <span className="text-xs">· {booking.guest_phone}</span>
                                                    )}
                                                </div>
                                            )}

                                            {/* Dates */}
                                            <div className="flex flex-wrap items-center gap-4 text-sm text-navy-500">
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar className="w-3.5 h-3.5 text-gold-500" />
                                                    <span>{new Date(booking.check_in).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                                    <span>→</span>
                                                    <span>{new Date(booking.check_out).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                                </div>
                                                <span>{nights} night{nights !== 1 ? 's' : ''} · {booking.guests} guest{booking.guests !== 1 ? 's' : ''}</span>
                                                <span className="font-semibold text-navy-800">
                                                    {booking.property?.currency ?? '$'} {booking.total_price.toLocaleString()}
                                                </span>
                                            </div>

                                            {booking.special_requests && (
                                                <p className="mt-2 text-xs text-navy-400 bg-navy-50 rounded-lg px-3 py-2">
                                                    <span className="font-medium">Requests: </span>{booking.special_requests}
                                                </p>
                                            )}
                                        </div>

                                        {/* Actions */}
                                        {booking.status === 'pending' && (
                                            <div className="flex gap-2 shrink-0">
                                                <button
                                                    onClick={() => confirmBooking(booking.id)}
                                                    className="flex items-center gap-1.5 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-semibold transition-all"
                                                >
                                                    <Check className="w-3.5 h-3.5" /> Confirm
                                                </button>
                                                <button
                                                    onClick={() => cancelBooking(booking.id)}
                                                    className="flex items-center gap-1.5 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-semibold transition-all"
                                                >
                                                    <X className="w-3.5 h-3.5" /> Decline
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Pagination */}
                {bookings.last_page > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-10">
                        {bookings.links.map((link, i) => (
                            <button
                                key={i}
                                disabled={!link.url}
                                onClick={() => link.url && router.get(link.url)}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                                    link.active ? 'bg-navy-900 text-white' : link.url ? 'bg-white border border-gray-200 text-navy-600 hover:border-navy-300' : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                                }`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
