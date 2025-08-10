# Guide de Démarrage PulseSend 🇨🇲

> Guide complet pour intégrer PulseSend dans vos applications camerounaises

## 🌍 À propos de PulseSend

PulseSend est la première plateforme d'email transactionnel pensée pour l'Afrique, avec une infrastructure optimisée pour les entreprises camerounaises et africaines.

### Pourquoi Choisir PulseSend ?

- ✅ **Serveurs localisés** - Infrastructure en Afrique pour une latence optimale
- ✅ **Support français** - Documentation et support en français  
- ✅ **Mobile Money Ready** - Intégration native MTN/Orange Money
- ✅ **Prix accessibles** - Tarification adaptée au marché africain
- ✅ **Conformité locale** - Respect des réglementations camerounaises

## 🚀 Installation Rapide

### JavaScript/TypeScript

```bash
npm install @pulsesend/sdks
# ou
yarn add @pulsesend/sdks
# ou  
bun add @pulsesend/sdks
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

## 🔑 Configuration Initiale

### 1. Créer un Compte

1. Rendez-vous sur [dashboard.pulsesend.com](https://dashboard.pulsesend.com)
2. Inscrivez-vous avec votre email professionnel
3. Vérifiez votre compte via l'email reçu
4. Complétez votre profil entreprise

### 2. Obtenir vos Clés API

```javascript
// Développement
const API_KEY_TEST = 'pk_test_...'

// Production  
const API_KEY_LIVE = 'pk_live_...'
```

### 3. Configuration de Base

```javascript
import { PulseSend } from '@pulsesend/sdks'

// Configuration simple
const client = new PulseSend('pk_live_your_api_key')

// Configuration avancée
const client = new PulseSend({
  apiKey: 'pk_live_your_api_key',
  baseUrl: 'https://api.pulsesend.com/v1',
  timeout: 15000, // 15 secondes
  retries: 3,     // 3 tentatives
  retryDelay: 1000 // 1 seconde entre chaque tentative
})
```

## 📧 Premier Email

### Email Simple

```javascript
const result = await client.emails.send({
  to: ['client@example.cm'],
  from: 'noreply@monentreprise.cm',
  subject: 'Bienvenue chez Mon Entreprise !',
  html: `
    <h1>Bienvenue au Cameroun ! 🇨🇲</h1>
    <p>Merci de rejoindre notre communauté.</p>
  `
})

console.log('Email envoyé:', result.id)
```

### Email avec Variables

```javascript
await client.emails.send({
  to: ['jean.mballa@example.cm'],
  from: 'service@monentreprise.cm',
  subject: 'Confirmation de votre commande #{{numeroCommande}}',
  html: `
    <div style="font-family: Arial, sans-serif;">
      <h1>Bonjour {{prenom}} ! 👋</h1>
      
      <p>Votre commande <strong>#{{numeroCommande}}</strong> 
      d'un montant de <strong>{{montant}} FCFA</strong> 
      a été confirmée.</p>
      
      <div style="background: #f5f5f5; padding: 15px; border-radius: 5px;">
        <h3>Détails de livraison</h3>
        <p><strong>Adresse :</strong> {{adresseLivraison}}</p>
        <p><strong>Ville :</strong> {{ville}}</p>
        <p><strong>Délai :</strong> 2-3 jours ouvrables</p>
      </div>
      
      <p>Merci de faire confiance à Mon Entreprise !</p>
      
      <hr>
      <p style="font-size: 12px; color: #666;">
        Mon Entreprise - Douala, Cameroun<br>
        Email: contact@monentreprise.cm | Tel: +237 6XX XX XX XX
      </p>
    </div>
  `,
  variables: {
    prenom: 'Jean',
    numeroCommande: 'CMD-2024-001',
    montant: '25,000',
    adresseLivraison: 'Rue des Cocotiers, Bonamoussadi',
    ville: 'Douala'
  },
  tags: ['commande', 'confirmation', 'douala'],
  metadata: {
    customer_id: '123',
    order_value: 25000,
    city: 'douala'
  }
})
```

## 🎯 Use Cases Camerounais

### 1. E-commerce (Boutique en Ligne)

```javascript
// Confirmation de commande
const confirmationCommande = {
  subject: 'Commande confirmée #{{numero}} - {{boutique}}',
  html: `
    <h1>Merci {{nom}} pour votre commande ! 🛍️</h1>
    
    <div class="commande-details">
      <h3>Articles commandés</h3>
      {{#articles}}
      <div class="article">
        <span>{{nom}} x{{quantite}}</span>
        <span>{{prix}} FCFA</span>
      </div>
      {{/articles}}
      
      <div class="total">
        <strong>Total: {{total}} FCFA</strong>
      </div>
    </div>
    
    <div class="livraison">
      <h3>Livraison</h3>
      <p><strong>Adresse:</strong> {{adresse}}</p>
      <p><strong>Mode de paiement:</strong> {{paiement}}</p>
      <p><strong>Délai:</strong> 
        {{#if douala}}1-2 jours{{else}}3-5 jours{{/if}}
      </p>
    </div>
  `,
  tags: ['ecommerce', 'confirmation', 'cameroun']
}

