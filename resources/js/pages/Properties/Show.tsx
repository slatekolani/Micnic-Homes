import { Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import {
    Star, MapPin, BedDouble, Bath, Users, Wifi, Car, UtensilsCrossed,
    Waves, Dumbbell, Tv, Wind, TreePine, Shield, Clock, Calendar,
    CheckCircle, ChevronLeft, ChevronRight, X, Phone, Mail, User,
} from 'lucide-react';
import AppLayout from '../../layouts/AppLayout';
import SeoHead, { SITE_URL } from '../../components/SeoHead';
import { Property } from '../../types';

interface Props {
    property: Property;
}

const amenityIcons: Record<string, React.ElementType> = {
    wifi: Wifi, pool: Waves, parking: Car, kitchen: UtensilsCrossed,
    gym: Dumbbell, tv: Tv, ac: Wind, garden: TreePine,
};

const amenityLabels: Record<string, string> = {
    wifi: 'High-Speed WiFi', pool: 'Private Pool', parking: 'Free Parking',
    kitchen: 'Full Kitchen', gym: 'Fitness Center', tv: 'Smart TV',
    ac: 'Air Conditioning', garden: 'Private Garden',
    beachfront: 'Beach Access', bbq: 'BBQ Area', fireplace: 'Fireplace',
    washer: 'Washer/Dryer', dishwasher: 'Dishwasher', balcony: 'Balcony/Terrace',
};

const cancellationInfo: Record<string, { label: string; color: string; desc: string }> = {
    flexible: { label: 'Flexible', color: 'text-green-600', desc: 'Full refund if cancelled 24 hours before check-in.' },
    moderate: { label: 'Moderate', color: 'text-amber-600', desc: 'Full refund if cancelled 5 days before check-in.' },
    strict:   { label: 'Strict',   color: 'text-red-600',   desc: '50% refund if cancelled at least 7 days before check-in.' },
};

export default function PropertyShow({ property }: Props) {
    const [galleryIndex, setGalleryIndex] = useState(0);
    const [galleryOpen, setGalleryOpen]   = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        guest_name:       '',
        guest_email:      '',
        guest_phone:      '',
        check_in:         '',
        check_out:        '',
        guests:           1,
        special_requests: '',
    });

    const nights = data.check_in && data.check_out
        ? Math.max(0, Math.round((new Date(data.check_out).getTime() - new Date(data.check_in).getTime()) / 86400000))
        : 0;

    const pricePerNight = Number(property.price_per_night) || 0;
    const cleaningFee = Number(property.cleaning_fee) || 0;
    const securityDeposit = Number(property.security_deposit) || 0;
    const subtotal = nights * pricePerNight;
    const total = subtotal + cleaningFee + securityDeposit;

    const submitBooking = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/properties/${property.slug}/book`);
    };

    const bookingInputClass = (field: keyof typeof data) =>
        `w-full px-3 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-1 ${
            errors[field]
                ? 'border-red-400 bg-red-50/60 focus:border-red-500 focus:ring-red-200'
                : 'border-gray-200 focus:border-gold-400 focus:ring-gold-400'
        }`;

    const images = property.images ?? [];
    const primaryImage = images[0]?.url ?? null;
    const propertyDescription = property.short_description || property.description.replace(/\s+/g, ' ').slice(0, 155);
    const propertyUrl = `${SITE_URL}/properties/${property.slug}`;

    // Normalize amenities — guard against double-encoded JSON strings
    const amenities: string[] = Array.isArray(property.amenities)
        ? property.amenities
        : typeof property.amenities === 'string'
            ? (() => { try { const p = JSON.parse(property.amenities as unknown as string); return Array.isArray(p) ? p : []; } catch { return []; } })()
            : [];

    const policy = cancellationInfo[property.cancellation_policy] ?? cancellationInfo.flexible;

    return (
        <AppLayout>
            <SeoHead
                title={`${property.title} in ${property.city}`}
                description={`${propertyDescription} Book this ${property.type} in ${property.city}, ${property.country} with Micnic Homes.`}
                canonicalPath={`/properties/${property.slug}`}
                image={primaryImage}
                keywords={[
                    `${property.title}`,
                    `${property.type} in ${property.city}`,
                    `${property.city} ${property.type} rental`,
                    `book ${property.type} ${property.country}`,
                    `short stay ${property.city}`,
                    `serviced stay ${property.city}`,
                    `Micnic Homes ${property.city}`,
                ]}
                structuredData={{
                    '@context': 'https://schema.org',
                    '@type': 'Accommodation',
                    name: property.title,
                    description: propertyDescription,
                    url: propertyUrl,
                    image: images.map((image) => image.url.startsWith('http') ? image.url : `${SITE_URL}${image.url}`),
                    address: {
                        '@type': 'PostalAddress',
                        streetAddress: property.address,
                        addressLocality: property.city,
                        addressRegion: property.state || property.city,
                        addressCountry: property.country,
                    },
                    numberOfRooms: property.bedrooms,
                    occupancy: {
                        '@type': 'QuantitativeValue',
                        maxValue: property.max_guests,
                    },
                    amenityFeature: amenities.map((amenity) => ({
                        '@type': 'LocationFeatureSpecification',
                        name: amenityLabels[amenity] || amenity,
                        value: true,
                    })),
                    offers: {
                        '@type': 'Offer',
                        price: property.price_per_night,
                        priceCurrency: property.currency,
                        availability: 'https://schema.org/InStock',
                        url: propertyUrl,
                    },
                    aggregateRating: property.avg_rating > 0 ? {
                        '@type': 'AggregateRating',
                        ratingValue: property.avg_rating,
                        reviewCount: property.review_count,
                    } : undefined,
                }}
            />

            {/* ─── Gallery ─── */}
            <section className="pt-40">
                {images.length > 0 ? (
                    <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[60vh] px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                        {/* Main large image */}
                        <div
                            className="col-span-4 sm:col-span-2 row-span-2 rounded-2xl overflow-hidden cursor-pointer relative group"
                            onClick={() => { setGalleryIndex(0); setGalleryOpen(true); }}
                        >
                            <img src={images[0].url} alt={property.title} loading="eager" referrerPolicy="no-referrer" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                        </div>
                        {/* Side thumbnails */}
                        {images.slice(1, 5).map((img, i) => (
                            <div
                                key={img.id}
                                className="rounded-xl overflow-hidden cursor-pointer relative group"
                                onClick={() => { setGalleryIndex(i + 1); setGalleryOpen(true); }}
                            >
                                <img src={img.url} alt="" loading="eager" referrerPolicy="no-referrer" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                {i === 3 && images.length > 5 && (
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white font-semibold text-sm">
                                        +{images.length - 5} photos
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="h-[50vh] bg-gradient-to-br from-navy-800 to-navy-900 flex items-center justify-center text-white/30 text-6xl">🏡</div>
                )}
            </section>

            {/* ─── Lightbox ─── */}
            {galleryOpen && (
                <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center" onClick={() => setGalleryOpen(false)}>
                    <button className="absolute top-4 right-4 text-white/60 hover:text-white" onClick={() => setGalleryOpen(false)}>
                        <X className="w-8 h-8" />
                    </button>
                    <button className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white" onClick={(e) => { e.stopPropagation(); setGalleryIndex((galleryIndex - 1 + images.length) % images.length); }}>
                        <ChevronLeft className="w-10 h-10" />
                    </button>
                    <img src={images[galleryIndex]?.url} alt="" className="max-h-[85vh] max-w-[90vw] object-contain rounded-xl" onClick={(e) => e.stopPropagation()} />
                    <button className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white" onClick={(e) => { e.stopPropagation(); setGalleryIndex((galleryIndex + 1) % images.length); }}>
                        <ChevronRight className="w-10 h-10" />
                    </button>
                    <div className="absolute bottom-4 text-white/50 text-sm">{galleryIndex + 1} / {images.length}</div>
                </div>
            )}

            {/* ─── Main Content ─── */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid lg:grid-cols-3 gap-10">

                    {/* ── Left / Detail ── */}
                    <div className="lg:col-span-2 space-y-10">
                        {/* Header */}
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <span className="px-3 py-1 bg-gold-100 text-gold-700 text-xs font-semibold rounded-full capitalize">{property.type}</span>
                                {property.featured && (
                                    <span className="px-3 py-1 bg-navy-100 text-navy-700 text-xs font-semibold rounded-full">Featured</span>
                                )}
                            </div>
                            <h1 className="font-display text-3xl sm:text-4xl font-semibold text-navy-900 mb-3">{property.title}</h1>
                            <div className="flex items-center gap-4 flex-wrap text-sm text-navy-500">
                                <div className="flex items-center gap-1.5">
                                    <MapPin className="w-4 h-4 text-gold-500" />
                                    {property.city}, {property.country}
                                </div>
                                {property.avg_rating > 0 && (
                                    <div className="flex items-center gap-1">
                                        <Star className="w-4 h-4 text-gold-400 fill-gold-400" />
                                        <span className="font-medium text-navy-700">{property.avg_rating.toFixed(1)}</span>
                                        <span className="text-navy-400">({property.review_count} reviews)</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Key specs */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {[
                                { icon: BedDouble, label: 'Bedrooms',  value: property.bedrooms },
                                { icon: Bath,      label: 'Bathrooms', value: property.bathrooms },
                                { icon: Users,     label: 'Max Guests', value: property.max_guests },
                                { icon: Clock,     label: 'Min Stay',  value: `${property.min_stay_nights} night${property.min_stay_nights !== 1 ? 's' : ''}` },
                            ].map(({ icon: Icon, label, value }) => (
                                <div key={label} className="bg-navy-50 rounded-2xl p-4 text-center">
                                    <Icon className="w-5 h-5 text-gold-500 mx-auto mb-2" />
                                    <p className="text-navy-800 font-semibold text-sm">{value}</p>
                                    <p className="text-navy-400 text-xs mt-0.5">{label}</p>
                                </div>
                            ))}
                        </div>

                        {/* Description */}
                        <div>
                            <h2 className="font-display text-xl font-semibold text-navy-900 mb-4">About this property</h2>
                            <p className="text-navy-600 leading-relaxed whitespace-pre-line">{property.description}</p>
                        </div>

                        {/* Amenities */}
                        {amenities.length > 0 && (
                            <div>
                                <h2 className="font-display text-xl font-semibold text-navy-900 mb-5">Amenities</h2>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {amenities.map((key) => {
                                        const Icon = amenityIcons[key];
                                        return (
                                            <div key={key} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-white">
                                                {Icon ? <Icon className="w-4 h-4 text-gold-500 shrink-0" /> : <CheckCircle className="w-4 h-4 text-gold-500 shrink-0" />}
                                                <span className="text-sm text-navy-700">{amenityLabels[key] ?? key}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Check-in/out */}
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="bg-navy-50 rounded-2xl p-5">
                                <div className="flex items-center gap-3 mb-1">
                                    <Calendar className="w-5 h-5 text-gold-500" />
                                    <span className="font-semibold text-navy-800 text-sm">Check-in</span>
                                </div>
                                <p className="text-navy-600 text-sm">{property.check_in_time}</p>
                            </div>
                            <div className="bg-navy-50 rounded-2xl p-5">
                                <div className="flex items-center gap-3 mb-1">
                                    <Calendar className="w-5 h-5 text-gold-500" />
                                    <span className="font-semibold text-navy-800 text-sm">Check-out</span>
                                </div>
                                <p className="text-navy-600 text-sm">{property.check_out_time}</p>
                            </div>
                        </div>

                        {/* Cancellation */}
                        <div className="bg-white border border-gray-100 rounded-2xl p-6">
                            <div className="flex items-center gap-3 mb-2">
                                <Shield className="w-5 h-5 text-gold-500" />
                                <h3 className="font-semibold text-navy-800">Cancellation Policy</h3>
                            </div>
                            <p className={`text-sm font-semibold mb-1 ${policy.color}`}>{policy.label}</p>
                            <p className="text-navy-500 text-sm">{policy.desc}</p>
                        </div>

                        {/* Google Maps embed */}
                        {property.map_embed_url && (
                            <div>
                                <h2 className="font-display text-xl font-semibold text-navy-900 mb-4 flex items-center gap-2">
                                    <MapPin className="w-5 h-5 text-gold-500" /> Location
                                </h2>
                                <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm h-72">
                                    <iframe
                                        src={property.map_embed_url}
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0 }}
                                        allowFullScreen
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                        title="Property location"
                                    />
                                </div>
                                <p className="text-xs text-navy-400 mt-2">{property.address}, {property.city}, {property.country}</p>
                            </div>
                        )}
                    </div>

                    {/* ── Right / Booking ── */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24">
                            <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
                                {/* Price header */}
                                <div className="bg-gradient-to-br from-navy-900 to-navy-800 p-6 text-white">
                                    <div className="flex items-baseline gap-1 mb-1">
                                        <span className="font-display text-3xl font-bold text-gold-300">
                                            {property.currency} {property.price_per_night.toLocaleString()}
                                        </span>
                                        <span className="text-white/60 text-sm">/ night</span>
                                    </div>
                                    {property.avg_rating > 0 && (
                                        <div className="flex items-center gap-1 text-sm text-white/70">
                                            <Star className="w-3.5 h-3.5 text-gold-400 fill-gold-400" />
                                            {property.avg_rating.toFixed(1)} · {property.review_count} reviews
                                        </div>
                                    )}
                                </div>

                                {/* Booking form */}
                                <form onSubmit={submitBooking} className="p-6 space-y-4">
                                    <p className="text-xs text-navy-500 font-medium uppercase tracking-wide">Your Details</p>

                                    {/* Guest name */}
                                    <div>
                                        <label className="block text-xs font-medium text-navy-600 mb-1.5">Full Name</label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-300" />
                                            <input
                                                type="text"
                                                value={data.guest_name}
                                                onChange={(e) => setData('guest_name', e.target.value)}
                                                placeholder="Aida Aldan"
                                                className={`${bookingInputClass('guest_name')} pl-9`}
                                                required
                                            />
                                        </div>
                                        {errors.guest_name && <p className="text-red-500 text-xs mt-1">{errors.guest_name}</p>}
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label className="block text-xs font-medium text-navy-600 mb-1.5">Email Address</label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-300" />
                                            <input
                                                type="email"
                                                value={data.guest_email}
                                                onChange={(e) => setData('guest_email', e.target.value)}
                                                placeholder="you@example.com"
                                                className={`${bookingInputClass('guest_email')} pl-9`}
                                                required
                                            />
                                        </div>
                                        {errors.guest_email && <p className="text-red-500 text-xs mt-1">{errors.guest_email}</p>}
                                    </div>

                                    {/* Phone */}
                                    <div>
                                        <label className="block text-xs font-medium text-navy-600 mb-1.5">Phone Number</label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-300" />
                                            <input
                                                type="tel"
                                                value={data.guest_phone}
                                                onChange={(e) => setData('guest_phone', e.target.value)}
                                                placeholder="0787 070 909"
                                                className={`${bookingInputClass('guest_phone')} pl-9`}
                                                required
                                            />
                                        </div>
                                        {errors.guest_phone && <p className="text-red-500 text-xs mt-1">{errors.guest_phone}</p>}
                                    </div>

                                    <div className="border-t border-gray-100 pt-4">
                                        <p className="text-xs text-navy-500 font-medium uppercase tracking-wide mb-3">Dates & Guests</p>
                                    </div>

                                    {/* Dates */}
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="block text-xs font-medium text-navy-600 mb-1.5">Check In</label>
                                            <input
                                                type="date"
                                                value={data.check_in}
                                                min={new Date().toISOString().split('T')[0]}
                                                onChange={(e) => setData('check_in', e.target.value)}
                                                className={bookingInputClass('check_in')}
                                                required
                                            />
                                            {errors.check_in && <p className="text-red-500 text-xs mt-1">{errors.check_in}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-navy-600 mb-1.5">Check Out</label>
                                            <input
                                                type="date"
                                                value={data.check_out}
                                                min={data.check_in || new Date().toISOString().split('T')[0]}
                                                onChange={(e) => setData('check_out', e.target.value)}
                                                className={bookingInputClass('check_out')}
                                                required
                                            />
                                            {errors.check_out && <p className="text-red-500 text-xs mt-1">{errors.check_out}</p>}
                                        </div>
                                    </div>

                                    {/* Guests */}
                                    <div>
                                        <label className="block text-xs font-medium text-navy-600 mb-1.5">Guests</label>
                                        <select
                                            value={data.guests}
                                            onChange={(e) => setData('guests', parseInt(e.target.value))}
                                            className={bookingInputClass('guests')}
                                        >
                                            {Array.from({ length: property.max_guests }, (_, i) => i + 1).map((n) => (
                                                <option key={n} value={n}>{n} guest{n !== 1 ? 's' : ''}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Special requests */}
                                    <div>
                                        <label className="block text-xs font-medium text-navy-600 mb-1.5">Special Requests <span className="text-navy-300">(optional)</span></label>
                                        <textarea
                                            value={data.special_requests}
                                            onChange={(e) => setData('special_requests', e.target.value)}
                                            rows={2}
                                            placeholder="Any special requirements..."
                                            className={`${bookingInputClass('special_requests')} resize-none`}
                                        />
                                        {errors.special_requests && <p className="text-red-500 text-xs mt-1">{errors.special_requests}</p>}
                                    </div>

                                    {/* Price breakdown */}
                                    {nights > 0 && (
                                        <div className="bg-navy-50 rounded-2xl p-4 space-y-2 text-sm">
                                            <div className="flex justify-between text-navy-600">
                                                <span>{property.currency} {property.price_per_night.toLocaleString()} × {nights} night{nights !== 1 ? 's' : ''}</span>
                                                <span>{property.currency} {subtotal.toLocaleString()}</span>
                                            </div>
                                            {cleaningFee > 0 && (
                                                <div className="flex justify-between text-navy-600">
                                                    <span>Cleaning fee</span>
                                                    <span>{property.currency} {cleaningFee.toLocaleString()}</span>
                                                </div>
                                            )}
                                            {securityDeposit > 0 && (
                                                <div className="flex justify-between text-navy-600">
                                                    <span>Security deposit</span>
                                                    <span>{property.currency} {securityDeposit.toLocaleString()}</span>
                                                </div>
                                            )}
                                            <div className="flex justify-between font-semibold text-navy-800 pt-2 border-t border-gray-200">
                                                <span>Total</span>
                                                <span>{property.currency} {total.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full py-4 bg-gold-500 hover:bg-gold-600 disabled:opacity-60 text-white font-semibold rounded-xl transition-all shadow-sm text-sm"
                                    >
                                        {processing ? 'Sending Request...' : 'Request to Book'}
                                    </button>

                                    <p className="text-center text-xs text-navy-400">
                                        No payment now · Our team will confirm within 24 hours
                                    </p>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
