<?php

declare(strict_types=1);

namespace PulseSend\Services;

use PulseSend\HttpClient;

class EmailsService
{
    private HttpClient $httpClient;

    public function __construct(HttpClient $httpClient)
    {
        $this->httpClient = $httpClient;
    }

    public function send(array $data): array
    {
        $this->validateSendRequest($data);
        return $this->httpClient->post('/emails', $data);
    }

    public function list(array $params = []): array
    {
        return $this->httpClient->get('/emails', $params);
    }

    public function get(string $id): array
    {
        return $this->httpClient->get("/emails/{$id}");
    }

    public function cancel(string $id): array
    {
        return $this->httpClient->delete("/emails/{$id}");
    }

    private function validateSendRequest(array $data): void
    {
        $required = ['to', 'from', 'subject'];
        
        foreach ($required as $field) {
            if (!isset($data[$field]) || empty($data[$field])) {
                throw new \InvalidArgumentException("Field '{$field}' is required");
            }
        }

        if (!isset($data['html']) && !isset($data['text']) && !isset($data['template_id'])) {
            throw new \InvalidArgumentException('At least one of html, text, or template_id is required');
        }

        if (isset($data['to']) && !is_array($data['to'])) {
            throw new \InvalidArgumentException('Field "to" must be an array');
        }

        foreach ($data['to'] as $recipient) {
            if (is_string($recipient)) {
                if (!filter_var($recipient, FILTER_VALIDATE_EMAIL)) {
                    throw new \InvalidArgumentException("Invalid email address: {$recipient}");
                }
            } elseif (is_array($recipient)) {
                if (!isset($recipient['email']) || !filter_var($recipient['email'], FILTER_VALIDATE_EMAIL)) {
                    throw new \InvalidArgumentException('Invalid email address in recipient array');
                }
            } else {
                throw new \InvalidArgumentException('Recipients must be strings or arrays with email field');
            }
        }

        if (is_string($data['from'])) {
            if (!filter_var($data['from'], FILTER_VALIDATE_EMAIL)) {
                throw new \InvalidArgumentException("Invalid from email address: {$data['from']}");
            }
        } elseif (is_array($data['from'])) {
            if (!isset($data['from']['email']) || !filter_var($data['from']['email'], FILTER_VALIDATE_EMAIL)) {
                throw new \InvalidArgumentException('Invalid from email address in array');
            }
        } else {
            throw new \InvalidArgumentException('From field must be a string or array with email field');
        }
    }
}