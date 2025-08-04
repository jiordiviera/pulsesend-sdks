<?php

return [
    /*
    |--------------------------------------------------------------------------
    | PulseSend API Key
    |--------------------------------------------------------------------------
    |
    | Your PulseSend API key. You can find this in your PulseSend dashboard.
    | This key should start with 'pk_' for production keys.
    |
    */
    'api_key' => env('PULSESEND_API_KEY'),

    /*
    |--------------------------------------------------------------------------
    | Base URL
    |--------------------------------------------------------------------------
    |
    | The base URL for the PulseSend API. You shouldn't need to change this
    | unless you're using a custom endpoint.
    |
    */
    'base_url' => env('PULSESEND_BASE_URL', 'https://api.pulsesend.com/v1'),

    /*
    |--------------------------------------------------------------------------
    | Request Timeout
    |--------------------------------------------------------------------------
    |
    | The number of seconds to wait for a response from the PulseSend API
    | before timing out.
    |
    */
    'timeout' => env('PULSESEND_TIMEOUT', 10),

    /*
    |--------------------------------------------------------------------------
    | Retry Configuration
    |--------------------------------------------------------------------------
    |
    | Number of times to retry failed requests and the delay between retries.
    |
    */
    'retries' => env('PULSESEND_RETRIES', 3),
    'retry_delay' => env('PULSESEND_RETRY_DELAY', 1),
];
