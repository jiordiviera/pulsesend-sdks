# PulseSend PHP SDK

Official PHP SDK for the PulseSend email delivery service.

## Installation

Install via Composer:

```bash
composer require pulsesend/php-sdk
```

## Quick Start

```php
<?php
use PulseSend\PulseSend;

$pulsesend = new PulseSend('pk_your_api_key_here');

// Send an email
$response = $pulsesend->emails()->send([
    'to' => ['user@example.com'],
    'from' => 'sender@yourdomain.com',
    'subject' => 'Hello from PulseSend!',
    'html' => '<h1>Welcome!</h1><p>This is a test email.</p>',
    'text' => 'Welcome! This is a test email.'
]);

echo "Email sent with ID: " . $response['id'];
```

## Requirements

- PHP 8.0 or higher
- Guzzle HTTP client

## Laravel Integration

This package includes Laravel service provider with auto-discovery. After installation, publish the config:

```bash
php artisan vendor:publish --provider="PulseSend\Laravel\PulseSendServiceProvider"
```

Add your API key to `.env`:

```env
PULSESEND_API_KEY=pk_your_api_key_here
```

Use the facade:

```php
<?php
use PulseSend;

PulseSend::emails()->send([
    'to' => ['user@example.com'],
    'from' => 'sender@yourdomain.com',
    'subject' => 'Hello from Laravel!',
    'html' => '<h1>Welcome!</h1>'
]);
```

## Documentation

For detailed documentation, visit [https://docs.pulsesend.com](https://docs.pulsesend.com)

## License

MIT License
