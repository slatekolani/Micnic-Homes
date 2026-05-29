import { useState, useEffect } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import {
    Menu,
    X,
    LogOut,
    LayoutDashboard,
    Building2,
    ChevronDown,
    Home,
    Mail,
    Search,
} from 'lucide-react';
import { PageProps } from '../types';

export default function Navbar() {
    const { auth } = usePage<PageProps>().props;
    const user = auth?.user;
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        document.body.style.overflow = mobileOpen ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [mobileOpen]);

    const closeMobileMenu = () => setMobileOpen(false);
    const logout = () => {
        closeMobileMenu();
        router.post('/logout');
    };
    const dashboardHref = user?.role === 'guest' ? '/dashboard' : '/owner';
    const canManageProperties = user?.role === 'admin' || user?.role === 'owner';

    const navItems = [
        { href: '/properties', label: 'Properties', detail: 'Explore stays', icon: Search },
        { href: '/about', label: 'About', detail: 'Our experience', icon: Building2 },
        { href: '/contact', label: 'Contact', detail: 'Talk to us', icon: Mail },
    ];
    const desktopLinkClass = scrolled
        ? 'rounded-full px-4 py-2 text-sm font-semibold text-navy-700 transition-all hover:bg-white hover:text-gold-600 hover:shadow-sm'
        : 'relative text-sm font-medium text-navy-700 transition-colors hover:text-gold-500 after:absolute after:-bottom-2 after:left-1/2 after:h-1 after:w-1 after:-translate-x-1/2 after:rounded-full after:bg-brand-red after:opacity-0 after:transition-opacity hover:after:opacity-100';

    return (
        <nav className="fixed left-0 right-0 top-3 z-50 px-3 transition-all duration-500 ease-out sm:px-6">
            <div className="mx-auto max-w-7xl rounded-full border border-white/70 bg-white/90 px-4 shadow-2xl shadow-navy-950/10 backdrop-blur-xl transition-all duration-500 ease-out sm:px-6 lg:px-8">
                <div className={`flex items-center justify-between transition-all duration-500 ease-out ${
                    scrolled ? 'h-20' : 'h-28'
                }`}>
                    {/* Logo */}
                    <Link href="/" className="flex items-center">
                        <img
                            src="/MicNic_Logo_Cropped.png"
                            alt="Micnic Villa"
                            className={`w-auto object-contain transition-all duration-500 ease-out ${
                                scrolled ? 'h-16' : 'h-24'
                            }`}
                        />
                    </Link>

                    {/* Desktop Nav */}
                    <div className={`hidden items-center transition-all duration-500 md:flex ${
                        scrolled ? 'gap-2 rounded-full bg-navy-50/80 p-1.5' : 'gap-8 bg-transparent p-0'
                    }`}>
                        <Link href="/properties" className={desktopLinkClass}>
                            Properties
                        </Link>
                        <Link href="/about" className={desktopLinkClass}>
                            About
                        </Link>
                        <Link href="/contact" className={desktopLinkClass}>
                            Contact
                        </Link>
                    </div>

                    {/* Desktop Account */}
                    <div className="hidden md:flex items-center gap-3">
                        {user && (
                            <div className="relative">
                                <button
                                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                                    className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-navy-50 text-navy-900 hover:bg-navy-100 transition-all"
                                >
                                    <div className="w-7 h-7 rounded-full bg-gold-500 flex items-center justify-center text-white text-xs font-bold">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <span>{user.name.split(' ')[0]}</span>
                                    <ChevronDown className="w-4 h-4" />
                                </button>
                                {userMenuOpen && (
                                    <div className="absolute right-0 top-12 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
                                        <Link href={dashboardHref} className="flex items-center gap-3 px-4 py-3 text-sm text-navy-700 hover:bg-navy-50 transition-colors" onClick={() => setUserMenuOpen(false)}>
                                            <LayoutDashboard className="w-4 h-4 text-navy-400" />
                                            Dashboard
                                        </Link>
                                        {canManageProperties && (
                                            <Link href="/owner/properties/create" className="flex items-center gap-3 px-4 py-3 text-sm text-navy-700 hover:bg-navy-50 transition-colors" onClick={() => setUserMenuOpen(false)}>
                                                <Building2 className="w-4 h-4 text-navy-400" />
                                                List Property
                                            </Link>
                                        )}
                                        <hr className="my-1 border-gray-100" />
                                        <button onClick={logout} className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors">
                                            <LogOut className="w-4 h-4" />
                                            Sign Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Mobile toggle */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className={`md:hidden inline-flex items-center justify-center rounded-full border border-navy-100 bg-white text-navy-900 shadow-sm transition-all duration-300 hover:border-gold-300 hover:text-gold-600 ${
                            scrolled ? 'h-10 w-10' : 'h-11 w-11'
                        }`}
                        aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                        aria-expanded={mobileOpen}
                    >
                        {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {mobileOpen && (
                <div className={`md:hidden fixed inset-x-0 bottom-0 z-40 transition-all duration-500 ${
                    scrolled ? 'top-24' : 'top-28'
                }`}>
                    <button
                        type="button"
                        className="absolute inset-0 bg-navy-950/45 backdrop-blur-sm"
                        aria-label="Close menu"
                        onClick={closeMobileMenu}
                    />
                    <div className="relative mx-3 mt-3 overflow-hidden rounded-[1.75rem] border border-white/70 bg-white shadow-2xl">
                        <div className="bg-navy-950 px-5 py-5 text-white">
                            <p className="text-sm font-semibold tracking-[0.22em] uppercase text-gold-300">Menu</p>
                            <p className="mt-1 text-sm text-white/60">Private stays, curated beautifully.</p>
                        </div>

                        <div className="max-h-[calc(100vh-12rem)] overflow-y-auto px-4 py-4">
                            <div className="grid gap-2">
                                <Link
                                    href="/"
                                    className="flex items-center gap-3 rounded-2xl border border-navy-100 bg-navy-50 px-4 py-3.5 text-navy-900 transition-all hover:border-gold-200 hover:bg-gold-50"
                                    onClick={closeMobileMenu}
                                >
                                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-navy-700 shadow-sm">
                                        <Home className="h-5 w-5" />
                                    </span>
                                    <span className="min-w-0">
                                        <span className="block text-sm font-semibold">Home</span>
                                        <span className="block text-xs text-navy-400">Featured escapes</span>
                                    </span>
                                </Link>

                                {navItems.map(({ href, label, detail, icon: Icon }) => (
                                    <Link
                                        key={href}
                                        href={href}
                                        className="flex items-center gap-3 rounded-2xl px-4 py-3.5 text-navy-800 transition-all hover:bg-navy-50"
                                        onClick={closeMobileMenu}
                                    >
                                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-50 text-gold-700">
                                            <Icon className="h-5 w-5" />
                                        </span>
                                        <span className="min-w-0">
                                            <span className="block text-sm font-semibold">{label}</span>
                                            <span className="block text-xs text-navy-400">{detail}</span>
                                        </span>
                                    </Link>
                                ))}
                            </div>

                            <div className="my-4 h-px bg-gray-100" />

                            {user ? (
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 rounded-2xl bg-navy-50 px-4 py-3">
                                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gold-500 text-sm font-bold text-white">
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-semibold text-navy-900">{user.name}</p>
                                            <p className="text-xs capitalize text-navy-400">{user.role}</p>
                                        </div>
                                    </div>

                                    <Link
                                        href={dashboardHref}
                                        className="flex items-center justify-center gap-2 rounded-2xl bg-navy-900 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-navy-900/20 transition-all hover:bg-navy-800"
                                        onClick={closeMobileMenu}
                                    >
                                        <LayoutDashboard className="h-4 w-4" />
                                        Dashboard
                                    </Link>
                                    {canManageProperties && (
                                        <Link
                                            href="/owner/properties/create"
                                            className="flex items-center justify-center gap-2 rounded-2xl border border-gold-200 bg-gold-50 px-4 py-3.5 text-sm font-semibold text-gold-800 transition-all hover:bg-gold-100"
                                            onClick={closeMobileMenu}
                                        >
                                            <Building2 className="h-4 w-4" />
                                            List Property
                                        </Link>
                                    )}
                                    <button
                                        onClick={logout}
                                        className="flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold text-red-600 transition-all hover:bg-red-50"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        Sign Out
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <Link
                                        href="/properties"
                                        className="flex items-center justify-center gap-2 rounded-2xl bg-navy-900 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-navy-900/20 transition-all hover:bg-navy-800"
                                        onClick={closeMobileMenu}
                                    >
                                        <Search className="h-4 w-4" />
                                        Browse Properties
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
