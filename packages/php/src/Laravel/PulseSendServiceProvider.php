<?php

declare(strict_types=1);

namespace PulseSend\Laravel;

use Illuminate\Support\ServiceProvider;
use PulseSend\PulseSend;

class PulseSendServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->mergeConfigFrom(__DIR__ . '/../../config/pulsesend.php', 'pulsesend');

        $this->app->singleton(PulseSend::class, function ($app) {
            $config = $app['config']['pulsesend'];
            
            return new PulseSend(
                $config['api_key'],
                [
                    'base_url' => $config['base_url'],
                    'timeout' => $config['timeout'],
                    'retries' => $config['retries'],
                    'retry_delay' => $config['retry_delay'],
                ]
            );
        });

        $this->app->alias(PulseSend::class, 'pulsesend');
    }

    public function boot(): void
    {
        if ($this->app->runningInConsole()) {
            $this->publishes([
                __DIR__ . '/../../config/pulsesend.php' => config_path('pulsesend.php'),
            ], 'pulsesend-config');
        }
    }

    public function provides(): array
    {
        return [PulseSend::class, 'pulsesend'];
    }
}