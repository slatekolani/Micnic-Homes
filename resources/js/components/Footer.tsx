import { Link } from '@inertiajs/react';
import { Mail, Phone, MapPin } from 'lucide-react';

function InstagramIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="2" />
            <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
            <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" />
        </svg>
    );
}

function XLogoIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M14.4 10.5 21 3h-1.6l-5.7 6.5L9.1 3H4l6.9 9.9L4 21h1.6l6-6.9 4.9 6.9H21l-6.6-10.5Zm-2.1 2.4-.7-1L6.1 4.2h2.2l4.5 6.3.7 1 5.8 8.2h-2.2l-4.8-6.8Z" />
        </svg>
    );
}

export default function Footer() {
    return (
        <footer className="bg-navy-950 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
                    {/* Brand */}
                    <div className="lg:col-span-1">
                        <Link href="/" className="inline-flex mb-4 rounded-3xl bg-white p-3 shadow-lg shadow-black/20">
                            <img src="/MicNic_Logo_Cropped.png" alt="Micnic Villa" className="h-16 w-auto object-contain" />
                        </Link>
                        <p className="text-white/60 text-sm leading-relaxed mb-6">
                            Experience luxury living at its finest. Discover handpicked private villas and apartments for your perfect getaway.
                        </p>
                        <div className="flex items-center gap-3">
                            <a
                                href="https://www.instagram.com/micnic.homes?igsh=bjYyM3U5bGpnaDd3"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Instagram"
                                className="w-9 h-9 rounded-full bg-white/10 hover:bg-gold-500 flex items-center justify-center transition-colors"
                            >
                                <InstagramIcon className="w-4 h-4" />
                            </a>
                            <a href="#" aria-label="X" className="w-9 h-9 rounded-full bg-white/10 hover:bg-gold-500 flex items-center justify-center transition-colors">
                                <XLogoIcon className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* Explore */}
                    <div>
                        <h4 className="text-sm font-semibold uppercase tracking-widest text-gold-400 mb-5">Explore</h4>
                        <ul className="space-y-3">
                            {[
                                { label: 'All Properties',  href: '/properties' },
                                { label: 'Villas',          href: '/properties?type=villa' },
                                { label: 'Apartments',      href: '/properties?type=apartment' },
                                { label: 'Penthouses',      href: '/properties?type=penthouse' },
                            ].map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href} className="text-white/60 hover:text-gold-400 text-sm transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="text-sm font-semibold uppercase tracking-widest text-gold-400 mb-5">Company</h4>
                        <ul className="space-y-3">
                            {[
                                { label: 'Properties',    href: '/properties' },
                                { label: 'About Us',     href: '/about' },
                                { label: 'Contact',      href: '/contact' },
                            ].map((link) => (
                                <li key={link.label}>
                                    <Link href={link.href} className="text-white/60 hover:text-gold-400 text-sm transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-sm font-semibold uppercase tracking-widest text-gold-400 mb-5">Contact Us</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <MapPin className="w-4 h-4 text-gold-400 mt-0.5 shrink-0" />
                                <span className="text-white/60 text-sm">Dar es Salaam, Tanzania</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="w-4 h-4 text-gold-400 shrink-0" />
                                <a href="tel:+255620188878" className="text-white/60 hover:text-gold-400 text-sm transition-colors">
                                    0787 070 909
                                </a>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="w-4 h-4 text-gold-400 shrink-0" />
                                <a href="mailto:info@micnichomes.co.tz" className="text-white/60 hover:text-gold-400 text-sm transition-colors">
                                    info@micnichomes.co.tz
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-white/40 text-xs">
                        Built with love by{' '}
                        <a
                            href="https://nextbyte.co.tz/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-semibold text-white/70 transition-colors hover:text-gold-400"
                        >
                            NextByte ICT Solutions
                        </a>
                        .
                    </p>
                    <div className="flex items-center gap-6">
                        <a href="#" className="text-white/40 hover:text-white/70 text-xs transition-colors">Privacy Policy</a>
                        <a href="#" className="text-white/40 hover:text-white/70 text-xs transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
