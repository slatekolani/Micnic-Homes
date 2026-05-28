import { useState } from 'react';
import { router } from '@inertiajs/react';
import { Star, MapPin, BedDouble, Bath, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { Property } from '../types';

interface Props {
    property: Property;
}

export default function PropertyCard({ property }: Props) {
    const images = property.images ?? [];
    const [idx, setIdx] = useState(0);
    const [failedImages, setFailedImages] = useState<Record<number, boolean>>({});

    const currentImage = images[idx];
    const showImage = !!(currentImage && !failedImages[currentImage.id]);
    const hasMany = images.length > 1;

    /* Navigate to property page — triggered by clicking anywhere on the card
       except the carousel controls, which call stopPropagation. */
    const visit = () => router.visit(`/properties/${property.slug}`);

    const prev = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIdx((i) => (i - 1 + images.length) % images.length);
    };

    const next = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIdx((i) => (i + 1) % images.length);
    };

    const goTo = (e: React.MouseEvent, i: number) => {
        e.stopPropagation();
        setIdx(i);
    };

    const markImageFailed = () => {
        if (!currentImage) return;
        setFailedImages((failed) => ({ ...failed, [currentImage.id]: true }));
    };

    /* Inline styles for arrow buttons — bypasses any Tailwind purge / v4 edge cases */
    const arrowStyle = (disabled: boolean): React.CSSProperties => ({
        position:        'absolute',
        top:             '50%',
        transform:       'translateY(-50%)',
        zIndex:          30,
        width:           38,
        height:          38,
        borderRadius:    '50%',
        background:      'white',
        boxShadow:       '0 2px 8px rgba(0,0,0,0.35)',
        border:          'none',
        display:         'flex',
        alignItems:      'center',
        justifyContent:  'center',
        cursor:          disabled ? 'default' : 'pointer',
        opacity:         disabled ? 0.3 : 1,
        padding:         0,
    });

    return (
        <div
            onClick={visit}
            className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
        >
            {/* ── Image area ── */}
            <div className="relative aspect-[4/3] bg-gradient-to-br from-navy-100 to-navy-200">

                {showImage ? (
                    <img
                        key={currentImage.url}
                        src={currentImage.url}
                        alt={property.title}
                        loading="eager"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={markImageFailed}
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-5xl">🏠</span>
                    </div>
                )}

                {/* ── Carousel arrows ── */}
                {hasMany && (
                    <>
                        <button
                            type="button"
                            onClick={prev}
                            aria-label="Previous photo"
                            style={{ ...arrowStyle(false), left: 8 }}
                        >
                            <ChevronLeft size={20} color="#1a2744" />
                        </button>

                        <button
                            type="button"
                            onClick={next}
                            aria-label="Next photo"
                            style={{ ...arrowStyle(false), right: 8 }}
                        >
                            <ChevronRight size={20} color="#1a2744" />
                        </button>

                        {/* Dot indicators */}
                        <div
                            style={{
                                position:       'absolute',
                                bottom:         12,
                                left:           0,
                                right:          0,
                                display:        'flex',
                                justifyContent: 'center',
                                gap:            6,
                                zIndex:         30,
                            }}
                        >
                            {images.map((_, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={(e) => goTo(e, i)}
                                    aria-label={`Photo ${i + 1}`}
                                    style={{
                                        height:       8,
                                        width:        i === idx ? 24 : 8,
                                        borderRadius: 4,
                                        background:   i === idx ? 'white' : 'rgba(255,255,255,0.55)',
                                        border:       'none',
                                        padding:      0,
                                        cursor:       'pointer',
                                        transition:   'width 0.2s, background 0.2s',
                                        boxShadow:    '0 1px 3px rgba(0,0,0,0.3)',
                                    }}
                                />
                            ))}
                        </div>
                    </>
                )}

                {/* Type + Featured badges */}
                <div className="absolute top-3 left-3 flex gap-2" style={{ zIndex: 20, pointerEvents: 'none' }}>
                    <span className="px-2.5 py-1 bg-white/95 backdrop-blur-sm rounded-full text-xs font-semibold text-navy-700 capitalize shadow-sm">
                        {property.type}
                    </span>
                    {property.featured && (
                        <span className="px-2.5 py-1 bg-gold-500 rounded-full text-xs font-semibold text-white shadow-sm">
                            Featured
                        </span>
                    )}
                </div>

                {/* Rating badge */}
                {property.avg_rating > 0 && (
                    <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/95 backdrop-blur-sm rounded-full px-2.5 py-1 shadow-sm" style={{ zIndex: 20, pointerEvents: 'none' }}>
                        <Star className="w-3.5 h-3.5 text-gold-500 fill-gold-500" />
                        <span className="text-xs font-semibold text-navy-800">{property.avg_rating.toFixed(1)}</span>
                        {property.review_count > 0 && (
                            <span className="text-xs text-navy-400">({property.review_count})</span>
                        )}
                    </div>
                )}
            </div>

            {/* ── Card body ── */}
            <div className="p-4">
                <h3 className="font-semibold text-navy-900 text-base leading-tight line-clamp-1 mb-2 group-hover:text-gold-600 transition-colors">
                    {property.title}
                </h3>

                <div className="flex items-center gap-1.5 text-navy-400 text-xs mb-3">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{property.city}, {property.country}</span>
                </div>

                <div className="flex items-center gap-4 text-xs text-navy-500 mb-4">
                    <div className="flex items-center gap-1">
                        <BedDouble className="w-3.5 h-3.5" />
                        <span>{property.bedrooms} bed{property.bedrooms !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Bath className="w-3.5 h-3.5" />
                        <span>{property.bathrooms} bath{property.bathrooms !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        <span>Up to {property.max_guests}</span>
                    </div>
                </div>

                <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                    <div>
                        <span className="text-lg font-bold text-navy-900">
                            {property.currency} {property.price_per_night.toLocaleString()}
                        </span>
                        <span className="text-xs text-navy-400"> / night</span>
                    </div>
                    <span className="text-xs font-medium text-gold-600 bg-gold-50 px-3 py-1 rounded-full">
                        Book now
                    </span>
                </div>
            </div>
        </div>
    );
}
