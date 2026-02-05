<?php

return [
    // Session driver: file is fine for this API + Sanctum setup
    'driver' => env('SESSION_DRIVER', 'file'),

    // Session lifetime in minutes
    'lifetime' => env('SESSION_LIFETIME', 120),

    // Lottery: how often to sweep old sessions [chance, out of]
    'lottery' => [2, 100],

    // Expire session when browser closes
    'expire_on_close' => false,

    // Encrypt session data
    'encrypt' => false,

    // File session storage path (for file driver)
    'files' => storage_path('framework/sessions'),

    // Database connection / table (if using database driver)
    'connection' => env('SESSION_CONNECTION', null),
    'table' => 'sessions',

    // Session cookie name
    'cookie' => env('SESSION_COOKIE', 'laravel_session'),

    // Cookie path and domain
    'path' => '/',
    'domain' => env('SESSION_DOMAIN', null),

    // HTTPS-only cookie
    'secure' => env('SESSION_SECURE_COOKIE', null),

    // HTTP only cookie (not accessible via JS)
    'http_only' => true,

    // SameSite setting: lax/strict/none/null
    'same_site' => env('SESSION_SAME_SITE', 'lax'),
];
