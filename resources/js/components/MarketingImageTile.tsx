import { Link } from '@inertiajs/react';
import { ArrowUpRight } from 'lucide-react';
import { MarketingImage } from '../types';

interface Props {
    image: MarketingImage | null;
    className?: string;
    imageClassName?: string;
    fallbackClassName?: string;
}

export default function MarketingImageTile({
    image,
    className = '',
    imageClassName = '',
    fallbackClassName = '',
}: Props) {
    if (!image) {
        return <div className={`${fallbackClassName || 'min-h-[220px] bg-navy-100'} ${className}`} />;
    }

    const title = image.property_title || image.caption || 'View property';
    const href = image.property_slug ? `/properties/${image.property_slug}` : '/properties';

    return (
        <Link href={href} className={`group relative block overflow-hidden ${className}`} title={title}>
            <img
                src={image.url}
                alt={title}
                className={`h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 ${imageClassName}`}
            />
            <div className="absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-navy-950/90 via-navy-950/60 to-transparent px-4 pb-4 pt-14 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                <div className="flex items-end justify-between gap-3 text-white">
                    <div className="min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-widest text-gold-300">Property</p>
                        <p className="mt-1 truncate text-sm font-semibold">{title}</p>
                    </div>
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15 backdrop-blur">
                        <ArrowUpRight className="h-4 w-4" />
                    </span>
                </div>
            </div>
        </Link>
    );
}
