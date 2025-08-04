# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] - 2024-08-04

### Added

- Initial release of PulseSend PHP SDK
- Core PulseSend client with configuration management
- PSR-18 compliant HTTP client with Guzzle integration
- Emails service with send(), list(), get(), and cancel() methods
- Analytics service with overview(), engagement(), and reputation() methods
- Comprehensive exception handling with PSR-compliant exceptions
- Retry logic with exponential backoff for failed requests
- Laravel service provider with auto-discovery
- Laravel facade for easy integration
- Configuration file for Laravel applications
- Comprehensive unit and integration tests
- PHPUnit configuration with coverage reporting
- PHPStan static analysis configuration
- PHP CodeSniffer configuration for PSR-12 compliance
- Complete documentation and usage examples

### Features

- PHP 8.0+ compatibility
- Guzzle HTTP client integration
- Automatic retry with exponential backoff
- Comprehensive error handling
- Laravel integration with service provider and facade
- Type declarations and strict typing
- PSR-4 autoloading
- Comprehensive test suite
- Static analysis support
- Code style enforcement

[Unreleased]: https://github.com/pulsesend/pulsesend-sdks/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/pulsesend/pulsesend-sdks/releases/tag/v1.0.0