import { PropsWithChildren, useEffect, useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { ChevronRight, Home } from 'lucide-react';
import { Booking, PageProps, Property } from '../types';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const WHATSAPP_URL = 'https://wa.me/255787070909';

interface BreadcrumbItem {
    label: string;
    href?: string;
}

function WhatsAppIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
            <path d="M16.02 3.2A12.76 12.76 0 0 0 5.07 22.5L3.5 28.8l6.46-1.5a12.72 12.72 0 0 0 6.06 1.54h.01A12.82 12.82 0 0 0 28.8 16.06 12.8 12.8 0 0 0 16.02 3.2Zm0 23.48h-.01a10.6 10.6 0 0 1-5.39-1.47l-.39-.23-3.82.89.91-3.73-.25-.38A10.58 10.58 0 1 1 16.02 26.68Zm5.8-7.93c-.32-.16-1.89-.93-2.18-1.04-.29-.1-.5-.16-.71.16-.21.32-.82 1.04-1 1.25-.18.21-.37.24-.69.08-.32-.16-1.35-.5-2.56-1.58a9.58 9.58 0 0 1-1.77-2.2c-.18-.32-.02-.49.14-.65.14-.14.32-.37.48-.55.16-.19.21-.32.32-.53.1-.21.05-.4-.03-.55-.08-.16-.71-1.71-.97-2.34-.26-.62-.52-.53-.71-.54h-.61c-.21 0-.55.08-.84.4-.29.32-1.1 1.07-1.1 2.61 0 1.54 1.13 3.03 1.29 3.24.16.21 2.22 3.39 5.38 4.76.75.32 1.34.51 1.79.65.75.24 1.44.2 1.98.12.6-.09 1.89-.77 2.16-1.52.27-.75.27-1.39.19-1.52-.08-.13-.29-.21-.61-.37Z" />
        </svg>
    );
}

function titleCase(value: string) {
    return value
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase());
}

function getPathname(location?: string) {
    try {
        return new URL(location || '/', 'https://micnichomes.local').pathname;
    } catch {
        return '/';
    }
}

function buildBreadcrumbs(props: PageProps): BreadcrumbItem[] {
    const pathname = getPathname(props.ziggy?.location);

    if (pathname === '/' || pathname === '/login' || pathname === '/register') {
        return [];
    }

    const property = props.property as Property | undefined;
    const booking = props.booking as Booking | undefined;
    const crumbs: BreadcrumbItem[] = [{ label: 'Home', href: '/' }];

    if (pathname === '/about') {
        return [...crumbs, { label: 'About' }];
    }

    if (pathname === '/contact') {
        return [...crumbs, { label: 'Contact' }];
    }

    if (pathname === '/properties') {
        return [...crumbs, { label: 'Properties' }];
    }

    if (pathname.startsWith('/properties/')) {
        return [
            ...crumbs,
            { label: 'Properties', href: '/properties' },
            { label: property?.title || titleCase(pathname.split('/').filter(Boolean).slice(-1)[0] || 'Property') },
        ];
    }

    if (pathname.startsWith('/booking/confirmation/')) {
        return [
            ...crumbs,
            { label: 'Properties', href: '/properties' },
            { label: booking?.reference ? `Request ${booking.reference}` : 'Booking Request Sent' },
        ];
    }

    if (pathname === '/owner') {
        return [...crumbs, { label: 'Dashboard' }];
    }

    if (pathname.startsWith('/owner')) {
        const ownerCrumbs = [...crumbs, { label: 'Dashboard', href: '/owner' }];

        if (pathname === '/owner/properties') {
            return [...ownerCrumbs, { label: 'Properties' }];
        }

        if (pathname === '/owner/properties/create') {
            return [...ownerCrumbs, { label: 'Properties', href: '/owner/properties' }, { label: 'List New Property' }];
        }

        if (pathname.includes('/owner/properties/') && pathname.endsWith('/edit')) {
            return [...ownerCrumbs, { label: 'Properties', href: '/owner/properties' }, { label: property?.title || 'Edit Property' }];
        }

        if (pathname === '/owner/bookings') {
            return [...ownerCrumbs, { label: 'Bookings' }];
        }
    }

    const fallback = pathname.split('/').filter(Boolean).map((segment, index, segments) => ({
        label: titleCase(segment),
        href: index === segments.length - 1 ? undefined : `/${segments.slice(0, index + 1).join('/')}`,
    }));

    return [...crumbs, ...fallback];
}

