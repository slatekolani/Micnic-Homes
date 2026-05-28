import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import {
    Home, MapPin, DollarSign, BedDouble, Image, Shield,
    ChevronRight, ChevronLeft, Check, Info
} from 'lucide-react';
import AppLayout from '../../../layouts/AppLayout';
import ImageUploaderSection from '../../../components/ImageUploaderSection';

const STEPS = ['Basic Info', 'Location', 'Pricing', 'Details', 'Amenities', 'Rules & Policy', 'Photos'];

const AMENITY_OPTIONS = [
    { key: 'wifi',        label: 'High-Speed WiFi',      emoji: '📶' },
    { key: 'pool',        label: 'Private Pool',         emoji: '🏊' },
    { key: 'parking',     label: 'Free Parking',         emoji: '🚗' },
    { key: 'kitchen',     label: 'Full Kitchen',         emoji: '🍳' },
    { key: 'gym',         label: 'Fitness Center',       emoji: '🏋️' },
    { key: 'tv',          label: 'Smart TV',             emoji: '📺' },
    { key: 'ac',          label: 'Air Conditioning',     emoji: '❄️' },
    { key: 'garden',      label: 'Private Garden',       emoji: '🌿' },
    { key: 'beachfront',  label: 'Beach Access',         emoji: '🏖️' },
    { key: 'bbq',         label: 'BBQ Area',             emoji: '🔥' },
    { key: 'fireplace',   label: 'Fireplace',            emoji: '🕯️' },
    { key: 'washer',      label: 'Washer/Dryer',         emoji: '🫧' },
    { key: 'dishwasher',  label: 'Dishwasher',           emoji: '🍽️' },
    { key: 'balcony',     label: 'Balcony/Terrace',      emoji: '🌅' },
    { key: 'workspace',   label: 'Dedicated Workspace',  emoji: '💼' },
    { key: 'elevator',    label: 'Elevator',             emoji: '🛗' },
    { key: 'cctv',        label: 'Security Cameras',     emoji: '📷' },
    { key: 'safe',        label: 'In-room Safe',         emoji: '🔒' },
];

