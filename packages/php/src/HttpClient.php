<?php

declare(strict_types=1);

namespace PulseSend;

use GuzzleHttp\Client;
use GuzzleHttp\Exception\ConnectException;
use GuzzleHttp\Exception\RequestException;
use GuzzleHttp\Exception\TransferException;
use GuzzleHttp\HandlerStack;
use GuzzleHttp\Middleware;
use GuzzleHttp\Psr7\Request;
use PulseSend\Exceptions\InvalidApiKeyException;
use PulseSend\Exceptions\NetworkException;
use PulseSend\Exceptions\QuotaExceededException;
use PulseSend\Exceptions\RateLimitException;
use PulseSend\Exceptions\ServerException;
use PulseSend\Exceptions\TimeoutException;
use PulseSend\Exceptions\ValidationException;
use Psr\Http\Client\ClientInterface;
use Psr\Http\Message\RequestInterface;
use Psr\Http\Message\ResponseInterface;

class HttpClient implements ClientInterface
{
    private Client $client;
    private Configuration $config;

    public function __construct(Configuration $config)
    {
        $this->config = $config;
        $this->client = $this->createClient();
    }

    public function sendRequest(RequestInterface $request): ResponseInterface
    {
        try {
            return $this->client->send($request);
        } catch (TransferException $e) {
            throw $this->handleException($e);
        }
    }

    /**
     * @param array<string, mixed> $options
     */
    public function request(string $method, string $uri, array $options = []): array
    {
        $request = new Request(
            $method,
            $uri,
            $options['headers'] ?? [],
            $options['body'] ?? null
        );

        $response = $this->sendRequestWithRetry($request);
        
        return $this->parseResponse($response);
    }

    public function get(string $uri, array $params = []): array
    {
        $query = http_build_query($params);
        $uri = $query ? $uri . '?' . $query : $uri;
        
        return $this->request('GET', $uri);
    }

    public function post(string $uri, array $data = []): array
    {
        return $this->request('POST', $uri, [
            'headers' => ['Content-Type' => 'application/json'],
            'body' => json_encode($data)
        ]);
    }

    public function put(string $uri, array $data = []): array
    {
        return $this->request('PUT', $uri, [
            'headers' => ['Content-Type' => 'application/json'],
            'body' => json_encode($data)
        ]);
    }

    public function delete(string $uri): array
    {
        return $this->request('DELETE', $uri);
    }

    private function createClient(): Client
    {
        $stack = HandlerStack::create();
        $stack->push($this->createRetryMiddleware());

        return new Client([
            'base_uri' => $this->config->getBaseUrl(),
            'timeout' => $this->config->getTimeout(),
            'handler' => $stack,
            'headers' => [
                'Authorization' => 'Bearer ' . $this->config->getApiKey(),
                'Content-Type' => 'application/json',
                'User-Agent' => "pulsesend-php/1.0.0",
                'Accept' => 'application/json',
            ],
        ]);
    }

    private function createRetryMiddleware(): callable
    {
        return Middleware::retry(
            function (int $retries, RequestInterface $request, ?ResponseInterface $response, ?RequestException $exception): bool {
                if ($retries >= $this->config->getRetries()) {
                    return false;
                }

                if ($exception instanceof ConnectException || $exception instanceof TransferException) {
                    return true;
                }

                if ($response && in_array($response->getStatusCode(), [500, 502, 503, 504], true)) {
                    return true;
                }

                return false;
            },
            function (int $retries): int {
                return $this->config->getRetryDelay() * (2 ** ($retries - 1)) * 1000;
            }
        );
    }

    private function sendRequestWithRetry(RequestInterface $request): ResponseInterface
    {
        $lastException = null;

        for ($attempt = 1; $attempt <= $this->config->getRetries() + 1; $attempt++) {
            try {
                return $this->client->send($request);
            } catch (TransferException $e) {
                $lastException = $e;

                if ($attempt <= $this->config->getRetries() && $this->shouldRetry($e)) {
                    $delay = $this->calculateRetryDelay($attempt);
                    usleep($delay * 1000);
                    continue;
                }

                throw $this->handleException($e);
            }
        }

        throw $this->handleException($lastException);
    }

    private function shouldRetry(TransferException $exception): bool
    {
        if ($exception instanceof ConnectException) {
            return true;
        }

        if ($exception instanceof RequestException && $exception->hasResponse()) {
            $statusCode = $exception->getResponse()->getStatusCode();
            return in_array($statusCode, [500, 502, 503, 504], true);
        }

        return false;
    }

    private function calculateRetryDelay(int $attempt): int
    {
        return $this->config->getRetryDelay() * (2 ** ($attempt - 1));
    }

    private function handleException(TransferException $exception): \Exception
    {
        if ($exception instanceof ConnectException) {
            return new NetworkException('Network connection failed: ' . $exception->getMessage(), [], 0, $exception);
        }

        if ($exception instanceof RequestException && $exception->hasResponse()) {
            $response = $exception->getResponse();
            $statusCode = $response->getStatusCode();
            $body = $response->getBody()->getContents();
            $data = json_decode($body, true) ?? [];
            $message = $data['error']['message'] ?? $exception->getMessage();

            switch ($statusCode) {
                case 401:
                    return new InvalidApiKeyException($message);
                case 402:
                    return new QuotaExceededException($message, $data['error']['details'] ?? []);
                case 422:
                    return new ValidationException($message, $data['error']['details'] ?? []);
                case 429:
                    $retryAfter = (int) ($response->getHeaderLine('Retry-After') ?: 0);
                    return new RateLimitException($message, $retryAfter, $data['error']['details'] ?? []);
                case 500:
                case 502:
                case 503:
                case 504:
                    return new ServerException($message, $statusCode, $data['error']['details'] ?? []);
                default:
                    return new ServerException($message, $statusCode, $data['error']['details'] ?? []);
            }
        }

        if (strpos($exception->getMessage(), 'timeout') !== false) {
            return new TimeoutException('Request timeout: ' . $exception->getMessage(), [], 0, $exception);
        }

        return new NetworkException('Network request failed: ' . $exception->getMessage(), [], 0, $exception);
    }

    private function parseResponse(ResponseInterface $response): array
    {
        $body = $response->getBody()->getContents();
        $data = json_decode($body, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new ServerException('Invalid JSON response');
        }

        return $data ?? [];
    }
}