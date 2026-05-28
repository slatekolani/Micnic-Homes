import { Link } from '@inertiajs/react';
import { ArrowRight, CheckCircle2, ConciergeBell, Home, MapPin, Shield, Wifi } from 'lucide-react';
import AppLayout from '../layouts/AppLayout';
import AnimatedCounter from '../components/AnimatedCounter';
import DatabaseHero from '../components/DatabaseHero';
import MarketingImageTile from '../components/MarketingImageTile';
import SeoHead, { SITE_URL } from '../components/SeoHead';
import { MarketingImage } from '../types';

const standards = [
    { icon: Home, title: 'Apartment comfort', desc: 'Modern layouts, practical kitchens, restful bedrooms and spaces that work for short or extended stays.' },
    { icon: Shield, title: 'Verified stays', desc: 'Properties are reviewed for location, cleanliness, amenities and guest readiness before they are promoted.' },
    { icon: ConciergeBell, title: 'Responsive hosting', desc: 'Guests get clear communication before arrival and attentive support throughout the booking journey.' },
    { icon: Wifi, title: 'Work and unwind', desc: 'We prioritize WiFi, comfortable seating, privacy and the little details that make a stay feel easy.' },
];

const stats = [
    { value: 500, suffix: '+', label: 'Curated stays' },
    { value: 98, suffix: '%', label: 'Guest satisfaction' },
    { value: 5, suffix: '+', label: 'Destinations' },
];

interface Props {
    heroImages: MarketingImage[];
}

export default function About({ heroImages }: Props) {
    const imageAt = (index: number) => {
        if (heroImages.length === 0) return null;
        return heroImages[index % heroImages.length];
    };

    return (
        <AppLayout>
            <SeoHead
                title="About Micnic Homes"
                description="Learn about Micnic Homes, a Tanzania-based stay platform for curated apartments, private villas, serviced homes and premium short-term rentals."
                canonicalPath="/about"
                image={heroImages[0]?.url}
                keywords={[
                    'about Micnic Homes',
                    'Tanzania apartment booking company',
                    'verified stays Tanzania',
                    'curated apartments Dar es Salaam',
                    'trusted villa booking Tanzania',
                ]}
                structuredData={{
                    '@context': 'https://schema.org',
                    '@type': 'Organization',
                    name: 'Micnic Homes',
                    url: SITE_URL,
                    logo: `${SITE_URL}/MicNic_Logo.png`,
                    contactPoint: {
                        '@type': 'ContactPoint',
                        telephone: '+255620188878',
                        contactType: 'customer service',
                        areaServed: 'TZ',
                        availableLanguage: ['English', 'Swahili'],
                    },
                }}
            />

            <DatabaseHero images={heroImages}>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                    <div className="max-w-3xl">
                        <p className="text-gold-400 text-sm font-semibold tracking-widest uppercase mb-4">About Micnic Homes</p>
                        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight">
                            Refined apartment stays with villa-level attention.
                        </h1>
                        <p className="mt-6 max-w-2xl text-base sm:text-lg leading-8 text-white/70">
                            Micnic Homes connects guests with private apartments, villas and premium stays in Tanzania that feel polished, calm and ready for real living.
                        </p>
                        <div className="mt-8 flex flex-wrap gap-3">
                            <Link href="/properties" className="inline-flex items-center gap-2 rounded-2xl bg-gold-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:bg-gold-600">
                                Explore Properties <ArrowRight className="h-4 w-4" />
                            </Link>
                            <Link href="/contact" className="inline-flex items-center gap-2 rounded-2xl border border-white/20 px-6 py-3 text-sm font-semibold text-white transition-all hover:border-gold-300 hover:text-gold-300">
                                Speak With Us
                            </Link>
                        </div>
                    </div>
                </div>
            </DatabaseHero>

            <section className="bg-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-14 items-center">
                        <div>
                            <p className="text-gold-500 text-sm font-semibold tracking-widest uppercase mb-3">Our Approach</p>
                            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-navy-900 leading-tight">
                                We choose places that look good and live well.
                            </h2>
                            <p className="mt-5 text-navy-500 leading-8">
                                A beautiful listing is only useful when the stay feels smooth. We focus on accurate presentation, reliable amenities, thoughtful interiors and the kind of communication that makes guests feel prepared before they arrive.
                            </p>
                            <div className="mt-8 grid gap-3">
                                {['Clear property details', 'Guest-ready amenities', 'Responsive owner support'].map((item) => (
                                    <div key={item} className="flex items-center gap-3 text-sm font-medium text-navy-700">
                                        <CheckCircle2 className="h-5 w-5 text-gold-500" />
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <MarketingImageTile
                                image={imageAt(3)}
                                className="rounded-3xl shadow-xl"
                                imageClassName="aspect-[4/5]"
                                fallbackClassName="aspect-[4/5] bg-navy-100"
                            />
                            <div className="space-y-4 pt-10">
                                <MarketingImageTile
                                    image={imageAt(4)}
                                    className="rounded-3xl shadow-lg"
                                    imageClassName="aspect-square"
                                    fallbackClassName="aspect-square bg-navy-100"
                                />
                                <div className="rounded-3xl bg-navy-950 p-6 text-white shadow-lg">
                                    <MapPin className="h-6 w-6 text-gold-400" />
                                    <p className="mt-4 text-sm leading-7 text-white/70">From city apartments to private villas, each stay is selected for location, comfort and guest confidence.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-navy-50 py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid gap-5 md:grid-cols-4">
                        <div className="md:col-span-1">
                            <p className="text-gold-500 text-sm font-semibold tracking-widest uppercase mb-3">Standards</p>
                            <h2 className="font-display text-3xl font-semibold text-navy-900">What we look for</h2>
                        </div>
                        {standards.map(({ icon: Icon, title, desc }) => (
                            <div key={title} className="rounded-3xl border border-white bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gold-100 text-gold-700">
                                    <Icon className="h-6 w-6" />
                                </div>
                                <h3 className="font-semibold text-navy-900">{title}</h3>
                                <p className="mt-3 text-sm leading-7 text-navy-500">{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="bg-navy-950 py-16 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid gap-8 md:grid-cols-3">
                        {stats.map((stat) => (
                            <div key={stat.label} className="text-center">
                                <div className="font-display text-4xl font-bold text-gold-400">
                                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                                </div>
                                <p className="mt-2 text-sm text-white/60">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="bg-white py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <ConciergeBell className="mx-auto h-8 w-8 text-gold-500" />
                    <h2 className="mt-5 font-display text-3xl sm:text-4xl font-semibold text-navy-900">Ready to find your next stay?</h2>
                    <p className="mx-auto mt-4 max-w-2xl text-navy-500 leading-7">Browse curated properties or contact us for help choosing the right apartment or villa for your trip.</p>
                    <Link href="/properties" className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-navy-900 px-7 py-3.5 text-sm font-semibold text-white transition-all hover:bg-navy-800">
                        View Properties <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </section>
        </AppLayout>
    );
}
