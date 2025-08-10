# PulseSend SDKs 📦

> Official multi-language SDKs for the PulseSend API

## 🌍 Available SDKs

| Language | Package | Version | Status |
|----------|---------|---------|--------|
| **JavaScript/TypeScript** | [`@pulsesend/sdks`](./packages/javascript) | ![npm](https://img.shields.io/npm/v/@pulsesend/sdks) | ✅ **Published** |
| **PHP** | [`pulsesend/php-sdk`](./packages/php) | ![Packagist](https://img.shields.io/packagist/v/pulsesend/php-sdk) | ✅ **Published** |
| **Python** | [`pulsesend-python`](./packages/python) | ![PyPI](https://img.shields.io/pypi/v/pulsesend-python) | ⏳ Planned |
| **Go** | [`pulsesend-sdks/go`](./packages/go) | ![Go](https://img.shields.io/github/v/tag/jiordiviera/pulsesend-sdks?filter=go/*) | ⏳ Planned |

## 🚀 Quick Installation

### JavaScript/TypeScript

```bash
bun add @pulsesend/sdks
# or npm install @pulsesend/sdks
```

### PHP

```bash
composer require pulsesend/php-sdk
```

### Python

```bash
pip install pulsesend-python
```

### Go

```bash
go get github.com/jiordiviera/pulsesend-sdks/go
```

## 💡 Usage Example

```javascript
import { PulseSend } from '@pulsesend/sdks'

const client = new PulseSend('pk_live_...')

await client.emails.send({
  to: ['user@example.com'],
  subject: 'Bienvenue chez PulseSend {{name}}!',
  html: '<h1>Salut {{name}} 👋</h1><p>Merci de rejoindre notre communauté camerounaise!</p>',
  tags: ['onboarding', 'cameroun'],
  metadata: { user_id: '123', source: 'douala_signup' }
})
```

## 🛠️ Development

This monorepo uses [Bun](https://bun.sh) as package manager.

```bash
# Install dependencies
bun install

# Build all SDKs
bun run build

# Run tests
bun run test

# Dev mode (watch)
bun run dev
```

## 📚 Documentation

- [Getting Started Guide](./docs/getting-started.md)
- [Integration Examples](./examples/)
- [Complete API Reference](./docs/api-reference.md)

## 🤝 Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for contribution guidelines.

## 📄 License

MIT © [PulseSend](https://pulsesend.com)