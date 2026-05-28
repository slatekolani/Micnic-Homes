import { Head, Link, usePage } from '@inertiajs/react';
import { CalendarCheck, Clock, Trophy, ArrowRight, Search } from 'lucide-react';
import AppLayout from '../../../layouts/AppLayout';
import { PageProps } from '../../../types';

interface Props {
    stats: {
        total_bookings: number;
        upcoming_bookings: number;
        completed_stays: number;
    };
}

export default function GuestDashboard({ stats }: Props) {
    const { auth } = usePage<PageProps>().props;
    const user = auth?.user;

    return (
        <AppLayout>
            <Head title="My Dashboard" />

            <div className="bg-navy-950 pt-40 pb-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <p className="text-gold-400 text-sm font-medium mb-1">Welcome back,</p>
                    <h1 className="font-display text-2xl sm:text-3xl font-semibold text-white">{user?.name}</h1>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
                    {[
                        { label: 'Total Bookings', value: stats.total_bookings, icon: CalendarCheck, color: 'bg-navy-900', link: '/dashboard/bookings' },
                        { label: 'Upcoming Stays', value: stats.upcoming_bookings, icon: Clock, color: 'bg-gold-500', link: '/dashboard/bookings' },
                        { label: 'Completed Stays', value: stats.completed_stays, icon: Trophy, color: 'bg-green-600', link: '/dashboard/bookings' },
                    ].map((card) => (
                        <Link key={card.label} href={card.link} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
                            <div className={`w-10 h-10 ${card.color} rounded-xl flex items-center justify-center mb-4`}>
                                <card.icon className="w-5 h-5 text-white" />
                            </div>
                            <p className="text-2xl font-bold text-navy-900 mb-1">{card.value}</p>
                            <p className="text-navy-400 text-sm">{card.label}</p>
                        </Link>
                    ))}
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                    {[
                        { title: 'My Bookings', desc: 'View and manage your booking history', href: '/dashboard/bookings', icon: CalendarCheck },
                        { title: 'Explore Properties', desc: 'Discover new luxury stays', href: '/properties', icon: Search },
                    ].map((action) => (
                        <Link key={action.title} href={action.href}
                            className="group flex items-center gap-4 bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-gold-200 transition-all"
                        >
                            <div className="w-11 h-11 bg-gold-50 rounded-xl flex items-center justify-center group-hover:bg-gold-100 transition-colors shrink-0">
                                <action.icon className="w-5 h-5 text-gold-600" />
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold text-navy-800 text-sm">{action.title}</p>
                                <p className="text-navy-400 text-xs mt-0.5">{action.desc}</p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-navy-300 group-hover:text-gold-500 group-hover:translate-x-1 transition-all shrink-0" />
                        </Link>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
