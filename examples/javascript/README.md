# JavaScript/TypeScript Examples 🟨

Exemples pratiques d'utilisation du SDK JavaScript PulseSend dans différents contextes d'applications web camerounaises.

## 📂 Exemples Disponibles

### 🔥 [Next.js App Router](./nextjs-app/)
Application Next.js 14+ avec App Router et Server Actions pour une boutique e-commerce camerounaise.

**Fonctionnalités :**
- Emails de confirmation de commande
- Newsletter avec gestion des préférences
- Notifications de livraison Douala/Yaoundé
- Intégration Mobile Money (MTN/Orange)

### ⚡ [Express.js API](./express-api/)
API RESTful Express.js pour un service de livraison basé à Douala.

**Fonctionnalités :**
- Endpoints d'envoi d'emails
- Queue management avec Bull Redis
- Webhook handlers PulseSend
- Rate limiting et authentification JWT

### 🎣 [React Hooks](./react-hooks/)
Hooks React personnalisés pour intégrer PulseSend dans vos composants.

**Fonctionnalités :**
- `usePulseSend()` hook
- `useEmailAnalytics()` hook  
- Composants UI réutilisables
- Gestion d'état avec Zustand

### 🌊 [Nuxt.js SSR](./nuxt-ssr/)
Application Nuxt.js avec rendu côté serveur pour un site d'actualités camerounaises.

**Fonctionnalités :**
- Newsletter SSR
- Emails de notification d'articles
- Plugin Nuxt pour PulseSend
- Optimisation SEO

## 🚀 Démarrage Rapide

```bash
# Clonez le repository
git clone https://github.com/jiordiviera/pulsesend-sdks
cd pulsesend-sdks/examples/javascript

# Choisissez un exemple
cd nextjs-app

# Installez les dépendances
npm install
# ou bun install

# Configurez votre environnement
cp .env.example .env
# Ajoutez votre clé API PulseSend

# Lancez l'exemple
npm run dev
```

## 🔧 Configuration Commune

Tous les exemples utilisent cette structure d'environnement :

```env
# .env
PULSESEND_API_KEY=pk_live_your_api_key_here
PULSESEND_BASE_URL=https://api.pulsesend.com/v1

# Optionnel : Configuration avancée
PULSESEND_TIMEOUT=10000
PULSESEND_RETRIES=3
PULSESEND_RETRY_DELAY=1000
```

## 📋 Use Cases Camerounais

### 🛒 E-commerce
- Confirmations de commande
- Notifications de stock
- Suivi de livraison
- Emails de relance panier abandonné

### 🏦 Services Financiers
- OTP pour Mobile Money
- Relevés de compte
- Notifications de transaction
- Alertes sécurité

### 📚 Education
- Notifications aux parents
- Résultats d'examens
- Inscriptions confirmées
- Convocations

### 🏥 Santé
- Rappels de rendez-vous
- Résultats d'analyses
- Campagnes de prévention
- Notifications d'urgence

## 🎯 Patterns Recommandés

### Gestion des Erreurs
```typescript
import { PulseSend, RateLimitError, ValidationError } from '@pulsesend/sdks'

try {
  await client.emails.send(emailData)
} catch (error) {
  if (error instanceof RateLimitError) {
    // Attendre avant de réessayer
    await new Promise(resolve => setTimeout(resolve, error.retryAfter * 1000))
  } else if (error instanceof ValidationError) {
    // Logger les détails de validation
    console.error('Données invalides:', error.details)
  }
}
```

### Configuration avec Types
```typescript
import type { PulseSendConfig } from '@pulsesend/sdks'

const config: PulseSendConfig = {
  apiKey: process.env.PULSESEND_API_KEY!,
  timeout: 15000,
  retries: 2
}

const client = new PulseSend(config)
```

### Templates Localisés
```typescript
const templates = {
  welcome: {
    fr: 'Bienvenue {{name}} chez {{company}} 🇨🇲',
    en: 'Welcome {{name}} to {{company}} 🇨🇲'
  },
  order: {
    fr: 'Votre commande #{{orderNumber}} est confirmée',
    en: 'Your order #{{orderNumber}} is confirmed'
  }
}
```

## 📈 Monitoring et Analytics

Tous les exemples incluent :
- Logging structuré avec Winston/Pino
- Métriques avec Prometheus
- Monitoring d'erreurs avec Sentry
- Analytics avec Google Analytics 4

## 🔍 Tests

Chaque exemple contient :
- Tests unitaires (Jest/Vitest)
- Tests d'intégration
- Tests e2e (Playwright)
- Couverture de code

```bash
# Lancer les tests
npm test

# Tests avec couverture
npm run test:coverage

# Tests e2e
npm run test:e2e
```

## 📚 Documentation Détaillée

- [Guide Next.js](./nextjs-app/README.md)
- [Guide Express](./express-api/README.md)
- [Guide React Hooks](./react-hooks/README.md)
- [Guide Nuxt.js](./nuxt-ssr/README.md)

## 🤝 Contribution

Pour ajouter un nouvel exemple :

1. Créez un nouveau dossier avec un nom descriptif
2. Incluez un `README.md` détaillé
3. Ajoutez `.env.example` avec la configuration nécessaire
4. Écrivez des tests complets
5. Documentez les use cases spécifiques

## 📞 Support

Besoin d'aide ? Contactez-nous :
- **Email** : support@pulsesend.com
- **Discord** : [Communauté PulseSend](https://discord.gg/pulsesend)
- **GitHub** : [Issues](https://github.com/jiordiviera/pulsesend-sdks/issues)