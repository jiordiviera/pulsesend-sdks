<?php

declare(strict_types=1);

namespace PulseSend\Laravel;

use Illuminate\Support\Facades\Facade;

/**
 * @method static \PulseSend\Services\EmailsService emails()
 * @method static \PulseSend\Services\AnalyticsService analytics()
 * @method static array ping()
 * @method static string version()
 */
class PulseSendFacade extends Facade
{
    protected static function getFacadeAccessor(): string
    {
        return 'pulsesend';
    }
}