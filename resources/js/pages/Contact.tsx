import { Link, useForm } from '@inertiajs/react';
import { ArrowRight, Clock, Mail, MapPin, MessageCircle, Phone, Send } from 'lucide-react';
import AppLayout from '../layouts/AppLayout';
import DatabaseHero from '../components/DatabaseHero';
import SeoHead, { SITE_URL } from '../components/SeoHead';
import { MarketingImage } from '../types';

const contactMethods = [
    { icon: Phone, label: 'Call / WhatsApp', value: '0620188878', href: 'tel:+255620188878' },
    { icon: Mail, label: 'Email', value: 'info@micnichomes.co.tz', href: 'mailto:info@micnichomes.co.tz' },
    { icon: MessageCircle, label: 'WhatsApp', value: 'Chat with our team', href: 'https://wa.me/255620188878' },
];

interface Props {
    heroImages: MarketingImage[];
}

export default function Contact({ heroImages }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phone: '',
        interest: 'Book a property',
        message: '',
    });

    const submitInquiry = (e: React.FormEvent) => {
        e.preventDefault();
        post('/contact', {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };

    return (
        <AppLayout>
            <SeoHead
                title="Contact Micnic Homes"
                description="Contact Micnic Homes for apartment bookings, private villa stays, serviced rentals and property listing support in Dar es Salaam and Tanzania."
                canonicalPath="/contact"
                image={heroImages[0]?.url}
                keywords={[
                    'contact Micnic Homes',
                    'book apartment Dar es Salaam',
                    'WhatsApp apartment booking Tanzania',
                    'villa booking support Tanzania',
                    'list property Tanzania',
                ]}
                structuredData={{
                    '@context': 'https://schema.org',
                    '@type': 'ContactPage',
                    name: 'Contact Micnic Homes',
                    url: `${SITE_URL}/contact`,
                    mainEntity: {
                        '@type': 'LodgingBusiness',
                        name: 'Micnic Homes',
                        telephone: '+255620188878',
                        email: 'info@micnichomes.co.tz',
                        address: {
                            '@type': 'PostalAddress',
                            addressLocality: 'Dar es Salaam',
                            addressCountry: 'TZ',
                        },
                    },
                }}
            />

            <DatabaseHero images={heroImages}>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="grid gap-12 lg:grid-cols-[1fr_0.85fr] lg:items-end">
                        <div>
                            <p className="text-gold-400 text-sm font-semibold tracking-widest uppercase mb-4">Contact</p>
                            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight">
                                Tell us what kind of stay you need.
                            </h1>
                            <p className="mt-6 max-w-2xl text-base sm:text-lg leading-8 text-white/70">
                                Whether you are booking a private villa, a city apartment or listing a property, our team can help you move quickly.
                            </p>
                        </div>
                        <div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur">
                            <div className="flex items-start gap-4">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gold-500 text-white">
                                    <Clock className="h-6 w-6" />
                                </div>
                                <div>
                                    <h2 className="font-semibold">Fast response window</h2>
                                    <p className="mt-2 text-sm leading-7 text-white/65">Booking requests are usually reviewed within 24 hours. Urgent trip? Call or use WhatsApp for the quickest route.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </DatabaseHero>

            <section className="bg-navy-50 py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
                        <div className="space-y-4">
                            {contactMethods.map(({ icon: Icon, label, value, href }) => (
                                <a
                                    key={label}
                                    href={href}
                                    className="group flex items-center gap-4 rounded-3xl border border-white bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                                >
                                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gold-100 text-gold-700 transition-transform duration-300 group-hover:scale-105">
                                        <Icon className="h-6 w-6" />
                                    </span>
                                    <span className="min-w-0">
                                        <span className="block text-xs font-semibold uppercase tracking-widest text-navy-400">{label}</span>
                                        <span className="mt-1 block truncate text-sm font-semibold text-navy-900">{value}</span>
                                    </span>
                                    <ArrowRight className="ml-auto h-4 w-4 text-navy-300 transition-transform group-hover:translate-x-1 group-hover:text-gold-600" />
                                </a>
                            ))}

                            <div className="rounded-3xl bg-navy-950 p-6 text-white shadow-xl">
                                <MapPin className="h-7 w-7 text-gold-400" />
                                <h2 className="mt-5 font-display text-2xl font-semibold">Dar es Salaam, Tanzania</h2>
                                <p className="mt-3 text-sm leading-7 text-white/65">Serving private stays, apartments and villa bookings across curated destinations.</p>
                            </div>
                        </div>

                        <div className="rounded-3xl bg-white p-5 shadow-xl sm:p-8">
                            <div className="mb-8">
                                <p className="text-gold-500 text-sm font-semibold tracking-widest uppercase mb-3">Inquiry</p>
                                <h2 className="font-display text-3xl font-semibold text-navy-900">Send a quick message</h2>
                                <p className="mt-3 text-sm leading-7 text-navy-500">Send your details directly to our team. We do not store contact inquiries in the database.</p>
                            </div>

                            <form onSubmit={submitInquiry} className="grid gap-5">
                                <div className="grid gap-5 sm:grid-cols-2">
                                    <label className="block">
                                        <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-navy-500">Name</span>
                                        <input
                                            name="name"
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-navy-900 outline-none transition-colors focus:border-gold-400"
                                            placeholder="Aida Aldan"
                                            required
                                        />
                                        {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                                    </label>
                                    <label className="block">
                                        <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-navy-500">Email</span>
                                        <input
                                            name="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-navy-900 outline-none transition-colors focus:border-gold-400"
                                            placeholder="you@example.com"
                                            required
                                        />
                                        {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                                    </label>
                                </div>
                                <label className="block">
                                    <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-navy-500">Phone <span className="font-normal normal-case text-navy-300">(optional)</span></span>
                                    <input
                                        name="phone"
                                        type="tel"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-navy-900 outline-none transition-colors focus:border-gold-400"
                                        placeholder="0620188878"
                                    />
                                    {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
                                </label>
                                <label className="block">
                                    <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-navy-500">Interest</span>
                                    <select
                                        name="interest"
                                        value={data.interest}
                                        onChange={(e) => setData('interest', e.target.value)}
                                        className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-navy-900 outline-none transition-colors focus:border-gold-400"
                                        required
                                    >
                                        <option>Book a property</option>
                                        <option>List my property</option>
                                        <option>Ask a question</option>
                                    </select>
                                    {errors.interest && <p className="mt-1 text-xs text-red-500">{errors.interest}</p>}
                                </label>
                                <label className="block">
                                    <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-navy-500">Message</span>
                                    <textarea
                                        name="message"
                                        rows={6}
                                        value={data.message}
                                        onChange={(e) => setData('message', e.target.value)}
                                        className="w-full resize-none rounded-2xl border border-gray-200 px-4 py-3 text-sm text-navy-900 outline-none transition-colors focus:border-gold-400"
                                        placeholder="Tell us dates, location, guests or the property you are interested in."
                                        required
                                    />
                                    {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message}</p>}
                                </label>
                                <button type="submit" disabled={processing} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-navy-900 px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-navy-800 disabled:opacity-60">
                                    <Send className="h-4 w-4" />
                                    {processing ? 'Sending...' : 'Send Inquiry'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-white py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="font-display text-3xl font-semibold text-navy-900">Prefer to browse first?</h2>
                    <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-navy-500">Explore current apartments and villas, then send a booking request directly from the property page.</p>
                    <Link href="/properties" className="mt-7 inline-flex items-center gap-2 rounded-2xl border border-navy-200 px-6 py-3 text-sm font-semibold text-navy-800 transition-all hover:border-gold-300 hover:text-gold-700">
                        View Properties <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </section>
        </AppLayout>
    );
}
