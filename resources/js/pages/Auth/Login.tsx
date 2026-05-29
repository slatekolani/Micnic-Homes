import { Link, useForm } from '@inertiajs/react';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import { useState } from 'react';
import SeoHead from '../../components/SeoHead';

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/login');
    };

    return (
        <div className="min-h-screen flex">
            <SeoHead title="Admin Login" description="Micnic Homes management portal." noindex />

            {/* Left Panel */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800 relative overflow-hidden items-center justify-center">
                <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-gold-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-1/3 right-1/4 w-60 h-60 bg-gold-400/10 rounded-full blur-3xl" />
                <div className="relative z-10 text-center px-12">
                    <Link href="/" className="inline-flex mb-12 rounded-3xl bg-white p-4 shadow-2xl shadow-black/20">
                        <img src="/MicNic_Logo_Cropped.png" alt="Micnic Villa" className="h-20 w-auto object-contain" />
                    </Link>
                    <h2 className="font-display text-3xl font-semibold text-white mb-4 leading-snug">
                        Your Luxury Escape Awaits
                    </h2>
                    <p className="text-white/60 text-base leading-relaxed">
                        Sign in to access exclusive listings, manage your bookings, and experience world-class hospitality.
                    </p>
                </div>
            </div>

            {/* Right Panel */}
            <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white">
                <div className="w-full max-w-md">
                    {/* Mobile logo */}
                    <div className="lg:hidden text-center mb-8">
                        <Link href="/" className="inline-flex rounded-3xl bg-white p-3 shadow-lg ring-1 ring-gray-100">
                            <img src="/MicNic_Logo_Cropped.png" alt="Micnic Villa" className="h-16 w-auto object-contain" />
                        </Link>
                    </div>

                    <div className="mb-8">
                        <h1 className="font-display text-2xl sm:text-3xl font-semibold text-navy-900 mb-2">Admin Login</h1>
                        <p className="text-navy-400 text-sm">Restricted access — management portal only</p>
                    </div>

                    <form onSubmit={submit} className="space-y-5">
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
                                        errors.email ? 'border-red-400 focus:border-red-400' : 'border-gray-200 focus:border-gold-400'
                                    }`}
                                    required
                                    autoFocus
                                />
                            </div>
                            {errors.email && <p className="mt-1.5 text-xs text-red-500">{errors.email}</p>}
                        </div>

                        {/* Password */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-xs font-semibold text-navy-600 uppercase tracking-wide">Password</label>
                                <a href="#" className="text-xs text-gold-600 hover:text-gold-700 hover:underline">Forgot password?</a>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-300" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="Your password"
                                    className={`w-full pl-11 pr-11 py-3.5 border rounded-xl text-sm text-navy-800 placeholder-navy-300 outline-none transition-colors ${
                                        errors.password ? 'border-red-400 focus:border-red-400' : 'border-gray-200 focus:border-gold-400'
                                    }`}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-navy-300 hover:text-navy-500 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            {errors.password && <p className="mt-1.5 text-xs text-red-500">{errors.password}</p>}
                        </div>

                        {/* Remember */}
                        <div className="flex items-center gap-2">
                            <input
                                id="remember"
                                type="checkbox"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                                className="w-4 h-4 rounded border-gray-300 accent-navy-900"
                            />
                            <label htmlFor="remember" className="text-sm text-navy-600 cursor-pointer">Remember me for 30 days</label>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full flex items-center justify-center gap-2 py-4 bg-navy-900 hover:bg-navy-800 disabled:bg-navy-300 text-white font-semibold rounded-xl transition-all shadow-sm"
                        >
                            <LogIn className="w-4 h-4" />
                            {processing ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <Link href="/" className="text-sm text-navy-400 hover:text-navy-600 transition-colors">
                            ← Back to public site
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
