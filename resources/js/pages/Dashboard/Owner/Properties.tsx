import { Head, Link, router } from '@inertiajs/react';
import { PlusCircle, Edit, Trash2, Eye, MapPin, BedDouble, Users, Star, ToggleLeft } from 'lucide-react';
import AppLayout from '../../../layouts/AppLayout';
import { Property } from '../../../types';

interface Props {
    properties: Property[];
}

const statusColors: Record<string, string> = {
    active:   'bg-green-100 text-green-700',
    draft:    'bg-gray-100 text-gray-600',
    inactive: 'bg-red-100 text-red-600',
};

export default function OwnerProperties({ properties }: Props) {
    const deleteProperty = (id: number) => {
        if (window.confirm('Delete this property? This cannot be undone.')) {
            router.delete(`/owner/properties/${id}`);
        }
    };

    return (
        <AppLayout>
            <Head title="My Properties" />

            <div className="bg-navy-950 pt-40 pb-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-2 text-white/50 text-sm mb-3">
                                <Link href="/owner" className="hover:text-gold-400 transition-colors">Dashboard</Link>
                                <span>/</span>
                                <span className="text-white/80">Properties</span>
                            </div>
                            <h1 className="font-display text-2xl sm:text-3xl font-semibold text-white">My Properties</h1>
                        </div>
                        <Link
                            href="/owner/properties/create"
                            className="flex items-center gap-2 px-5 py-3 bg-gold-500 hover:bg-gold-600 text-white rounded-xl text-sm font-semibold transition-all"
                        >
                            <PlusCircle className="w-4 h-4" />
                            Add Property
                        </Link>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {properties.length === 0 ? (
                    <div className="text-center py-24 bg-white rounded-2xl border border-gray-100">
                        <div className="text-6xl mb-4">🏠</div>
                        <h3 className="font-display text-xl font-semibold text-navy-800 mb-2">No properties yet</h3>
                        <p className="text-navy-400 text-sm mb-6">Start earning by listing your first property</p>
                        <Link href="/owner/properties/create" className="inline-flex items-center gap-2 px-6 py-3 bg-navy-900 text-white rounded-xl text-sm font-semibold hover:bg-navy-800 transition-all">
                            <PlusCircle className="w-4 h-4" /> List Your First Property
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {properties.map((property) => {
                            const primaryImage = property.images?.[0];
                            return (
                                <div key={property.id} className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row gap-4">
                                    {/* Thumbnail */}
                                    <div className="w-full sm:w-28 h-28 rounded-xl overflow-hidden bg-navy-100 shrink-0">
                                        {primaryImage ? (
                                            <img src={primaryImage.url} alt={property.title} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-3xl">🏠</div>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-3 flex-wrap">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="font-semibold text-navy-800 text-base truncate">{property.title}</h3>
                                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[property.status]}`}>
                                                        {property.status}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1.5 text-navy-400 text-sm mb-2">
                                                    <MapPin className="w-3.5 h-3.5" />
                                                    <span>{property.city}, {property.country}</span>
                                                </div>
                                                <div className="flex items-center gap-4 text-xs text-navy-500">
                                                    <span className="flex items-center gap-1"><BedDouble className="w-3.5 h-3.5" /> {property.bedrooms} beds</span>
                                                    <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {property.max_guests} guests</span>
                                                    {property.avg_rating > 0 && (
                                                        <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-gold-400 fill-gold-400" /> {property.avg_rating.toFixed(1)}</span>
                                                    )}
                                                    <span className="font-semibold text-navy-700">{property.currency} {property.price_per_night.toLocaleString()}/night</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex sm:flex-col items-center gap-2 shrink-0">
                                        <Link
                                            href={`/properties/${property.slug}`}
                                            target="_blank"
                                            className="flex items-center gap-1.5 px-3 py-2 bg-navy-50 hover:bg-navy-100 text-navy-600 rounded-lg text-xs font-medium transition-colors"
                                        >
                                            <Eye className="w-3.5 h-3.5" /> View
                                        </Link>
                                        <Link
                                            href={`/owner/properties/${property.id}/edit`}
                                            className="flex items-center gap-1.5 px-3 py-2 bg-gold-50 hover:bg-gold-100 text-gold-700 rounded-lg text-xs font-medium transition-colors"
                                        >
                                            <Edit className="w-3.5 h-3.5" /> Edit
                                        </Link>
                                        <button
                                            onClick={() => deleteProperty(property.id)}
                                            className="flex items-center gap-1.5 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-medium transition-colors"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" /> Delete
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
