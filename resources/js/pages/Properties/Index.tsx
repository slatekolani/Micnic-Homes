import { Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { Search, SlidersHorizontal, X, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import AppLayout from '../../layouts/AppLayout';
import PropertyCard from '../../components/PropertyCard';
import DatabaseHero from '../../components/DatabaseHero';
import SeoHead, { SITE_URL } from '../../components/SeoHead';
import { MarketingImage, Property, PaginatedData } from '../../types';

interface Props {
    properties: PaginatedData<Property>;
    filters: {
        search?: string;
        type?: string;
        min_price?: string;
        max_price?: string;
        bedrooms?: string;
        guests?: string;
        sort?: string;
        featured?: string;
    };
    heroImages: MarketingImage[];
}

const propertyTypes = ['villa', 'apartment', 'cottage', 'penthouse', 'chalet', 'bungalow', 'studio'];
const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
];

export default function PropertiesIndex({ properties, filters, heroImages }: Props) {
    const [showFilters, setShowFilters] = useState(false);
    const [localFilters, setLocalFilters] = useState(filters);

    const applyFilters = () => {
        const params: Record<string, string> = {};
        Object.entries(localFilters).forEach(([k, v]) => { if (v) params[k] = v; });
        router.get('/properties', params, { preserveState: true });
        setShowFilters(false);
    };

    const clearFilters = () => {
        setLocalFilters({});
        router.get('/properties', {});
    };

    const hasFilters = Object.values(filters).some(Boolean);

    return (
        <AppLayout>
            <SeoHead
                title="Browse Apartments, Villas & Premium Stays"
                description="Explore Micnic Homes properties including serviced apartments, private villas, penthouses and furnished short-stay homes in Dar es Salaam, Zanzibar and Tanzania."
                canonicalPath="/properties"
                image={heroImages[0]?.url || properties.data[0]?.images?.[0]?.url}
                keywords={[
                    'browse properties Tanzania',
                    'apartments Dar es Salaam',
                    'serviced apartments Tanzania',
                    'private villas for rent Tanzania',
                    'furnished apartment booking',
                    'holiday homes Zanzibar',
                ]}
                structuredData={{
                    '@context': 'https://schema.org',
                    '@type': 'ItemList',
                    name: 'Micnic Homes Properties',
                    url: `${SITE_URL}/properties`,
                    itemListElement: properties.data.map((property, index) => ({
                        '@type': 'ListItem',
                        position: index + 1,
                        url: `${SITE_URL}/properties/${property.slug}`,
                        name: property.title,
                    })),
                }}
            />

            {/* Header */}
            <DatabaseHero images={heroImages}>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <h1 className="font-display text-3xl sm:text-4xl font-semibold text-white mb-3">
                        Luxury Properties
                    </h1>
                </div>
            </DatabaseHero>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* Search + Controls */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-8">
                    {/* Search */}
                    <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-3 flex-1 shadow-sm">
                        <Search className="w-4 h-4 text-navy-400 shrink-0" />
                        <input
                            type="text"
                            value={localFilters.search || ''}
                            onChange={(e) => setLocalFilters({ ...localFilters, search: e.target.value })}
                            onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                            placeholder="Search by location, title..."
                            className="flex-1 text-sm text-navy-800 placeholder-navy-300 outline-none bg-transparent"
                        />
                    </div>

                    {/* Sort */}
                    <select
                        value={localFilters.sort || 'newest'}
                        onChange={(e) => {
                            const updated = { ...localFilters, sort: e.target.value };
                            setLocalFilters(updated);
                            const params: Record<string, string> = {};
                            Object.entries(updated).forEach(([k, v]) => { if (v) params[k] = v; });
                            router.get('/properties', params, { preserveState: true });
                        }}
                        className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-navy-700 outline-none shadow-sm"
                    >
                        {sortOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>

                    {/* Filter toggle */}
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all border shadow-sm ${
                            hasFilters
                                ? 'bg-gold-500 text-white border-gold-500'
                                : 'bg-white text-navy-700 border-gray-200 hover:border-navy-300'
                        }`}
                    >
                        <SlidersHorizontal className="w-4 h-4" />
                        Filters {hasFilters && '•'}
                    </button>

                    {hasFilters && (
                        <button onClick={clearFilters} className="flex items-center gap-1.5 text-sm text-navy-400 hover:text-red-500 transition-colors">
                            <X className="w-4 h-4" /> Clear
                        </button>
                    )}
                </div>

                {/* Filters Panel */}
                {showFilters && (
                    <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-8 shadow-sm">
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
                            {/* Type */}
                            <div className="col-span-2 sm:col-span-1 lg:col-span-2">
                                <label className="block text-xs font-semibold text-navy-500 uppercase tracking-wide mb-2">Property Type</label>
                                <div className="flex flex-wrap gap-2">
                                    {propertyTypes.map((type) => (
                                        <button
                                            key={type}
                                            onClick={() => setLocalFilters({
                                                ...localFilters,
                                                type: localFilters.type === type ? '' : type,
                                            })}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${
                                                localFilters.type === type
                                                    ? 'bg-navy-900 text-white'
                                                    : 'bg-navy-50 text-navy-600 hover:bg-navy-100'
                                            }`}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Price Range */}
                            <div>
                                <label className="block text-xs font-semibold text-navy-500 uppercase tracking-wide mb-2">Min Price / Night</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400 text-sm">$</span>
                                    <input
                                        type="number"
                                        value={localFilters.min_price || ''}
                                        onChange={(e) => setLocalFilters({ ...localFilters, min_price: e.target.value })}
                                        placeholder="0"
                                        className="w-full pl-7 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm text-navy-800 outline-none focus:border-gold-400"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-navy-500 uppercase tracking-wide mb-2">Max Price / Night</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400 text-sm">$</span>
                                    <input
                                        type="number"
                                        value={localFilters.max_price || ''}
                                        onChange={(e) => setLocalFilters({ ...localFilters, max_price: e.target.value })}
                                        placeholder="Any"
                                        className="w-full pl-7 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm text-navy-800 outline-none focus:border-gold-400"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-navy-500 uppercase tracking-wide mb-2">Bedrooms</label>
                                <select
                                    value={localFilters.bedrooms || ''}
                                    onChange={(e) => setLocalFilters({ ...localFilters, bedrooms: e.target.value })}
                                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-navy-800 outline-none focus:border-gold-400"
                                >
                                    <option value="">Any</option>
                                    {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}+</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="flex items-center justify-end gap-3 mt-6 pt-5 border-t border-gray-100">
                            <button onClick={() => setShowFilters(false)} className="px-5 py-2.5 text-sm text-navy-600 hover:text-navy-800 transition-colors">Cancel</button>
                            <button onClick={applyFilters} className="px-6 py-2.5 bg-navy-900 hover:bg-navy-800 text-white text-sm font-medium rounded-xl transition-all">
                                Apply Filters
                            </button>
                        </div>
                    </div>
                )}

                {/* Results */}
                <div className="flex items-center justify-between mb-6">
                    <p className="text-sm text-navy-500">
                        {properties.total > 0
                            ? `${properties.total} propert${properties.total !== 1 ? 'ies' : 'y'} found`
                            : 'No properties found'}
                    </p>
                </div>

                {properties.data.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {properties.data.map((property) => (
                            <PropertyCard key={property.id} property={property} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24">
                        <div className="text-6xl mb-4">🏠</div>
                        <h3 className="font-display text-xl font-semibold text-navy-800 mb-2">No properties found</h3>
                        <p className="text-navy-400 text-sm mb-6">Try adjusting your filters or search term</p>
                        <button onClick={clearFilters} className="px-6 py-3 bg-navy-900 text-white rounded-xl text-sm font-medium hover:bg-navy-800 transition-all">
                            Clear all filters
                        </button>
                    </div>
                )}

                {/* Pagination */}
                {properties.last_page > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-12 flex-wrap">
                        {properties.links.map((link, i) => {
                            // Convert Laravel pagination labels to safe text
                            const label = link.label
                                .replace('&laquo;', '←')
                                .replace('&raquo;', '→')
                                .replace(/&amp;/g, '&');
                            return (
                                <button
                                    key={i}
                                    disabled={!link.url}
                                    onClick={() => link.url && router.get(link.url, {}, { preserveScroll: false })}
                                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all min-w-[40px] ${
                                        link.active
                                            ? 'bg-navy-900 text-white'
                                            : link.url
                                                ? 'bg-white border border-gray-200 text-navy-600 hover:border-navy-300'
                                                : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                                    }`}
                                >
                                    {label}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
