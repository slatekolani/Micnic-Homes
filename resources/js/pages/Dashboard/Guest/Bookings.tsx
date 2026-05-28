import { Head, Link, router } from '@inertiajs/react';
import { Calendar, MapPin, Clock, CheckCircle, X, Star } from 'lucide-react';
import AppLayout from '../../../layouts/AppLayout';
import { Booking, PaginatedData } from '../../../types';

interface Props {
    bookings: PaginatedData<Booking>;
}

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
    pending:   { label: 'Pending Confirmation', color: 'bg-amber-100 text-amber-700',  icon: Clock },
    confirmed: { label: 'Confirmed',            color: 'bg-green-100 text-green-700',  icon: CheckCircle },
    cancelled: { label: 'Cancelled',            color: 'bg-red-100 text-red-600',      icon: X },
    completed: { label: 'Completed',            color: 'bg-navy-100 text-navy-600',    icon: CheckCircle },
};

export default function GuestBookings({ bookings }: Props) {
    const cancelBooking = (id: number) => {
        if (confirm('Are you sure you want to cancel this booking?')) {
            router.post(`/dashboard/bookings/${id}/cancel`);
        }
    };

    return (
        <AppLayout>
            <Head title="My Bookings" />

            <div className="bg-navy-950 pt-40 pb-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-2 text-white/50 text-sm mb-4">
                        <Link href="/dashboard" className="hover:text-gold-400">Dashboard</Link>
                        <span>/</span>
                        <span className="text-white/80">My Bookings</span>
                    </div>
                    <h1 className="font-display text-2xl sm:text-3xl font-semibold text-white">My Bookings</h1>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {bookings.data.length === 0 ? (
                    <div className="text-center py-24 bg-white rounded-2xl border border-gray-100">
                        <div className="text-6xl mb-4">🌴</div>
                        <h3 className="font-display text-xl font-semibold text-navy-800 mb-2">No bookings yet</h3>
                        <p className="text-navy-400 text-sm mb-6">Discover our luxury properties and plan your perfect getaway</p>
                        <Link href="/properties" className="inline-flex items-center gap-2 px-6 py-3 bg-gold-500 text-white rounded-xl text-sm font-semibold hover:bg-gold-600 transition-all">
                            Explore Properties
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {bookings.data.map((booking) => {
                            const cfg = statusConfig[booking.status];
                            const StatusIcon = cfg.icon;
                            const nights = Math.ceil((new Date(booking.check_out).getTime() - new Date(booking.check_in).getTime()) / (1000 * 60 * 60 * 24));
                            const primaryImage = booking.property?.images?.[0];
                            const isUpcoming = new Date(booking.check_in) > new Date();

                            return (
                                <div key={booking.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                                    <div className="flex flex-col sm:flex-row">
                                        {/* Property Image */}
                                        <div className="w-full sm:w-40 h-40 shrink-0 bg-navy-100">
                                            {primaryImage ? (
                                                <img src={primaryImage.url} alt={booking.property?.title} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-4xl">🏠</div>
                                            )}
                                        </div>

                                        {/* Details */}
                                        <div className="flex-1 p-5">
                                            <div className="flex items-start justify-between gap-3 flex-wrap">
                                                <div>
                                                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                                                        <span className="font-mono text-xs font-bold text-navy-400 bg-navy-50 px-2 py-1 rounded-lg">{booking.reference}</span>
                                                        <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${cfg.color}`}>
                                                            <StatusIcon className="w-3 h-3" /> {cfg.label}
                                                        </span>
                                                    </div>
                                                    {booking.property && (
                                                        <Link href={`/properties/${booking.property.slug}`}
                                                            className="font-semibold text-navy-800 hover:text-gold-600 transition-colors text-base">
                                                            {booking.property.title}
                                                        </Link>
                                                    )}
                                                    {booking.property && (
                                                        <div className="flex items-center gap-1 text-navy-400 text-xs mt-1">
                                                            <MapPin className="w-3 h-3" />
                                                            {booking.property.city}, {booking.property.country}
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="text-right shrink-0">
                                                    <p className="font-bold text-navy-900 text-lg">${booking.total_price.toLocaleString()}</p>
                                                    <p className="text-xs text-navy-400">{nights} night{nights !== 1 ? 's' : ''}</p>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-navy-500">
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar className="w-3.5 h-3.5 text-gold-500" />
                                                    <span>
                                                        {new Date(booking.check_in).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} — {new Date(booking.check_out).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                    </span>
                                                </div>
                                                <span>{booking.guests} guest{booking.guests !== 1 ? 's' : ''}</span>
                                            </div>

                                            {/* Action */}
                                            <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-100">
                                                {booking.status === 'pending' && isUpcoming && (
                                                    <button
                                                        onClick={() => cancelBooking(booking.id)}
                                                        className="flex items-center gap-1.5 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-medium transition-colors"
                                                    >
                                                        <X className="w-3.5 h-3.5" /> Cancel Booking
                                                    </button>
                                                )}
                                                {booking.status === 'completed' && (
                                                    <button className="flex items-center gap-1.5 px-4 py-2 bg-gold-50 hover:bg-gold-100 text-gold-700 rounded-xl text-xs font-medium transition-colors">
                                                        <Star className="w-3.5 h-3.5" /> Write Review
                                                    </button>
                                                )}
                                                {booking.property && (
                                                    <Link
                                                        href={`/properties/${booking.property.slug}`}
                                                        className="flex items-center gap-1.5 px-4 py-2 bg-navy-50 hover:bg-navy-100 text-navy-600 rounded-xl text-xs font-medium transition-colors"
                                                    >
                                                        View Property
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

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
