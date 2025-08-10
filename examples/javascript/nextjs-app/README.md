# Next.js App Router + PulseSend 🔥

Exemple d'intégration PulseSend dans une application Next.js 14+ avec App Router pour **Mballa Shop**, une boutique e-commerce camerounaise basée à Douala.

## 🛍️ À propos du projet

**Mballa Shop** est une boutique en ligne spécialisée dans la vente d'articles traditionnels camerounais, avec livraison à Douala, Yaoundé et dans les 10 régions du Cameroun.

## ✨ Fonctionnalités Email

- ✅ **Confirmation de commande** avec détails produits
- ✅ **Suivi de livraison** avec transporteurs locaux  
- ✅ **Newsletter** avec préférences personnalisées
- ✅ **Abandons de panier** avec relances intelligentes
- ✅ **Notifications Mobile Money** (MTN/Orange)
- ✅ **Emails de bienvenue** nouveaux clients

## 🚀 Démarrage Rapide

```bash
# Installation
cd examples/javascript/nextjs-app
npm install

# Configuration
cp .env.example .env.local
# Ajoutez votre clé API PulseSend

# Développement
npm run dev

# Production
npm run build
npm start
```

## 📁 Structure du Projet

```
nextjs-app/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── emails/
│   │   │   │   ├── send/route.ts          # API endpoint envoi
│   │   │   │   └── webhook/route.ts       # Webhook PulseSend
│   │   │   └── newsletter/route.ts        # Newsletter signup
│   │   ├── commandes/
│   │   │   └── [id]/page.tsx             # Page de commande
│   │   ├── panier/page.tsx               # Page panier
│   │   └── layout.tsx                    # Layout principal
│   ├── components/
│   │   ├── EmailForm.tsx                 # Formulaire email
│   │   ├── NewsletterSignup.tsx          # Inscription newsletter
│   │   └── OrderConfirmation.tsx         # Confirmation commande
│   ├── lib/
│   │   ├── pulsesend.ts                  # Configuration PulseSend
│   │   ├── email-templates.ts            # Templates email
│   │   └── utils.ts                      # Utilitaires
│   └── types/
│       └── index.ts                      # Types TypeScript
├── public/
│   └── images/                           # Assets
├── .env.example                          # Variables d'environnement
└── package.json
```

## 🔧 Configuration

### Variables d'Environnement

```env
# .env.local
PULSESEND_API_KEY=pk_live_your_api_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Configuration optionnelle
PULSESEND_TIMEOUT=15000
PULSESEND_WEBHOOK_SECRET=your_webhook_secret
```

### Client PulseSend

```typescript
// src/lib/pulsesend.ts
import { PulseSend } from '@pulsesend/sdks'

export const pulsesend = new PulseSend({
  apiKey: process.env.PULSESEND_API_KEY!,
  timeout: parseInt(process.env.PULSESEND_TIMEOUT!) || 15000,
})
```

## 📧 Templates Email

### Confirmation de Commande

