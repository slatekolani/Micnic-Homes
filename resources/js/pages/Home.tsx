import { Link, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    Search, MapPin, Calendar, Users, Star, ArrowRight,
    Shield, Heart, Award, Waves, TreePine, Mountain, Wifi,
    Home as HomeIcon, Building2, Castle, Tent, Sailboat, Coffee,
} from 'lucide-react';
import AppLayout from '../layouts/AppLayout';
import PropertyCard from '../components/PropertyCard';
import HeroCarousel from '../components/HeroCarousel';
import AnimatedCounter from '../components/AnimatedCounter';
import MarketingImageTile from '../components/MarketingImageTile';
import SeoHead, { SITE_URL } from '../components/SeoHead';
import { MarketingImage, Property } from '../types';

interface Category {
    type: string;
    count: number;
}

interface Props {
    carousel: Property[];
    latest: Property[];
    categories: Category[];
    marketingImages: MarketingImage[];
}

const categoryMeta: Record<string, { icon: React.ElementType; label: string; color: string }> = {
    villa:      { icon: Castle,    label: 'Villa',      color: 'bg-rose-50 text-rose-600 border-rose-100' },
    apartment:  { icon: Building2, label: 'Apartment',  color: 'bg-blue-50 text-blue-600 border-blue-100' },
    penthouse:  { icon: Award,     label: 'Penthouse',  color: 'bg-gold-50 text-gold-600 border-gold-100' },
    cottage:    { icon: HomeIcon,  label: 'Cottage',    color: 'bg-green-50 text-green-600 border-green-100' },
    chalet:     { icon: Mountain,  label: 'Chalet',     color: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
    bungalow:   { icon: Tent,      label: 'Bungalow',   color: 'bg-orange-50 text-orange-600 border-orange-100' },
    studio:     { icon: Coffee,    label: 'Studio',     color: 'bg-purple-50 text-purple-600 border-purple-100' },
};

const stats = [
    { value: 500, suffix: '+', label: 'Curated Stays' },
    { value: 98, suffix: '%', label: 'Guest Satisfaction' },
    { value: 5, suffix: '+', label: 'Destinations' },
    { value: 24, suffix: '/7', label: 'Guest Support' },
];

const homeHighlights = [
    { icon: Wifi, label: 'Connected', desc: 'Work-ready WiFi and calm spaces for longer stays.' },
    { icon: Waves, label: 'Resort Feel', desc: 'Pools, terraces, gardens and views chosen for real downtime.' },
    { icon: Shield, label: 'Verified', desc: 'Listings are reviewed for comfort, location and guest readiness.' },
];

const testimonials = [
    {
        name: 'Sarah Mitchell', location: 'London, UK', rating: 5, avatar: 'SM',
        comment: 'Absolutely breathtaking villa. Every detail was perfect — from the infinity pool overlooking the ocean to the personalised concierge service.',
    },
    {
        name: 'James Oduya', location: 'Nairobi, Kenya', rating: 5, avatar: 'JO',
        comment: 'Micnic Villa exceeded every expectation. The booking process was seamless, the property was immaculate, and the host was incredibly attentive.',
    },
    {
        name: 'Elena Rossi', location: 'Milan, Italy', rating: 5, avatar: 'ER',
        comment: 'A truly world-class experience. The villa had everything we could dream of — spectacular views, gorgeous interiors, and a location that took our breath away.',
    },
];

export default function Home({ carousel, latest, categories, marketingImages }: Props) {
    const [search, setSearch]     = useState('');
    const [checkIn, setCheckIn]   = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [guests, setGuests]     = useState('');
    const primarySeoImage = carousel[0]?.images?.[0]?.url || marketingImages[0]?.url || null;
    const absoluteSeoImage = primarySeoImage
        ? (primarySeoImage.startsWith('http') ? primarySeoImage : `${SITE_URL}${primarySeoImage.startsWith('/') ? primarySeoImage : `/${primarySeoImage}`}`)
        : `${SITE_URL}/MicNic_Logo.png`;

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (search)  params.set('search', search);
        if (guests)  params.set('guests', guests);
        if (checkIn) params.set('check_in', checkIn);
        if (checkOut) params.set('check_out', checkOut);
        router.get('/properties?' + params.toString());
    };

    const imageAt = (index: number) => {
        if (marketingImages.length === 0) return null;
        return marketingImages[index % marketingImages.length];
    };

    return (
        <AppLayout>
            <SeoHead
                title="Apartments, Villas & Serviced Stays in Tanzania"
                description="Book curated apartments, private villas, furnished short-stay homes and premium serviced stays in Dar es Salaam, Zanzibar and across Tanzania with Micnic Homes."
                canonicalPath="/"
                image={carousel[0]?.images?.[0]?.url || marketingImages[0]?.url}
                keywords={[
                    'apartments for rent Dar es Salaam',
                    'serviced apartments Dar es Salaam',
                    'short term rentals Tanzania',
                    'private villas Zanzibar',
                    'holiday apartments Tanzania',
                    'luxury villa booking Tanzania',
                ]}
                structuredData={[
                    {
                        '@context': 'https://schema.org',
                        '@type': 'LodgingBusiness',
                        name: 'Micnic Homes',
                        url: SITE_URL,
                        logo: `${SITE_URL}/MicNic_Logo.png`,
                        image: absoluteSeoImage,
                        telephone: '+255620188878',
                        email: 'info@micnichomes.co.tz',
                        address: {
                            '@type': 'PostalAddress',
                            addressLocality: 'Dar es Salaam',
                            addressCountry: 'TZ',
                        },
                        areaServed: ['Dar es Salaam', 'Zanzibar', 'Tanzania'],
                        sameAs: ['https://www.instagram.com/micnic.homes?igsh=bjYyM3U5bGpnaDd3'],
                    },
                    {
                        '@context': 'https://schema.org',
                        '@type': 'WebSite',
                        name: 'Micnic Homes',
                        url: SITE_URL,
                        potentialAction: {
                            '@type': 'SearchAction',
                            target: `${SITE_URL}/properties?search={search_term_string}`,
                            'query-input': 'required name=search_term_string',
                        },
                    },
                ]}
            />

            {/* ─── Hero Carousel ─── */}
            {carousel.length > 0 ? (
                <div className="relative">
                    <HeroCarousel properties={carousel} />

                    {/* Floating search bar over carousel bottom */}
                    <div className="relative z-20 -mt-8 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                        <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-2xl p-2">
                            <div className="flex flex-col md:flex-row items-stretch gap-2">
                                <div className="flex items-center gap-3 flex-1 px-4 py-3">
                                    <MapPin className="w-5 h-5 text-gold-500 shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <label className="block text-xs font-medium text-navy-400 mb-0.5">Where</label>
                                        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search destinations..." className="w-full text-sm text-navy-800 placeholder-navy-300 outline-none bg-transparent" />
                                    </div>
                                </div>
                                <div className="hidden md:block w-px bg-gray-200 my-2" />
                                <div className="flex items-center gap-3 px-4 py-3 md:w-44">
                                    <Calendar className="w-5 h-5 text-gold-500 shrink-0" />
                                    <div className="flex-1">
                                        <label className="block text-xs font-medium text-navy-400 mb-0.5">Check In</label>
                                        <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="w-full text-sm text-navy-800 outline-none bg-transparent" />
                                    </div>
                                </div>
                                <div className="hidden md:block w-px bg-gray-200 my-2" />
                                <div className="flex items-center gap-3 px-4 py-3 md:w-44">
                                    <Calendar className="w-5 h-5 text-gold-500 shrink-0" />
                                    <div className="flex-1">
                                        <label className="block text-xs font-medium text-navy-400 mb-0.5">Check Out</label>
                                        <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="w-full text-sm text-navy-800 outline-none bg-transparent" />
                                    </div>
                                </div>
                                <div className="hidden md:block w-px bg-gray-200 my-2" />
                                <div className="flex items-center gap-3 px-4 py-3 md:w-36">
                                    <Users className="w-5 h-5 text-gold-500 shrink-0" />
                                    <div className="flex-1">
                                        <label className="block text-xs font-medium text-navy-400 mb-0.5">Guests</label>
                                        <select value={guests} onChange={(e) => setGuests(e.target.value)} className="w-full text-sm text-navy-800 outline-none bg-transparent">
                                            <option value="">Any</option>
                                            {[1, 2, 3, 4, 5, 6, 8, 10].map((n) => (
                                                <option key={n} value={n}>{n}+ guests</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <button type="submit" className="flex items-center justify-center gap-2 bg-gold-500 hover:bg-gold-600 text-white px-8 py-3 rounded-xl font-medium transition-all shadow-sm text-sm">
                                    <Search className="w-4 h-4" />
                                    Search
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            ) : (
                /* Fallback hero if no properties yet */
                <section className="relative min-h-[70vh] flex items-center justify-center bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800">
                    <div className="text-center px-4">
                        <h1 className="font-display text-5xl sm:text-6xl font-semibold text-white mb-4">
                            Your Perfect <span className="text-gold-400">Private Escape</span>
                        </h1>
                        <p className="text-white/70 text-lg max-w-xl mx-auto mb-8">Discover handpicked luxury villas and apartments.</p>
                        <Link href="/properties" className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-600 text-white px-8 py-4 rounded-xl font-semibold transition-all">
                            Browse Properties <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </section>
            )}

            {/* ─── Stats ─── */}
                <section className="bg-navy-900 py-14 mt-6">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                            {stats.map((stat) => (
                                <div key={stat.label} className="text-center">
                                <div className="font-display text-3xl sm:text-4xl font-bold text-gold-400 mb-1">
                                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                                </div>
                                <div className="text-white/60 text-sm">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── Categories ─── */}
            {categories.length > 0 && (
                <section className="py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <p className="text-gold-500 text-sm font-semibold tracking-widest uppercase mb-2">Browse by Type</p>
                            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-navy-900">Explore Categories</h2>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                            {categories.map(({ type, count }) => {
                                const meta = categoryMeta[type] ?? { icon: HomeIcon, label: type, color: 'bg-gray-50 text-gray-600 border-gray-100' };
                                const Icon = meta.icon;
                                return (
                                    <Link
                                        key={type}
                                        href={`/properties?type=${type}`}
                                        className={`group flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all hover:shadow-md hover:-translate-y-0.5 ${meta.color}`}
                                    >
                                        <div className="w-12 h-12 rounded-xl bg-white/70 flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <Icon className="w-6 h-6" />
                                        </div>
                                        <div className="text-center">
                                            <p className="font-semibold text-sm capitalize">{meta.label}</p>
                                            <p className="text-xs opacity-70 mt-0.5">{count} {count === 1 ? 'property' : 'properties'}</p>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </section>
            )}

            {/* ─── Latest / All Properties ─── */}
            {latest.length > 0 && (
                <section className="py-20 bg-navy-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-end justify-between mb-12">
                            <div>
                                <p className="text-gold-500 text-sm font-semibold tracking-widest uppercase mb-2">Just Added</p>
                                <h2 className="font-display text-3xl sm:text-4xl font-semibold text-navy-900">Newest Listings</h2>
                            </div>
                            <Link href="/properties" className="hidden sm:flex items-center gap-2 text-navy-600 hover:text-gold-600 font-medium text-sm transition-colors group">
                                Browse all <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                            {latest.map((property) => (
                                <PropertyCard key={property.id} property={property} />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ─── Brand Preview ─── */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-14 items-center">
                        <div>
                            <p className="text-gold-500 text-sm font-semibold tracking-widest uppercase mb-3">Our Standard</p>
                            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-navy-900 mb-6 leading-tight">
                                Apartment stays with a private-villa level of care
                            </h2>
                            <p className="text-navy-500 text-base leading-relaxed mb-8">
                                We keep the cool parts of travel simple: beautiful rooms, clear details, responsive hosting and homes that feel ready the moment you arrive.
                            </p>
                            <div className="space-y-4">
                                {homeHighlights.map((item) => (
                                    <div key={item.label} className="group flex items-start gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-gold-200 hover:shadow-lg">
                                        <div className="w-11 h-11 bg-gold-100 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105">
                                            <item.icon className="w-5 h-5 text-gold-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-navy-800 text-sm mb-1">{item.label}</h4>
                                            <p className="text-navy-500 text-sm leading-relaxed">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Link href="/about" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-navy-800 transition-colors hover:text-gold-600">
                                Learn about us <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                        <div className="grid grid-cols-5 gap-3">
                            <MarketingImageTile
                                image={imageAt(0)}
                                className="col-span-3 rounded-3xl bg-navy-100 shadow-xl"
                                imageClassName="min-h-[360px]"
                                fallbackClassName="flex min-h-[360px] items-center justify-center bg-navy-950 text-white/40"
                            />
                            <div className="col-span-2 space-y-3 pt-8">
                                <MarketingImageTile
                                    image={imageAt(1)}
                                    className="rounded-2xl bg-navy-100 shadow-lg"
                                    imageClassName="aspect-square"
                                    fallbackClassName="aspect-square bg-navy-200"
                                />
                                <div className="rounded-2xl bg-navy-950 p-5 text-white shadow-lg">
                                    <p className="text-xs font-semibold uppercase tracking-widest text-gold-400">Micnic touch</p>
                                    <p className="mt-3 text-sm leading-relaxed text-white/70">Clean presentation, honest details and stays selected for comfort.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── How It Works ─── */}
            <section className="py-20 bg-navy-950 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-14">
                        <p className="text-gold-400 text-sm font-semibold tracking-widest uppercase mb-3">Simple Process</p>
                        <h2 className="font-display text-3xl sm:text-4xl font-semibold">How It Works</h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { step: '01', icon: Search, title: 'Search & Discover', desc: 'Browse our curated selection of luxury properties. Filter by location, type, price and amenities.' },
                            { step: '02', icon: Heart,  title: 'Choose Your Stay',  desc: 'View detailed property information, real guest reviews, and check real-time availability.' },
                            { step: '03', icon: Shield, title: 'Book with Confidence', desc: 'No account needed — just fill in your details and your request goes straight to our team.' },
                        ].map((item) => (
                            <div key={item.step} className="text-center">
                                <div className="relative inline-block mb-6">
                                    <div className="w-16 h-16 bg-gold-500/20 rounded-2xl flex items-center justify-center mx-auto">
                                        <item.icon className="w-7 h-7 text-gold-400" />
                                    </div>
                                    <span className="absolute -top-2 -right-2 w-6 h-6 bg-gold-500 rounded-full text-xs font-bold flex items-center justify-center text-white">
                                        {item.step.slice(-1)}
                                    </span>
                                </div>
                                <h3 className="font-semibold text-lg mb-3">{item.title}</h3>
                                <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── Testimonials ─── */}
            <section className="py-20 bg-navy-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-14">
                        <p className="text-gold-500 text-sm font-semibold tracking-widest uppercase mb-3">Reviews</p>
                        <h2 className="font-display text-3xl sm:text-4xl font-semibold text-navy-900">What Our Guests Say</h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                        {testimonials.map((t) => (
                            <div key={t.name} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                <div className="flex items-center gap-1 mb-4">
                                    {[...Array(t.rating)].map((_, i) => (
                                        <Star key={i} className="w-4 h-4 text-gold-400 fill-gold-400" />
                                    ))}
                                </div>
                                <p className="text-navy-600 text-sm leading-relaxed mb-5">"{t.comment}"</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-navy-900 flex items-center justify-center text-white text-sm font-bold">{t.avatar}</div>
                                    <div>
                                        <p className="font-semibold text-navy-800 text-sm">{t.name}</p>
                                        <p className="text-navy-400 text-xs">{t.location}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── CTA ─── */}
            <section className="py-20 bg-gradient-to-br from-gold-500 to-gold-600">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="font-display text-3xl sm:text-4xl font-semibold text-white mb-4">
                        Ready for Your Getaway?
                    </h2>
                    <p className="text-white/80 text-base leading-relaxed mb-8">
                        Browse our properties and send a booking request — no account required. Our team will confirm your stay within 24 hours.
                    </p>
                    <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-navy-900 hover:bg-navy-800 text-white font-semibold rounded-xl transition-all shadow-lg">
                        Contact Us <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </section>
        </AppLayout>
    );
}