function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
    if (items.length === 0) return null;

    return (
        <div className="pointer-events-none absolute inset-x-0 top-36 z-30 px-4 sm:top-40 sm:px-6 lg:px-8">
            <nav
                aria-label="Breadcrumb"
                className="pointer-events-auto mx-auto flex max-w-7xl items-center overflow-x-auto rounded-full border border-white/15 bg-navy-950/55 px-2 py-2 text-xs shadow-2xl shadow-navy-950/20 backdrop-blur-xl md:w-fit"
            >
                <ol className="flex min-w-0 items-center gap-1 whitespace-nowrap">
                    {items.map((item, index) => {
                        const isLast = index === items.length - 1;

                        return (
                            <li key={`${item.label}-${index}`} className="flex items-center gap-1">
                                {index > 0 && <ChevronRight className="h-3.5 w-3.5 shrink-0 text-white/35" />}
                                {item.href && !isLast ? (
                                    <Link href={item.href} className="inline-flex items-center gap-1 rounded-full px-2.5 py-1.5 font-semibold text-white/70 transition-all hover:bg-white/10 hover:text-gold-300">
                                        {index === 0 && <Home className="h-3.5 w-3.5" />}
                                        <span>{item.label}</span>
                                    </Link>
                                ) : (
                                    <span className="inline-flex min-w-0 items-center gap-1 rounded-full bg-white px-2.5 py-1.5 font-semibold text-navy-900 shadow-sm">
                                        {index === 0 && <Home className="h-3.5 w-3.5" />}
                                        <span className="truncate">{item.label}</span>
                                    </span>
                                )}
                            </li>
                        );
                    })}
                </ol>
            </nav>
        </div>
    );
}

export default function AppLayout({ children }: PropsWithChildren) {
    const page = usePage<PageProps>();
    const { flash } = page.props;
    const breadcrumbs = buildBreadcrumbs(page.props);
    const [toast, setToast] = useState<string | null>(null);
    const [hasScrolled, setHasScrolled] = useState(false);

    const [toastType, setToastType] = useState<'success' | 'error'>('success');

    useEffect(() => {
        const updateScrollState = () => setHasScrolled(window.scrollY > 40);

        updateScrollState();
        window.addEventListener('scroll', updateScrollState, { passive: true });

        return () => window.removeEventListener('scroll', updateScrollState);
    }, []);

    useEffect(() => {
        if (flash?.success) {
            setToast(flash.success);
            setToastType('success');
            const t = setTimeout(() => setToast(null), 4500);
            return () => clearTimeout(t);
        }
        if (flash?.error) {
            setToast(flash.error);
            setToastType('error');
            const t = setTimeout(() => setToast(null), 5000);
            return () => clearTimeout(t);
        }
    }, [flash?.success, flash?.error]);

    return (
        <div className="relative min-h-screen flex flex-col bg-white">
            <Navbar />
            <Breadcrumbs items={breadcrumbs} />
            <main className="flex-1">
                {children}
            </main>
            <Footer />

            <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat with Micnic Homes on WhatsApp"
                className={`group fixed bottom-5 right-5 z-40 flex h-14 items-center overflow-hidden rounded-full bg-[#25D366] text-white shadow-2xl shadow-green-900/25 transition-all duration-500 ease-out hover:-translate-y-1 hover:bg-[#1fb958] focus:outline-none focus:ring-4 focus:ring-green-200 sm:bottom-6 sm:right-6 ${
                    hasScrolled ? 'w-40 px-4' : 'w-14 px-0'
                }`}
            >
                <span className="flex h-14 w-14 shrink-0 items-center justify-center">
                    <WhatsAppIcon className="h-8 w-8" />
                </span>
                <span
                    className={`whitespace-nowrap pr-1 text-sm font-semibold transition-all duration-500 ${
                        hasScrolled ? 'translate-x-0 opacity-100' : '-translate-x-3 opacity-0'
                    }`}
                >
                    WhatsApp
                </span>
            </a>

            {/* Toast */}
            {toast && (
                <div className={`fixed bottom-24 right-5 z-50 px-5 py-4 rounded-xl shadow-2xl flex items-center gap-3 max-w-sm sm:right-6 ${
                    toastType === 'error' ? 'bg-red-600 text-white' : 'bg-navy-900 text-white'
                }`}>
                    {toastType === 'error' ? (
                        <svg className="w-5 h-5 text-red-200 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v4m0 4h.01M12 3a9 9 0 110 18A9 9 0 0112 3z" />
                        </svg>
                    ) : (
                        <svg className="w-5 h-5 text-gold-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    )}
                    <span className="text-sm font-medium flex-1">{toast}</span>
                    <button onClick={() => setToast(null)} className="ml-1 opacity-60 hover:opacity-100 text-lg leading-none">✕</button>
                </div>
            )}
        </div>
    );
}