```typescript
// src/lib/email-templates.ts
export const orderConfirmationTemplate = {
  subject: 'Commande confirmée #{{orderNumber}} - Mballa Shop 🛍️',
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #007d3c;">Akwaaba {{customerName}} ! 👋</h1>
      
      <p>Votre commande <strong>#{{orderNumber}}</strong> a été confirmée avec succès.</p>
      
      <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>Détails de la commande</h3>
        {{#items}}
        <div style="display: flex; justify-content: space-between; margin: 10px 0;">
          <span>{{name}} x{{quantity}}</span>
          <span>{{price}} FCFA</span>
        </div>
        {{/items}}
        <hr>
        <div style="display: flex; justify-content: space-between; font-weight: bold;">
          <span>Total</span>
          <span>{{total}} FCFA</span>
        </div>
      </div>
      
      <p><strong>Livraison :</strong> {{deliveryAddress}}</p>
      <p><strong>Mode de paiement :</strong> {{paymentMethod}}</p>
      
      <p>Votre commande sera livrée sous 2-5 jours ouvrables.</p>
      
      <p>Merci de faire confiance à Mballa Shop ! 🇨🇲</p>
    </div>
  `,
  tags: ['order-confirmation', 'ecommerce', 'cameroun']
}
```

### Newsletter Hebdomadaire

```typescript
export const newsletterTemplate = {
  subject: 'Nouveautés de la semaine - Mballa Shop 📩',
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #007d3c;">Les nouveautés de cette semaine 🔥</h1>
      
      <p>Bonjour {{firstName}},</p>
      
      <p>Découvrez nos dernières nouveautés directement depuis Douala :</p>
      
      {{#products}}
      <div style="border: 1px solid #ddd; border-radius: 8px; padding: 15px; margin: 15px 0;">
        <h3>{{name}}</h3>
        <p>{{description}}</p>
        <p style="font-size: 18px; font-weight: bold; color: #007d3c;">{{price}} FCFA</p>
        <a href="{{url}}" style="background: #007d3c; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
          Voir le produit
        </a>
      </div>
      {{/products}}
      
      <p>Livraison gratuite à Douala et Yaoundé pour toute commande > 25,000 FCFA</p>
      
      <hr>
      <p style="font-size: 12px; color: #666;">
        <a href="{{unsubscribeUrl}}">Se désinscrire</a> | 
        <a href="{{preferencesUrl}}">Gérer mes préférences</a>
      </p>
    </div>
  `,
  tags: ['newsletter', 'promotion', 'cameroun']
}
```

## 🎯 Server Actions

### Confirmation de Commande

```typescript
// src/app/commandes/actions.ts
'use server'

import { pulsesend } from '@/lib/pulsesend'
import { orderConfirmationTemplate } from '@/lib/email-templates'

export async function sendOrderConfirmation(orderData: OrderData) {
  try {
    const result = await pulsesend.emails.send({
      to: [orderData.customerEmail],
      from: 'commandes@mballa-shop.cm',
      subject: orderConfirmationTemplate.subject,
      html: orderConfirmationTemplate.html,
      variables: {
        customerName: orderData.customerName,
        orderNumber: orderData.orderNumber,
        items: orderData.items,
        total: orderData.total,
        deliveryAddress: orderData.deliveryAddress,
        paymentMethod: orderData.paymentMethod === 'momo' ? 'Mobile Money' : 'Carte bancaire'
      },
      tags: orderConfirmationTemplate.tags,
      metadata: {
        order_id: orderData.id,
        customer_id: orderData.customerId,
        source: 'nextjs-app'
      }
    })

    return { success: true, emailId: result.id }
  } catch (error) {
    console.error('Erreur envoi email confirmation:', error)
    return { success: false, error: error.message }
  }
}
```

### Newsletter Signup

```typescript
// src/app/newsletter/actions.ts
'use server'

import { pulsesend } from '@/lib/pulsesend'

export async function subscribeNewsletter(email: string, preferences: NewsletterPreferences) {
  try {
    // Envoi email de bienvenue
    await pulsesend.emails.send({
      to: [email],
      from: 'newsletter@mballa-shop.cm',
      subject: 'Bienvenue dans notre newsletter ! 🎉',
      html: `
        <h1>Merci {{name}} !</h1>
        <p>Vous recevrez nos dernières nouveautés chaque semaine.</p>
        <p>Première livraison gratuite avec le code: <strong>WELCOME2024</strong></p>
      `,
      variables: { name: preferences.firstName },
      tags: ['newsletter-welcome', 'onboarding']
    })

    return { success: true, message: 'Inscription réussie !' }
  } catch (error) {
    return { success: false, error: error.message }
  }
}
```

## 🔗 API Routes

### Webhook PulseSend

```typescript
// src/app/api/emails/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'

export async function POST(request: NextRequest) {
  const headersList = headers()
  const signature = headersList.get('x-pulsesend-signature')
  
  // Vérifier la signature du webhook
  if (!verifyWebhookSignature(signature, request.body)) {
    return NextResponse.json({ error: 'Signature invalide' }, { status: 401 })
  }

  const event = await request.json()

  switch (event.type) {
    case 'email.delivered':
      // Mettre à jour le statut de la commande
      await updateOrderStatus(event.data.metadata.order_id, 'email_delivered')
      break
      
    case 'email.opened':
      // Tracker l'ouverture pour les analytics
      await trackEmailOpen(event.data.id, event.data.metadata)
      break
      
    case 'email.clicked':
      // Tracker les clics pour les analytics
      await trackEmailClick(event.data.id, event.data.click_url)
      break
  }

  return NextResponse.json({ success: true })
}
```

## 🎨 Composants React

### Formulaire de Newsletter

```typescript
// src/components/NewsletterSignup.tsx
'use client'

import { useState } from 'react'
import { subscribeNewsletter } from '@/app/newsletter/actions'

export default function NewsletterSignup() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const result = await subscribeNewsletter(email, {
      firstName: 'Client', // À récupérer du formulaire
      interests: ['nouveautes', 'promotions']
    })

    setMessage(result.success ? result.message : result.error)
    setLoading(false)
    
    if (result.success) {
      setEmail('')
    }
  }

  return (
    <div className="bg-green-50 p-6 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">
        Newsletter Mballa Shop 📧
      </h3>
      
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="votre-email@example.com"
          className="flex-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />
        
        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? 'Inscription...' : "S'inscrire"}
        </button>
      </form>
      
      {message && (
        <p className={`mt-3 text-sm ${message.includes('réussie') ? 'text-green-600' : 'text-red-600'}`}>
          {message}
        </p>
      )}
    </div>
  )
}
```

## 📊 Analytics et Monitoring

### Métriques Email

```typescript
// src/lib/analytics.ts
export async function getEmailAnalytics() {
  const analytics = await pulsesend.analytics.overview({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 jours
    tags: ['order-confirmation', 'newsletter']
  })

  return {
    totalSent: analytics.emails.sent,
    deliveryRate: (analytics.emails.delivered / analytics.emails.sent) * 100,
    openRate: analytics.engagement.openRate * 100,
    clickRate: analytics.engagement.clickRate * 100
  }
}
```

## 🧪 Tests

### Test d'Envoi d'Email

```typescript
// __tests__/email.test.ts
import { sendOrderConfirmation } from '@/app/commandes/actions'

describe('Order Confirmation Email', () => {
  it('should send confirmation email with correct data', async () => {
    const orderData = {
      id: 'order_123',
      customerEmail: 'jean.mballa@example.com',
      customerName: 'Jean Mballa',
      orderNumber: 'CMD-2024-001',
      total: 35000,
      items: [
        { name: 'Kaba traditionnelle', quantity: 1, price: 25000 },
        { name: 'Sac en raphia', quantity: 2, price: 5000 }
      ],
      deliveryAddress: 'Bonamoussadi, Douala',
      paymentMethod: 'momo'
    }

    const result = await sendOrderConfirmation(orderData)
    
    expect(result.success).toBe(true)
    expect(result.emailId).toBeDefined()
  })
})
```

## 🚀 Déploiement

### Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Variables d'environnement Vercel

```bash
vercel env add PULSESEND_API_KEY
vercel env add PULSESEND_WEBHOOK_SECRET
```

## 📈 Performance

- **Emails transactionnels** : ~200ms de latence
- **Emails marketing** : Traitement en arrière-plan avec Queue
- **Webhooks** : Réponse < 100ms
- **Analytics** : Cache Redis 5 minutes

## 🔍 Debugging

### Logs Structurés

```typescript
import { logger } from '@/lib/logger'

logger.info('Email envoyé', {
  emailId: result.id,
  recipient: orderData.customerEmail,
  template: 'order-confirmation',
  metadata: { order_id: orderData.id }
})
```

## 📚 Ressources

- [Documentation Next.js App Router](https://nextjs.org/docs/app)
- [Guide PulseSend](https://docs.pulsesend.com)
- [Tailwind CSS](https://tailwindcss.com)
- [TypeScript](https://www.typescriptlang.org)

## 🤝 Support

Questions ? Contactez-nous :
- **Email** : support@pulsesend.com  
- **GitHub** : [Issues](https://github.com/jiordiviera/pulsesend-sdks/issues)
- **Discord** : [Communauté](https://discord.gg/pulsesend)