import { Head, Link, usePage } from '@inertiajs/react';
import { Building2, CalendarCheck, Clock, PlusCircle, ArrowRight, TrendingUp } from 'lucide-react';
import AppLayout from '../../../layouts/AppLayout';
import { PageProps } from '../../../types';

interface Props {
    stats: {
        total_properties: number;
        active_listings: number;
        total_bookings: number;
        pending_bookings: number;
    };
}

export default function OwnerDashboardIndex({ stats }: Props) {
    const { auth } = usePage<PageProps>().props;
    const user = auth?.user;

    const cards = [
        {
            label: 'Total Properties',
            value: stats.total_properties,
            icon: Building2,
            color: 'bg-navy-900',
            link: '/owner/properties',
        },
        {
            label: 'Active Listings',
            value: stats.active_listings,
            icon: TrendingUp,
            color: 'bg-green-600',
            link: '/owner/properties',
        },
        {
            label: 'Total Bookings',
            value: stats.total_bookings,
            icon: CalendarCheck,
            color: 'bg-gold-500',
            link: '/owner/bookings',
        },
        {
            label: 'Pending Bookings',
            value: stats.pending_bookings,
            icon: Clock,
            color: 'bg-amber-500',
            link: '/owner/bookings',
        },
    ];

    return (
        <AppLayout>
            <Head title="Owner Dashboard" />

            <div className="bg-navy-950 pt-40 pb-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gold-400 text-sm font-medium mb-1">Welcome back,</p>
                            <h1 className="font-display text-2xl sm:text-3xl font-semibold text-white">{user?.name}</h1>
                        </div>
                        <Link
                            href="/owner/properties/create"
                            className="flex items-center gap-2 px-5 py-3 bg-gold-500 hover:bg-gold-600 text-white rounded-xl text-sm font-semibold transition-all shadow-md"
                        >
                            <PlusCircle className="w-4 h-4" />
                            List Property
                        </Link>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                    {cards.map((card) => (
                        <Link key={card.label} href={card.link} className="group bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
                            <div className={`w-10 h-10 ${card.color} rounded-xl flex items-center justify-center mb-4`}>
                                <card.icon className="w-5 h-5 text-white" />
                            </div>
                            <p className="text-2xl sm:text-3xl font-bold text-navy-900 mb-1">{card.value}</p>
                            <p className="text-navy-400 text-xs sm:text-sm">{card.label}</p>
                        </Link>
                    ))}
                </div>

                {/* Quick Actions */}
                <div className="grid sm:grid-cols-3 gap-4">
                    {[
                        { title: 'My Properties', desc: 'View and manage all your listings', href: '/owner/properties', icon: Building2 },
                        { title: 'Manage Bookings', desc: 'Confirm or cancel booking requests', href: '/owner/bookings', icon: CalendarCheck },
                        { title: 'List New Property', desc: 'Add a new property to your portfolio', href: '/owner/properties/create', icon: PlusCircle },
                    ].map((action) => (
                        <Link
                            key={action.title}
                            href={action.href}
                            className="group flex items-center gap-4 bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-gold-200 transition-all"
                        >
                            <div className="w-11 h-11 bg-gold-50 rounded-xl flex items-center justify-center group-hover:bg-gold-100 transition-colors shrink-0">
                                <action.icon className="w-5 h-5 text-gold-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-navy-800 text-sm">{action.title}</p>
                                <p className="text-navy-400 text-xs mt-0.5 truncate">{action.desc}</p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-navy-300 group-hover:text-gold-500 group-hover:translate-x-1 transition-all shrink-0" />
                        </Link>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