// Suivi de livraison
const suiviLivraison = {
  subject: 'Votre commande est en route ! 🚚',
  html: `
    <h1>Bonne nouvelle {{nom}} !</h1>
    <p>Votre commande #{{numero}} a quitté notre entrepôt de Douala.</p>
    
    <div class="tracking">
      <h3>Suivi de livraison</h3>
      <p><strong>Transporteur:</strong> {{transporteur}}</p>
      <p><strong>Numéro de suivi:</strong> {{numeroSuivi}}</p>
      <p><strong>Livraison prévue:</strong> {{dateLivraison}}</p>
    </div>
    
    <a href="{{lienSuivi}}" class="btn-suivi">
      Suivre ma commande
    </a>
  `,
  tags: ['livraison', 'suivi', 'transport']
}
```

### 2. Services Financiers (Mobile Money)

```javascript
// Confirmation de transaction
const confirmationTransaction = {
  subject: 'Transaction confirmée - {{montant}} FCFA',
  html: `
    <h1>Transaction réussie ! ✅</h1>
    
    <div class="transaction-details">
      <h3>Détails de la transaction</h3>
      <p><strong>Montant:</strong> {{montant}} FCFA</p>
      <p><strong>Bénéficiaire:</strong> {{beneficiaire}}</p>
      <p><strong>Opérateur:</strong> {{operateur}}</p>
      <p><strong>Référence:</strong> {{reference}}</p>
      <p><strong>Date:</strong> {{date}}</p>
    </div>
    
    <div class="security-notice">
      <h3>🔒 Sécurité</h3>
      <p>Si vous n'êtes pas à l'origine de cette transaction, 
      contactez immédiatement le {{operateur}} au {{numeroUrgence}}.</p>
    </div>
  `,
  tags: ['mobile-money', 'transaction', 'securite']
}

// Code OTP
const codeOTP = {
  subject: 'Code de vérification - {{service}}',
  html: `
    <h1>Code de vérification</h1>
    
    <div class="otp-code" style="
      font-size: 32px; 
      font-weight: bold; 
      text-align: center; 
      background: #007d3c; 
      color: white; 
      padding: 20px; 
      border-radius: 10px;
      margin: 20px 0;
    ">
      {{codeOTP}}
    </div>
    
    <p><strong>Important:</strong></p>
    <ul>
      <li>Ce code expire dans {{duree}} minutes</li>
      <li>Ne partagez jamais ce code</li>
      <li>Utilisez-le uniquement sur {{service}}</li>
    </ul>
  `,
  tags: ['otp', 'securite', 'verification']
}
```

### 3. Education (Écoles/Universités)

```javascript
// Convocation d'examen
const convocationExamen = {
  subject: 'Convocation - {{matiere}} - {{date}}',
  html: `
    <h1>Convocation d'Examen 📝</h1>
    
    <p>Bonjour {{nomEtudiant}},</p>
    
    <div class="convocation">
      <h3>Détails de l'examen</h3>
      <p><strong>Matière:</strong> {{matiere}}</p>
      <p><strong>Date:</strong> {{date}}</p>
      <p><strong>Heure:</strong> {{heure}}</p>
      <p><strong>Salle:</strong> {{salle}}</p>
      <p><strong>Durée:</strong> {{duree}}</p>
    </div>
    
    <div class="instructions">
      <h3>Instructions importantes</h3>
      <ul>
        <li>Arrivez 15 minutes avant l'heure</li>
        <li>Munissez-vous de votre carte d'étudiant</li>
        <li>Matériel autorisé: {{materielAutorise}}</li>
      </ul>
    </div>
    
    <p>Bonne chance ! 🍀</p>
    
    <hr>
    <p>{{nomEcole}} - {{villeEcole}}, Cameroun</p>
  `,
  tags: ['education', 'convocation', 'examen']
}

