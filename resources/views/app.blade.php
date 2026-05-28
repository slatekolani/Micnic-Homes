<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="scroll-smooth">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="csrf-token" content="{{ csrf_token() }}" />

    <title inertia>{{ config('app.name', 'Micnic Homes') }}</title>
    <meta name="theme-color" content="#1060a8" />

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap" rel="stylesheet" />

    <!-- Favicons -->
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png?v=5" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png?v=5" />
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png?v=5" />
    <link rel="manifest" href="/site.webmanifest?v=5" />

    @routes
    @viteReactRefresh
    @vite('resources/js/app.tsx')
    @inertiaHead
</head>
<body class="antialiased bg-white text-navy-900">
    @inertia
</body>
</html>
