# Contributing Guide 🤝

Thank you for contributing to the PulseSend SDKs! This guide explains how to participate in development.

## 🚀 Development Setup

### Prerequisites

- **Bun** v1.0+ ([Installation](https://bun.sh))
- **Node.js** 16+ (for compatibility)
- **Git** configured

### Installation

```bash
git clone https://github.com/jiordiviera/pulsesend-sdks
cd pulsesend-sdks
bun install
```

## 📁 Monorepo Structure

```
pulsesend-sdks/
├── packages/
│   ├── javascript/    # JavaScript/TypeScript SDK
│   ├── php/          # PHP SDK with Laravel
│   ├── python/       # Python SDK
│   └── go/           # Go SDK
├── examples/         # Integration examples
├── docs/            # Shared documentation
└── .github/         # CI/CD pipelines
```

## 🔄 Git Workflow

### Branches

- `main` : Production, stable releases
- `develop` : Integration, new features
- `feature/xyz` : New features
- `fix/xyz` : Bug fixes

### Process

1. **Fork** the repository
2. **Create** a branch from `develop`
3. **Develop** with tests
4. **Test** locally
5. **Pull Request** to `develop`

## 🧪 Tests & Quality

### Useful Commands

```bash
# Test all SDKs
bun run test

# Build all SDKs
bun run build

# Lint code
bun run lint

# Dev mode (watch)
bun run dev
```

### Quality Standards

- **Tests** : 90%+ coverage per SDK
- **Types** : TypeScript strict, PHPStan level 8
- **Lint** : ESLint, Prettier, golangci-lint
- **Commits** : [Conventional Commits](https://conventionalcommits.org) convention

## 📦 Adding a New SDK

### Base Template

```bash
# Create structure
mkdir packages/new-sdk
cd packages/new-sdk

# Copy appropriate template
cp -r ../javascript/template/* ./
```

### SDK Checklist

- [ ] `package.json` or equivalent
- [ ] Complete unit tests
- [ ] README documentation
- [ ] Usage examples
- [ ] CI/CD configuration
- [ ] Automatic publication

## 🐛 Reporting a Bug

### GitHub Issues

1. **Search** if the bug already exists
2. **Template** : Use the issue template
3. **Details** : OS, SDK version, reproduction steps
4. **Labels** : Add concerned SDK

### Useful Information

- Used SDK version
- Node.js/PHP/Python/Go version
- Minimal reproduction code
- Complete error logs

## ✨ Proposing a Feature

### Before Developing

1. **Issue** : Create issue with proposal
2. **Discussion** : Exchange with maintainers
3. **Design** : Validate the approach
4. **Implementation** : Follow guidelines

### Design Guidelines

- **Consistency** : Similar API between SDKs
- **Simplicity** : Intuitive interface
- **Performance** : Optimized by default
- **Compatibility** : No breaking changes

## 📋 Pull Request

### PR Checklist

- [ ] Tests pass (`bun run test`)
- [ ] Build succeeds (`bun run build`)
- [ ] Lint OK (`bun run lint`)
- [ ] Documentation updated
- [ ] Changeset created if necessary

### PR Template

```markdown
## 🎯 Description
Brief description of changes

## 🔧 Type of change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation

## 🧪 Tests
- [ ] Unit tests added/modified
- [ ] Manual tests performed

## 📚 Documentation
- [ ] README updated
- [ ] Examples added
- [ ] API docs updated
```

## 🚀 Release Process

### Changesets

```bash
# Add changeset
bun run changeset

# Preview version bump
bun run changeset:version

# Publish (automatic via CI)
bun run changeset:publish
```

### Versioning

- **Patch** : Bug fixes
- **Minor** : New features
- **Major** : Breaking changes

## 🤝 Code of Conduct

We follow the [Contributor Covenant](https://contributor-covenant.org). Be respectful and constructive in all your interactions.

## 📞 Questions?

- **Issues** : Technical questions
- **Discussions** : Ideas, feedback
- **Email** : support@pulsesend.com

---

Thank you for contributing to PulseSend! 🚀