// Résultats d'examen
const resultatsExamen = {
  subject: 'Résultats disponibles - {{periode}}',
  html: `
    <h1>Vos résultats sont disponibles ! 🎓</h1>
    
    <p>Cher(e) {{nomEtudiant}},</p>
    
    <p>Les résultats de la période <strong>{{periode}}</strong> 
    sont maintenant disponibles sur votre espace étudiant.</p>
    
    <a href="{{lienResultats}}" class="btn-resultats">
      Consulter mes résultats
    </a>
    
    <div class="stats">
      <h3>Statistiques de la classe</h3>
      <p><strong>Moyenne générale:</strong> {{moyenneClasse}}</p>
      <p><strong>Taux de réussite:</strong> {{tauxReussite}}%</p>
    </div>
  `,
  tags: ['education', 'resultats', 'notes']
}
```

### 4. Santé (Hôpitaux/Cliniques)

```javascript
// Rappel de rendez-vous
const rapelRendezVous = {
  subject: 'Rappel RDV - Dr {{docteur}} - {{date}}',
  html: `
    <h1>Rappel de rendez-vous 🏥</h1>
    
    <p>Bonjour {{nomPatient}},</p>
    
    <p>Nous vous rappelons votre rendez-vous :</p>
    
    <div class="rdv-details">
      <h3>Détails du rendez-vous</h3>
      <p><strong>Médecin:</strong> Dr {{docteur}}</p>
      <p><strong>Spécialité:</strong> {{specialite}}</p>
      <p><strong>Date:</strong> {{date}}</p>
      <p><strong>Heure:</strong> {{heure}}</p>
      <p><strong>Lieu:</strong> {{adresseClirique}}</p>
    </div>
    
    <div class="preparation">
      <h3>Préparation</h3>
      <ul>
        <li>Apportez votre carnet de santé</li>
        <li>Arrivez 10 minutes à l'avance</li>
        <li>Jeûne requis: {{jeuneRequis}}</li>
      </ul>
    </div>
    
    <p>Pour annuler ou reporter: {{telephone}}</p>
  `,
  tags: ['sante', 'rappel', 'rendez-vous']
}
```

## ⚡ Optimisations pour l'Afrique

### 1. Gestion de la Connectivité

```javascript
// Configuration robuste pour connexions instables
const client = new PulseSend({
  apiKey: 'pk_live_...',
  timeout: 30000,  // 30 secondes (connexion parfois lente)
  retries: 5,      // Plus de tentatives
  retryDelay: 2000 // 2 secondes entre tentatives
})