export default function CreateProperty() {
    const [step, setStep] = useState(0);
    const { data, setData, post, processing, errors } = useForm<{
        title: string;
        description: string;
        short_description: string;
        type: string;
        address: string;
        city: string;
        state: string;
        country: string;
        zip_code: string;
        location_url: string;
        price_per_night: string;
        weekend_price: string;
        cleaning_fee: string;
        security_deposit: string;
        currency: string;
        bedrooms: string;
        bathrooms: string;
        max_guests: string;
        area_sqm: string;
        min_stay_nights: string;
        max_stay_nights: string;
        amenities: string[];
        check_in_time: string;
        check_out_time: string;
        cancellation_policy: string;
        smoking_allowed: boolean;
        pets_allowed: boolean;
        parties_allowed: boolean;
        images: File[];
        image_urls: string[];
    }>({
        title: '',
        description: '',
        short_description: '',
        type: 'villa',
        address: '',
        city: '',
        state: '',
        country: '',
        zip_code: '',
        location_url: '',
        price_per_night: '',
        weekend_price: '',
        cleaning_fee: '0',
        security_deposit: '0',
        currency: 'USD',
        bedrooms: '1',
        bathrooms: '1',
        max_guests: '2',
        area_sqm: '',
        min_stay_nights: '1',
        max_stay_nights: '',
        amenities: [],
        check_in_time: '14:00',
        check_out_time: '11:00',
        cancellation_policy: 'moderate',
        smoking_allowed: false,
        pets_allowed: false,
        parties_allowed: false,
        images: [],
        image_urls: [],
    });

    const toggleAmenity = (key: string) => {
        setData('amenities', data.amenities.includes(key)
            ? data.amenities.filter((a) => a !== key)
            : [...data.amenities, key]
        );
    };

    const submit = () => {
        post('/owner/properties', { forceFormData: true });
    };

    const inputClass = (field?: string) =>
        `w-full px-4 py-3.5 border rounded-xl text-sm text-navy-800 placeholder-navy-300 outline-none transition-colors ${
            field && errors[field as keyof typeof errors]
                ? 'border-red-400 focus:border-red-400'
                : 'border-gray-200 focus:border-gold-400'
        }`;

    const labelClass = 'block text-xs font-semibold text-navy-600 uppercase tracking-wide mb-2';
    const sectionTitle = (title: string, desc?: string) => (
        <div className="mb-6">
            <h2 className="font-display text-xl font-semibold text-navy-900">{title}</h2>
            {desc && <p className="text-navy-400 text-sm mt-1">{desc}</p>}
        </div>
    );

    return (
        <AppLayout>
            <Head title="List New Property" />

            <div className="bg-navy-950 pt-40 pb-12">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-2 text-white/50 text-sm mb-4">
                        <Link href="/owner" className="hover:text-gold-400">Dashboard</Link>
                        <span>/</span>
                        <Link href="/owner/properties" className="hover:text-gold-400">Properties</Link>
                        <span>/</span>
                        <span className="text-white/80">New Listing</span>
                    </div>
                    <h1 className="font-display text-2xl sm:text-3xl font-semibold text-white">List New Property</h1>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* Progress Steps */}
                <div className="flex items-center gap-1 mb-10 overflow-x-auto pb-2">
                    {STEPS.map((s, i) => (
                        <div key={s} className="flex items-center gap-1 shrink-0">
                            <button
                                type="button"
                                onClick={() => i < step && setStep(i)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all ${
                                    i === step
                                        ? 'bg-navy-900 text-white shadow'
                                        : i < step
                                            ? 'bg-gold-100 text-gold-700 cursor-pointer hover:bg-gold-200'
                                            : 'bg-gray-100 text-navy-400 cursor-not-allowed'
                                }`}
                            >
                                {i < step ? (
                                    <Check className="w-3.5 h-3.5" />
                                ) : (
                                    <span className="w-5 h-5 rounded-full border-2 border-current flex items-center justify-center text-xs">{i + 1}</span>
                                )}
                                <span className="hidden sm:block">{s}</span>
                            </button>
                            {i < STEPS.length - 1 && <div className={`w-6 h-px ${i < step ? 'bg-gold-400' : 'bg-gray-200'}`} />}
                        </div>
                    ))}
                </div>

                <form noValidate onSubmit={(e) => e.preventDefault()}>
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8">

                        {/* Step 0: Basic Info */}
                        {step === 0 && (
                            <div>
                                {sectionTitle('Basic Information', 'Tell us about your property')}
                                <div className="space-y-5">
                                    <div>
                                        <label className={labelClass}>Property Title *</label>
                                        <input type="text" value={data.title} onChange={(e) => setData('title', e.target.value)}
                                            placeholder="e.g. Stunning Ocean-View Villa in Zanzibar" className={inputClass('title')} required />
                                        {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
                                    </div>

                                    <div>
                                        <label className={labelClass}>Property Type *</label>
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                            {['villa', 'apartment', 'cottage', 'penthouse', 'chalet', 'bungalow', 'studio'].map((type) => (
                                                <button key={type} type="button"
                                                    onClick={() => setData('type', type)}
                                                    className={`py-3 px-4 border-2 rounded-xl text-sm font-medium capitalize transition-all ${
                                                        data.type === type ? 'border-navy-900 bg-navy-50 text-navy-800' : 'border-gray-200 text-navy-500 hover:border-gray-300'
                                                    }`}>
                                                    {type}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className={labelClass}>Short Description <span className="text-navy-300 font-normal normal-case">(max 300 chars)</span></label>
                                        <input type="text" value={data.short_description} onChange={(e) => setData('short_description', e.target.value)}
                                            placeholder="A one-liner that captures the essence of your property" className={inputClass()} maxLength={300} />
                                    </div>

                                    <div>
                                        <label className={labelClass}>Full Description *</label>
                                        <textarea value={data.description} onChange={(e) => setData('description', e.target.value)}
                                            rows={6} placeholder="Describe your property in detail. Mention unique features, nearby attractions, ambience, and what makes your property special..." className={inputClass('description')} required />
                                        {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description}</p>}
                                        <p className="text-xs text-navy-400 mt-1">{data.description.length} characters — aim for at least 200 for best visibility</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 1: Location */}
                        {step === 1 && (
                            <div>
                                {sectionTitle('Location', 'Where is your property located?')}
                                <div className="grid sm:grid-cols-2 gap-5">
                                    <div className="sm:col-span-2">
                                        <label className={labelClass}>Street Address *</label>
                                        <input type="text" value={data.address} onChange={(e) => setData('address', e.target.value)}
                                            placeholder="123 Beachfront Drive" className={inputClass('address')} required />
                                    </div>
                                    <div>
                                        <label className={labelClass}>City *</label>
                                        <input type="text" value={data.city} onChange={(e) => setData('city', e.target.value)}
                                            placeholder="Zanzibar City" className={inputClass('city')} required />
                                        {errors.city && <p className="mt-1 text-xs text-red-500">{errors.city}</p>}
                                    </div>
                                    <div>
                                        <label className={labelClass}>State / Province</label>
                                        <input type="text" value={data.state} onChange={(e) => setData('state', e.target.value)}
                                            placeholder="Zanzibar" className={inputClass()} />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Country *</label>
                                        <input type="text" value={data.country} onChange={(e) => setData('country', e.target.value)}
                                            placeholder="Tanzania" className={inputClass('country')} required />
                                        {errors.country && <p className="mt-1 text-xs text-red-500">{errors.country}</p>}
                                    </div>
                                    <div>
                                        <label className={labelClass}>Postal / ZIP Code</label>
                                        <input type="text" value={data.zip_code} onChange={(e) => setData('zip_code', e.target.value)}
                                            placeholder="00000" className={inputClass()} />
                                    </div>
                                </div>

                                {/* Google Maps URL */}
                                <div className="mt-5">
                                    <label className={labelClass}>Google Maps URL <span className="text-navy-300 normal-case font-normal">(optional)</span></label>
                                    <input
                                        type="url"
                                        value={data.location_url}
                                        onChange={(e) => setData('location_url', e.target.value)}
                                        placeholder="https://maps.google.com/..."
                                        className={inputClass()}
                                    />
                                    <p className="mt-1 text-xs text-navy-400">Paste any Google Maps share link. It will be embedded as an interactive map on the property page.</p>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Pricing */}
                        {step === 2 && (
                            <div>
                                {sectionTitle('Pricing', 'Set competitive rates for your property')}
                                <div className="grid sm:grid-cols-2 gap-5">
                                    <div>
                                        <label className={labelClass}>Currency</label>
                                        <select value={data.currency} onChange={(e) => setData('currency', e.target.value)} className={inputClass()}>
                                            {['USD', 'EUR', 'GBP', 'TZS', 'KES', 'ZAR', 'AED'].map((c) => (
                                                <option key={c} value={c}>{c}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div />

                                    <div>
                                        <label className={labelClass}>Nightly Rate *</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-400 text-sm font-medium">{data.currency}</span>
                                            <input type="number" value={data.price_per_night} onChange={(e) => setData('price_per_night', e.target.value)}
                                                placeholder="0" min="1" className={`${inputClass('price_per_night')} pl-14`} required />
                                        </div>
                                        {errors.price_per_night && <p className="mt-1 text-xs text-red-500">{errors.price_per_night}</p>}
                                    </div>

                                    <div>
                                        <label className={labelClass}>Weekend Rate <span className="text-navy-300 font-normal normal-case">(Fri–Sun)</span></label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-400 text-sm font-medium">{data.currency}</span>
                                            <input type="number" value={data.weekend_price} onChange={(e) => setData('weekend_price', e.target.value)}
                                                placeholder="Optional" min="1" className={`${inputClass()} pl-14`} />
                                        </div>
                                    </div>

                                    <div>
                                        <label className={labelClass}>Cleaning Fee</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-400 text-sm font-medium">{data.currency}</span>
                                            <input type="number" value={data.cleaning_fee} onChange={(e) => setData('cleaning_fee', e.target.value)}
                                                placeholder="0" min="0" className={`${inputClass()} pl-14`} />
                                        </div>
                                    </div>

                                    <div>
                                        <label className={labelClass}>Security Deposit</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-400 text-sm font-medium">{data.currency}</span>
                                            <input type="number" value={data.security_deposit} onChange={(e) => setData('security_deposit', e.target.value)}
                                                placeholder="0" min="0" className={`${inputClass()} pl-14`} />
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-5 p-4 bg-blue-50 rounded-xl flex items-start gap-3">
                                    <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                                    <p className="text-xs text-blue-700">Pricing tip: Research similar properties in your area to set competitive rates. Premium amenities like pools and beachfront access can command higher nightly rates.</p>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Property Details */}
                        {step === 3 && (
                            <div>
                                {sectionTitle('Property Details', 'Provide accurate specifications for your guests')}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 mb-6">
                                    {[
                                        { label: 'Bedrooms', field: 'bedrooms', min: 0, max: 20 },
                                        { label: 'Bathrooms', field: 'bathrooms', min: 1, max: 20 },
                                        { label: 'Max Guests', field: 'max_guests', min: 1, max: 50 },
                                        { label: 'Area (m²)', field: 'area_sqm', min: 1, max: 9999, optional: true },
                                    ].map(({ label, field, min, max, optional }) => (
                                        <div key={field}>
                                            <label className={labelClass}>{label}{optional ? <span className="text-navy-300 font-normal normal-case ml-1">(opt.)</span> : ' *'}</label>
                                            <input type="number"
                                                value={data[field as keyof typeof data] as string}
                                                onChange={(e) => setData(field as any, e.target.value)}
                                                min={min} max={max}
                                                className={inputClass(optional ? undefined : field)}
                                                required={!optional}
                                            />
                                        </div>
                                    ))}
                                </div>

                                <div className="grid sm:grid-cols-2 gap-5">
                                    <div>
                                        <label className={labelClass}>Minimum Stay (nights)</label>
                                        <input type="number" value={data.min_stay_nights} onChange={(e) => setData('min_stay_nights', e.target.value)}
                                            min="1" className={inputClass()} />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Maximum Stay (nights) <span className="text-navy-300 font-normal normal-case">(opt.)</span></label>
                                        <input type="number" value={data.max_stay_nights} onChange={(e) => setData('max_stay_nights', e.target.value)}
                                            min="1" placeholder="No limit" className={inputClass()} />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Check-in Time</label>
                                        <input type="time" value={data.check_in_time} onChange={(e) => setData('check_in_time', e.target.value)}
                                            className={inputClass()} />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Check-out Time</label>
                                        <input type="time" value={data.check_out_time} onChange={(e) => setData('check_out_time', e.target.value)}
                                            className={inputClass()} />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 4: Amenities */}
                        {step === 4 && (
                            <div>
                                {sectionTitle('Amenities', 'Select all amenities available at your property')}
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {AMENITY_OPTIONS.map((amenity) => {
                                        const selected = data.amenities.includes(amenity.key);
                                        return (
                                            <button
                                                key={amenity.key}
                                                type="button"
                                                onClick={() => toggleAmenity(amenity.key)}
                                                className={`flex items-center gap-3 p-4 border-2 rounded-xl text-left transition-all ${
                                                    selected
                                                        ? 'border-navy-800 bg-navy-50'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                            >
                                                <span className="text-xl">{amenity.emoji}</span>
                                                <span className={`text-sm font-medium ${selected ? 'text-navy-800' : 'text-navy-500'}`}>
                                                    {amenity.label}
                                                </span>
                                                {selected && <Check className="w-4 h-4 text-green-600 ml-auto shrink-0" />}
                                            </button>
                                        );
                                    })}
                                </div>
                                <p className="text-xs text-navy-400 mt-4">{data.amenities.length} amenity{data.amenities.length !== 1 ? 's' : ''} selected</p>
                            </div>
                        )}

                        {/* Step 6: Photos */}
                        {step === 6 && (
                            <div>
                                {sectionTitle('Property Photos', 'Add up to 10 photos to showcase your property')}
                                <ImageUploaderSection
                                    files={data.images}
                                    onFilesChange={(files) => setData('images', files)}
                                    imageUrls={data.image_urls}
                                    onImageUrlsChange={(urls) => setData('image_urls', urls)}
                                    maxImages={10}
                                />
                                {(errors as any).images && <p className="mt-2 text-xs text-red-500">{(errors as any).images}</p>}
                            </div>
                        )}

                        {/* Step 5: Rules & Policy */}
                        {step === 5 && (
                            <div>
                                {sectionTitle('House Rules & Cancellation Policy', 'Set clear expectations for your guests')}
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="font-semibold text-navy-800 mb-3">House Rules</h3>
                                        <div className="space-y-3">
                                            {[
                                                { key: 'smoking_allowed', label: 'Smoking allowed', desc: 'Allow guests to smoke on the property' },
                                                { key: 'pets_allowed', label: 'Pets allowed', desc: 'Allow guests to bring pets' },
                                                { key: 'parties_allowed', label: 'Events / parties allowed', desc: 'Allow guests to host events or parties' },
                                            ].map(({ key, label, desc }) => (
                                                <div key={key} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                                                    <div>
                                                        <p className="text-sm font-medium text-navy-800">{label}</p>
                                                        <p className="text-xs text-navy-400 mt-0.5">{desc}</p>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => setData(key as any, !data[key as keyof typeof data])}
                                                        className={`relative w-11 h-6 rounded-full transition-colors ${
                                                            data[key as keyof typeof data] ? 'bg-navy-900' : 'bg-gray-200'
                                                        }`}
                                                    >
                                                        <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                                                            data[key as keyof typeof data] ? 'translate-x-6' : 'translate-x-1'
                                                        }`} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="font-semibold text-navy-800 mb-3">Cancellation Policy *</h3>
                                        <div className="space-y-3">
                                            {[
                                                {
                                                    value: 'flexible',
                                                    label: 'Flexible',
                                                    desc: 'Full refund if cancelled at least 24 hours before check-in',
                                                    badge: 'Most bookings',
                                                    badgeColor: 'bg-green-100 text-green-700',
                                                },
                                                {
                                                    value: 'moderate',
                                                    label: 'Moderate',
                                                    desc: 'Full refund if cancelled at least 5 days before check-in',
                                                    badge: 'Recommended',
                                                    badgeColor: 'bg-blue-100 text-blue-700',
                                                },
                                                {
                                                    value: 'strict',
                                                    label: 'Strict',
                                                    desc: '50% refund if cancelled at least 7 days before check-in',
                                                    badge: 'More protection',
                                                    badgeColor: 'bg-orange-100 text-orange-700',
                                                },
                                            ].map((policy) => (
                                                <button
                                                    key={policy.value}
                                                    type="button"
                                                    onClick={() => setData('cancellation_policy', policy.value)}
                                                    className={`w-full flex items-center justify-between p-4 border-2 rounded-xl text-left transition-all ${
                                                        data.cancellation_policy === policy.value
                                                            ? 'border-navy-900 bg-navy-50'
                                                            : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                                >
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <p className="font-semibold text-navy-800 text-sm">{policy.label}</p>
                                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${policy.badgeColor}`}>{policy.badge}</span>
                                                        </div>
                                                        <p className="text-xs text-navy-400">{policy.desc}</p>
                                                    </div>
                                                    {data.cancellation_policy === policy.value && (
                                                        <Check className="w-5 h-5 text-navy-700 shrink-0 ml-3" />
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>

                    {/* Navigation */}
                    <div className="flex items-center justify-between mt-6">
                        <button
                            type="button"
                            onClick={() => setStep((s) => Math.max(0, s - 1))}
                            disabled={step === 0}
                            className="flex items-center gap-2 px-5 py-3 bg-white border border-gray-200 text-navy-600 hover:border-gray-300 rounded-xl text-sm font-medium disabled:opacity-40 transition-all"
                        >
                            <ChevronLeft className="w-4 h-4" /> Previous
                        </button>

                        <p className="text-xs text-navy-400">{step + 1} of {STEPS.length}</p>

                        {step < STEPS.length - 1 ? (
                            <button
                                type="button"
                                onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
                                className="flex items-center gap-2 px-6 py-3 bg-navy-900 hover:bg-navy-800 text-white rounded-xl text-sm font-medium transition-all"
                            >
                                Next <ChevronRight className="w-4 h-4" />
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={submit}
                                disabled={processing}
                                className="flex items-center gap-2 px-6 py-3 bg-gold-500 hover:bg-gold-600 disabled:bg-gold-300 text-white rounded-xl text-sm font-semibold transition-all shadow-md"
                            >
                                <Check className="w-4 h-4" />
                                {processing ? 'Submitting...' : 'Submit Listing'}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
