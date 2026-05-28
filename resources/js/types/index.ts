export interface User {
    id: number;
    name: string;
    email: string;
    role: 'guest' | 'owner' | 'admin';
    phone?: string;
    avatar?: string;
    bio?: string;
    country?: string;
}

export interface PropertyImage {
    id: number;
    property_id: number;
    url: string;
    caption?: string;
    sort_order: number;
    is_primary: boolean;
}

export interface MarketingImage {
    id: number;
    url: string;
    caption?: string;
    property_title?: string;
    property_slug?: string;
}

export interface Property {
    id: number;
    owner_id: number;
    title: string;
    slug: string;
    description: string;
    short_description?: string;
    type: 'villa' | 'apartment' | 'cottage' | 'penthouse' | 'chalet' | 'bungalow' | 'studio';
    address: string;
    city: string;
    state?: string;
    country: string;
    zip_code?: string;
    latitude?: number;
    longitude?: number;
    location_url?: string;
    map_embed_url?: string;
    price_per_night: number;
    weekend_price?: number;
    cleaning_fee: number;
    security_deposit: number;
    currency: string;
    bedrooms: number;
    bathrooms: number;
    max_guests: number;
    area_sqm?: number;
    min_stay_nights: number;
    max_stay_nights?: number;
    amenities?: string[];
    house_rules?: Record<string, string>;
    check_in_time: string;
    check_out_time: string;
    cancellation_policy: 'flexible' | 'moderate' | 'strict';
    status: 'draft' | 'active' | 'inactive';
    featured: boolean;
    avg_rating: number;
    review_count: number;
    images: PropertyImage[];
    owner?: User;
    reviews?: Review[];
    bookings_count?: number;
    reviews_count?: number;
}

export interface Booking {
    id: number;
    reference: string;
    property_id: number;
    guest_id?: number | null;
    guest_name?: string;
    guest_email?: string;
    guest_phone?: string;
    check_in: string;
    check_out: string;
    guests: number;
    price_per_night: number;
    cleaning_fee: number;
    security_deposit: number;
    total_price: number;
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
    special_requests?: string;
    confirmed_at?: string;
    cancelled_at?: string;
    property?: Property;
    guest?: User;
}

export interface Review {
    id: number;
    property_id: number;
    booking_id: number;
    reviewer_id: number;
    rating: number;
    cleanliness?: number;
    communication?: number;
    check_in?: number;
    accuracy?: number;
    location?: number;
    value?: number;
    comment: string;
    reviewer?: User;
    created_at: string;
}

export interface PaginatedData<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
}

export interface PageProps {
    auth: { user: User | null };
    flash: { success?: string; error?: string };
    ziggy: { location: string };
    [key: string]: unknown;
}