// Retry personnalisé avec backoff exponentiel
const sendEmailWithBackoff = async (emailData) => {
  let attempt = 0
  const maxAttempts = 5
  
  while (attempt < maxAttempts) {
    try {
      return await client.emails.send(emailData)
    } catch (error) {
      attempt++
      if (attempt === maxAttempts) throw error
      
      // Attendre de plus en plus longtemps
      const delay = Math.pow(2, attempt) * 1000
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }
}
```

### 2. Optimisation des Coûts

```javascript
// Groupement d'emails pour économiser
const envoyerEmailsGroupe = async (destinataires, template) => {
  // Grouper par 50 pour optimiser les coûts
  const groupes = []
  for (let i = 0; i < destinataires.length; i += 50) {
    groupes.push(destinataires.slice(i, i + 50))
  }
  
  const resultats = []
  for (const groupe of groupes) {
    const result = await client.emails.send({
      to: groupe,
      ...template
    })
    resultats.push(result)
    
    // Petite pause pour éviter le rate limiting
    await new Promise(resolve => setTimeout(resolve, 100))
  }
  
  return resultats
}
```

### 3. Templates Multilingues

```javascript
const templates = {
  welcome: {
    fr: {
      subject: 'Bienvenue chez {{entreprise}} !',
      html: `
        <h1>Bienvenue {{nom}} ! 🇨🇲</h1>
        <p>Merci de rejoindre notre communauté camerounaise.</p>
      `
    },
    en: {
      subject: 'Welcome to {{company}} !',
      html: `
        <h1>Welcome {{name}} ! 🇨🇲</h1>
        <p>Thank you for joining our Cameroonian community.</p>
      `
    }
  }
}

// Utilisation
const envoyerEmailLocalise = async (destinataire, langue = 'fr') => {
  const template = templates.welcome[langue]
  
  return await client.emails.send({
    to: [destinataire.email],
    from: 'noreply@monentreprise.cm',
    subject: template.subject,
    html: template.html,
    variables: {
      nom: destinataire.nom,
      entreprise: 'Mon Entreprise'
    },
    tags: ['welcome', langue, 'cameroun']
  })
}
```

## 📊 Analytics et Métriques

### Suivi des Performances

```javascript
// Récupérer les analytics
const analytics = await client.analytics.overview({
  startDate: new Date('2024-01-01'),
  endDate: new Date('2024-01-31'),
  tags: ['ecommerce', 'cameroun']
})

console.log('Emails envoyés:', analytics.emails.sent)
console.log('Taux de livraison:', analytics.emails.delivered / analytics.emails.sent * 100 + '%')
console.log('Taux d\'ouverture:', analytics.engagement.openRate * 100 + '%')
console.log('Taux de clic:', analytics.engagement.clickRate * 100 + '%')

// Analytics par région
const analyticsByRegion = await client.analytics.engagement({
  startDate: new Date('2024-01-01'),
  endDate: new Date('2024-01-31'),
  tags: ['douala'] // ou 'yaounde', 'bafoussam', etc.
})
```

### Dashboard Personnalisé

```javascript
const creerDashboard = async () => {
  const [global, douala, yaounde] = await Promise.all([
    client.analytics.overview({ tags: ['cameroun'] }),
    client.analytics.overview({ tags: ['douala'] }),
    client.analytics.overview({ tags: ['yaounde'] })
  ])
  
  return {
    total: {
      sent: global.emails.sent,
      delivered: global.emails.delivered,
      openRate: global.engagement.openRate
    },
    byCity: {
      douala: {
        sent: douala.emails.sent,
        openRate: douala.engagement.openRate
      },
      yaounde: {
        sent: yaounde.emails.sent,
        openRate: yaounde.engagement.openRate
      }
    }
  }
}
```

## 🔒 Sécurité et Bonnes Pratiques

### Variables d'Environnement

```bash
# .env
PULSESEND_API_KEY=pk_live_your_key_here
PULSESEND_WEBHOOK_SECRET=whsec_your_secret_here

# Ne JAMAIS commiter ces clés !
```

### Validation des Données

```javascript
import Joi from 'joi'

const emailSchema = Joi.object({
  to: Joi.array().items(Joi.string().email()).required(),
  subject: Joi.string().min(1).max(200).required(),
  html: Joi.string().required(),
  variables: Joi.object().optional(),
  tags: Joi.array().items(Joi.string()).optional()
})

const envoyerEmailSecurise = async (emailData) => {
  // Validation
  const { error, value } = emailSchema.validate(emailData)
  if (error) {
    throw new Error(`Données invalides: ${error.message}`)
  }
  
  // Sanitisation HTML
  value.html = sanitizeHtml(value.html)
  
  // Envoi
  return await client.emails.send(value)
}
```

### Gestion des Webhooks

```javascript
import crypto from 'crypto'

const verifierWebhook = (signature, payload, secret) => {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex')
    
  return crypto.timingSafeEqual(
    Buffer.from(signature, 'hex'),
    Buffer.from(expectedSignature, 'hex')
  )
}

// Dans votre endpoint webhook
app.post('/webhook/pulsesend', (req, res) => {
  const signature = req.headers['x-pulsesend-signature']
  const payload = JSON.stringify(req.body)
  
  if (!verifierWebhook(signature, payload, process.env.PULSESEND_WEBHOOK_SECRET)) {
    return res.status(401).send('Signature invalide')
  }
  
  // Traiter l'événement...
  res.status(200).send('OK')
})
```

## 🆘 Gestion d'Erreurs

### Types d'Erreurs

```javascript
import { 
  InvalidApiKeyError,
  QuotaExceededError,
  RateLimitError,
  ValidationError,
  NetworkError,
  TimeoutError,
  ServerError
} from '@pulsesend/sdks'

const gererErreurs = async (emailData) => {
  try {
    return await client.emails.send(emailData)
  } catch (error) {
    if (error instanceof InvalidApiKeyError) {
      console.error('Clé API invalide')
      // Vérifier la configuration
    } else if (error instanceof QuotaExceededError) {
      console.error('Quota dépassé, mettre à niveau le plan')
      // Notifier l'admin
    } else if (error instanceof RateLimitError) {
      console.error(`Rate limité, réessayer dans ${error.retryAfter}s`)
      // Attendre et réessayer
      await new Promise(resolve => setTimeout(resolve, error.retryAfter * 1000))
      return gererErreurs(emailData) // Retry
    } else if (error instanceof ValidationError) {
      console.error('Erreur de validation:', error.details)
      // Logger les détails pour debugging
    } else if (error instanceof NetworkError || error instanceof TimeoutError) {
      console.error('Problème de réseau, réessayer plus tard')
      // Mettre en queue pour réessayer
    } else {
      console.error('Erreur inconnue:', error)
      // Logger pour investigation
    }
    
    throw error
  }
}
```

## 🚀 Mise en Production

### Checklist de Déploiement

- [ ] Clés API de production configurées
- [ ] Webhooks testés et sécurisés  
- [ ] Rate limiting configuré
- [ ] Monitoring et alertes activés
- [ ] Logs structurés en place
- [ ] Backup et récupération testés
- [ ] Documentation à jour
- [ ] Tests e2e passants

### Configuration Serveur

```javascript
// Configuration production recommandée
const client = new PulseSend({
  apiKey: process.env.PULSESEND_API_KEY_LIVE,
  timeout: 20000,
  retries: 3,
  retryDelay: 2000
})

// Pool de connexions pour haute charge
const pool = new Pool({
  create: () => new PulseSend({...}),
  destroy: (client) => client.close?.(),
  max: 10, // 10 connexions max
  min: 2   // 2 connexions min
})
```

## 📱 Contact et Support

### Support Technique
- **Email** : support@pulsesend.com
- **Discord** : [Communauté PulseSend](https://discord.gg/pulsesend)  
- **GitHub** : [Issues](https://github.com/jiordiviera/pulsesend-sdks/issues)
- **Téléphone** : +237 6XX XX XX XX (Lun-Ven 8h-18h WAT)

### Ressources Utiles
- [Documentation API](https://docs.pulsesend.com)
- [Status Page](https://status.pulsesend.com)
- [Blog](https://blog.pulsesend.com)
- [Exemples GitHub](https://github.com/jiordiviera/pulsesend-sdks/tree/main/examples)

---

*Fait avec ❤️ pour les développeurs camerounais et africains*