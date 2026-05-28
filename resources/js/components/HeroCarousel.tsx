import { useState, useEffect, useCallback } from 'react';
import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, MapPin, Star, BedDouble, Users } from 'lucide-react';
import { Property } from '../types';

interface Props {
    properties: Property[];
}

export default function HeroCarousel({ properties }: Props) {
    const [current, setCurrent] = useState(0);
    const [paused, setPaused] = useState(false);

    const next = useCallback(() => setCurrent((c) => (c + 1) % properties.length), [properties.length]);
    const prev = () => setCurrent((c) => (c - 1 + properties.length) % properties.length);

    useEffect(() => {
        if (paused || properties.length <= 1) return;
        const id = setInterval(next, 6000);
        return () => clearInterval(id);
    }, [paused, next, properties.length]);

    if (!properties.length) return null;

    const property = properties[current];
    const image = property.images?.[0]?.url ?? null;

    return (
        <section
            className="relative min-h-screen flex items-end overflow-hidden"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
        >
            {/* Background image with overlay */}
            <div className="absolute inset-0">
                {image ? (
                    <img
                        key={property.id}
                        src={image}
                        alt={property.title}
                        className="w-full h-full object-cover transition-opacity duration-700"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-navy-950 to-navy-800" />
                )}
                {/* Multi-layer overlay for text legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
            </div>

            {/* Gold orb accents */}
            <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Slide content */}
            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 pt-52">
                <div className="max-w-2xl">
                    {/* Type badge */}
                    <span className="inline-flex items-center gap-2 px-3 py-1 bg-gold-500/90 text-white text-xs font-semibold rounded-full uppercase tracking-widest mb-4 capitalize">
                        <span className="h-1.5 w-1.5 rounded-full bg-brand-red" />
                        {property.type}
                    </span>

                    {/* Title */}
                    <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold text-white leading-tight mb-4">
                        {property.title}
                    </h2>

                    {/* Location */}
                    <div className="flex items-center gap-2 text-white/80 mb-4">
                        <MapPin className="w-4 h-4 text-gold-400" />
                        <span className="text-sm">{property.city}, {property.country}</span>
                    </div>

                    {/* Description */}
                    {property.short_description && (
                        <p className="text-white/70 text-base leading-relaxed mb-6 max-w-xl">
                            {property.short_description}
                        </p>
                    )}

                    {/* Meta row */}
                    <div className="flex items-center gap-5 mb-8 flex-wrap">
                        {property.avg_rating > 0 && (
                            <div className="flex items-center gap-1.5 text-white/90">
                                <Star className="w-4 h-4 text-gold-400 fill-gold-400" />
                                <span className="text-sm font-medium">{property.avg_rating.toFixed(1)}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-1.5 text-white/80">
                            <BedDouble className="w-4 h-4 text-gold-400" />
                            <span className="text-sm">{property.bedrooms} bed{property.bedrooms !== 1 ? 's' : ''}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-white/80">
                            <Users className="w-4 h-4 text-gold-400" />
                            <span className="text-sm">Up to {property.max_guests} guests</span>
                        </div>
                        <div className="text-white font-semibold text-sm">
                            <span className="text-gold-300 text-xl font-bold">
                                {property.currency} {property.price_per_night.toLocaleString()}
                            </span>
                            <span className="text-white/60"> / night</span>
                        </div>
                    </div>

                    {/* CTA */}
                    <Link
                        href={`/properties/${property.slug}`}
                        className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-white px-8 py-4 rounded-xl font-semibold text-sm transition-all shadow-lg hover:shadow-gold-500/30 hover:shadow-xl"
                    >
                        View Property
                        <ChevronRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>

            {/* Prev / Next controls */}
            {properties.length > 1 && (
                <>
                    <button
                        onClick={prev}
                        className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 bg-white/10 hover:bg-white/25 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-white transition-all"
                        aria-label="Previous"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        onClick={next}
                        className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 bg-white/10 hover:bg-white/25 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-white transition-all"
                        aria-label="Next"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </>
            )}

            {/* Dot indicators */}
            {properties.length > 1 && (
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
                    {properties.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrent(i)}
                            className={`transition-all rounded-full ${
                                i === current
                                    ? 'w-8 h-2 bg-gold-400'
                                    : 'w-2 h-2 bg-white/40 hover:bg-white/70'
                            }`}
                            aria-label={`Go to slide ${i + 1}`}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}
