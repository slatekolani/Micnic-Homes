import { Link, useForm } from '@inertiajs/react';
import { User, Mail, Lock, Phone, Eye, EyeOff, UserPlus, Building2, Home } from 'lucide-react';
import { useState } from 'react';
import SeoHead from '../../components/SeoHead';

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
        role: 'guest' as 'guest' | 'owner',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/register');
    };

    return (
        <div className="min-h-screen flex">
            <SeoHead title="Create Account" description="Create a Micnic Homes account." noindex />

            {/* Left Panel */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800 relative overflow-hidden items-center justify-center">
                <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-gold-500/10 rounded-full blur-3xl" />
                <div className="relative z-10 text-center px-12">
                    <Link href="/" className="inline-flex mb-12">
                        <img src="/MicNic_Logo.png" alt="Micnic Villa" className="h-24 w-24 rounded-full object-contain" />
                    </Link>
                    <h2 className="font-display text-3xl font-semibold text-white mb-4 leading-snug">
                        Join Our Exclusive Community
                    </h2>
                    <p className="text-white/60 text-base leading-relaxed mb-10">
                        Whether you're a traveller seeking luxury escapes or a property owner looking to earn premium income — you're in the right place.
                    </p>
                    <div className="space-y-4">
                        {[
                            '✓ Free to join — no hidden fees',
                            '✓ Instant access to 500+ luxury properties',
                            '✓ 24/7 dedicated concierge support',
                            '✓ Secure, verified bookings',
                        ].map((item) => (
                            <p key={item} className="text-white/70 text-sm text-left">{item}</p>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Panel */}
            <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white overflow-y-auto">
                <div className="w-full max-w-md">
                    {/* Mobile logo */}
                    <div className="lg:hidden text-center mb-8">
                        <Link href="/" className="inline-flex">
                            <img src="/MicNic_Logo.png" alt="Micnic Villa" className="h-20 w-20 rounded-full object-contain" />
                        </Link>
                    </div>

                    <div className="mb-8">
                        <h1 className="font-display text-2xl sm:text-3xl font-semibold text-navy-900 mb-2">Create your account</h1>
                        <p className="text-navy-400 text-sm">Start your luxury journey today</p>
                    </div>

                    {/* Account Type */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                        {[
                            { value: 'guest', label: 'I\'m a Guest', sub: 'Browse & book properties', icon: Home },
                            { value: 'owner', label: 'I\'m an Owner', sub: 'List my properties', icon: Building2 },
                        ].map(({ value, label, sub, icon: Icon }) => (
                            <button
                                key={value}
                                type="button"
                                onClick={() => setData('role', value as 'guest' | 'owner')}
                                className={`p-4 border-2 rounded-xl text-left transition-all ${
                                    data.role === value
                                        ? 'border-navy-900 bg-navy-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                }`}
                            >
                                <Icon className={`w-5 h-5 mb-2 ${data.role === value ? 'text-navy-700' : 'text-navy-300'}`} />
                                <p className={`text-sm font-semibold ${data.role === value ? 'text-navy-800' : 'text-navy-600'}`}>{label}</p>
                                <p className="text-xs text-navy-400 mt-0.5">{sub}</p>
                            </button>
                        ))}
                    </div>

                    <form onSubmit={submit} className="space-y-4">
                        {/* Name */}
                        <div>
                            <label className="block text-xs font-semibold text-navy-600 uppercase tracking-wide mb-2">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-300" />
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Aida Aldan"
                                    className={`w-full pl-11 pr-4 py-3.5 border rounded-xl text-sm text-navy-800 placeholder-navy-300 outline-none transition-colors ${
                                        errors.name ? 'border-red-400' : 'border-gray-200 focus:border-gold-400'
                                    }`}
                                    required
                                />
                            </div>
                            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-xs font-semibold text-navy-600 uppercase tracking-wide mb-2">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-300" />
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="your@email.com"
                                    className={`w-full pl-11 pr-4 py-3.5 border rounded-xl text-sm text-navy-800 placeholder-navy-300 outline-none transition-colors ${
                                        errors.email ? 'border-red-400' : 'border-gray-200 focus:border-gold-400'
                                    }`}
                                    required
                                />
                            </div>
                            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-xs font-semibold text-navy-600 uppercase tracking-wide mb-2">
                                Phone <span className="text-navy-300 font-normal normal-case">— optional</span>
                            </label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-300" />
                                <input
                                    type="tel"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    placeholder="+1 (555) 000-0000"
                                    className="w-full pl-11 pr-4 py-3.5 border border-gray-200 focus:border-gold-400 rounded-xl text-sm text-navy-800 placeholder-navy-300 outline-none transition-colors"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-xs font-semibold text-navy-600 uppercase tracking-wide mb-2">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-300" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="At least 8 characters"
                                    className={`w-full pl-11 pr-11 py-3.5 border rounded-xl text-sm text-navy-800 placeholder-navy-300 outline-none transition-colors ${
                                        errors.password ? 'border-red-400' : 'border-gray-200 focus:border-gold-400'
                                    }`}
                                    required
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-navy-300 hover:text-navy-500">
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-xs font-semibold text-navy-600 uppercase tracking-wide mb-2">Confirm Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-300" />
                                <input
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    placeholder="Confirm your password"
                                    className="w-full pl-11 pr-4 py-3.5 border border-gray-200 focus:border-gold-400 rounded-xl text-sm text-navy-800 placeholder-navy-300 outline-none transition-colors"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full flex items-center justify-center gap-2 py-4 bg-gold-500 hover:bg-gold-600 disabled:bg-gold-300 text-white font-semibold rounded-xl transition-all shadow-md"
                        >
                            <UserPlus className="w-4 h-4" />
                            {processing ? 'Creating account...' : 'Create Account'}
                        </button>
                    </form>

                    <p className="text-center text-sm text-navy-400 mt-5">
                        Already have an account?{' '}
                        <Link href="/login" className="text-navy-700 font-semibold hover:underline">Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
