import { Head, usePage } from '@inertiajs/react';
import { PageProps } from '../types';

const SITE_URL = 'https://micnichomes.co.tz';
const SITE_NAME = 'Micnic Homes';
const DEFAULT_IMAGE = '/MicNic_Logo.png';
const DEFAULT_DESCRIPTION = 'Micnic Homes offers curated apartments, private villas, serviced stays and premium short-term rentals in Dar es Salaam, Zanzibar and across Tanzania.';
const DEFAULT_KEYWORDS = [
    'Micnic Homes',
    'Micnic Villa',
    'apartments in Dar es Salaam',
    'serviced apartments Tanzania',
    'private villas Tanzania',
    'holiday homes Tanzania',
    'short stay apartments Dar es Salaam',
    'vacation rentals Tanzania',
    'luxury apartments Tanzania',
    'villa rentals Zanzibar',
    'furnished apartments Tanzania',
    'premium stays Tanzania',
    'book apartment Dar es Salaam',
    'property booking Tanzania',
];

interface SeoHeadProps {
    title: string;
    description?: string;
    keywords?: string[];
    image?: string | null;
    canonicalPath?: string;
    type?: 'website' | 'article';
    noindex?: boolean;
    structuredData?: Record<string, unknown> | Record<string, unknown>[];
}

function absoluteUrl(path?: string | null) {
    if (!path) return `${SITE_URL}${DEFAULT_IMAGE}`;
    if (path.startsWith('http')) return path;
    return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

function currentPath(location?: string) {
    try {
        return new URL(location || SITE_URL).pathname;
    } catch {
        return '/';
    }
}

export default function SeoHead({
    title,
    description = DEFAULT_DESCRIPTION,
    keywords = [],
    image,
    canonicalPath,
    type = 'website',
    noindex = false,
    structuredData,
}: SeoHeadProps) {
    const { ziggy } = usePage<PageProps>().props;
    const path = canonicalPath || currentPath(ziggy?.location);
    const canonical = `${SITE_URL}${path === '/' ? '' : path}`;
    const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
    const mergedKeywords = [...new Set([...keywords, ...DEFAULT_KEYWORDS])].join(', ');
    const previewImage = absoluteUrl(image);
    const schema = structuredData
        ? Array.isArray(structuredData)
            ? structuredData
            : [structuredData]
        : [];

    return (
        <Head title={fullTitle}>
            <meta name="description" content={description} />
            <meta name="keywords" content={mergedKeywords} />
            <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large'} />
            <link rel="canonical" href={canonical} />

            <meta name="geo.region" content="TZ-02" />
            <meta name="geo.placename" content="Dar es Salaam, Tanzania" />
            <meta name="geo.position" content="-6.7924;39.2083" />
            <meta name="ICBM" content="-6.7924, 39.2083" />

            <meta property="og:site_name" content={SITE_NAME} />
            <meta property="og:type" content={type} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:url" content={canonical} />
            <meta property="og:image" content={previewImage} />
            <meta property="og:locale" content="en_TZ" />

            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={previewImage} />

            {schema.map((item, index) => (
                <script key={index} type="application/ld+json">
                    {JSON.stringify(item)}
                </script>
            ))}
        </Head>
    );
}

export { DEFAULT_DESCRIPTION, DEFAULT_KEYWORDS, SITE_NAME, SITE_URL };
