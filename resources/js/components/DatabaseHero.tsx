import { PropsWithChildren, useEffect, useState } from 'react';
import { Link } from '@inertiajs/react';
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { MarketingImage } from '../types';

interface Props extends PropsWithChildren {
    images: MarketingImage[];
    className?: string;
}

export default function DatabaseHero({ images, className = '', children }: Props) {
    const [index, setIndex] = useState(0);
    const hasImages = images.length > 0;
    const hasMany = images.length > 1;
    const current = images[index];

    useEffect(() => {
        if (!hasMany) return;

        const interval = window.setInterval(() => {
            setIndex((currentIndex) => (currentIndex + 1) % images.length);
        }, 5200);

        return () => window.clearInterval(interval);
    }, [hasMany, images.length]);

    const previous = () => setIndex((currentIndex) => (currentIndex - 1 + images.length) % images.length);
    const next = () => setIndex((currentIndex) => (currentIndex + 1) % images.length);

    return (
        <section className={`group relative overflow-hidden bg-navy-950 pt-40 text-white sm:pt-44 ${className}`}>
            {hasImages ? (
                images.map((image, imageIndex) => (
                    <img
                        key={image.id}
                        src={image.url}
                        alt={image.property_title || image.caption || 'Micnic Villa property'}
                        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
                            imageIndex === index ? 'opacity-45' : 'opacity-0'
                        }`}
                    />
                ))
            ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800" />
            )}

            <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/88 to-navy-950/45" />

            {children}

            {current && (
                <Link
                    href={current.property_slug ? `/properties/${current.property_slug}` : '/properties'}
                    className="absolute bottom-6 left-4 z-20 max-w-[calc(100%-2rem)] translate-y-2 rounded-2xl border border-white/15 bg-navy-950/55 px-4 py-3 text-white opacity-0 shadow-xl backdrop-blur transition-all duration-300 hover:border-gold-300/70 group-hover:translate-y-0 group-hover:opacity-100 sm:left-8 sm:max-w-sm"
                    title={current.property_title || current.caption || 'View property'}
                >
                    <div className="flex items-center gap-3">
                        <div className="min-w-0">
                            <p className="text-xs font-semibold uppercase tracking-widest text-gold-300">Featured image</p>
                            <p className="mt-1 truncate text-sm font-semibold">
                                {current.property_title || current.caption || 'View property'}
                            </p>
                        </div>
                        <ArrowUpRight className="h-4 w-4 shrink-0 text-gold-300" />
                    </div>
                </Link>
            )}

            {hasMany && (
                <div className="absolute bottom-6 right-4 z-20 flex items-center gap-2 sm:right-8">
                    <button
                        type="button"
                        onClick={previous}
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur transition-all hover:bg-white/20"
                        aria-label="Previous hero image"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                        type="button"
                        onClick={next}
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur transition-all hover:bg-white/20"
                        aria-label="Next hero image"
                    >
                        <ChevronRight className="h-5 w-5" />
                    </button>
                    <div className="ml-2 hidden items-center gap-1 sm:flex">
                        {images.map((image, imageIndex) => (
                            <button
                                key={image.id}
                                type="button"
                                onClick={() => setIndex(imageIndex)}
                                aria-label={`Show image ${imageIndex + 1}`}
                                className={`h-1.5 rounded-full transition-all ${
                                    imageIndex === index ? 'w-6 bg-gold-400' : 'w-2 bg-white/45 hover:bg-white/70'
                                }`}
                            />
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
}
