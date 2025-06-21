# Configuration des Variables d'Environnement

Ce projet utilise des variables d'environnement pour gérer les configurations Firebase et Google Auth de manière
sécurisée.

## Configuration Locale

1. Copiez le fichier `.env.example` vers `.env` :
   ```bash
   cp .env.example .env
   ```

2. Remplissez les valeurs dans le fichier `.env` avec vos vraies clés de configuration.

## Variables d'Environnement

### Firebase Configuration

- `EXPO_PUBLIC_FIREBASE_API_KEY` : Clé API Firebase
- `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN` : Domaine d'authentification Firebase
- `EXPO_PUBLIC_FIREBASE_PROJECT_ID` : ID du projet Firebase
- `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET` : Bucket de stockage Firebase
- `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` : ID de l'expéditeur de messages
- `EXPO_PUBLIC_FIREBASE_APP_ID` : ID de l'application Firebase
- `EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID` : ID de mesure Google Analytics

### Google Auth Configuration

- `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID` : Client ID pour iOS
- `EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID` : Client ID pour Android
- `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` : Client ID pour le Web

## Builds EAS

Les variables d'environnement sont automatiquement configurées dans `eas.json` pour tous les profils de build :

- `development`
- `preview`
- `production`

### Commandes de Build

```bash
# Build de développement
eas build --profile development

# Build de preview
eas build --profile preview

# Build de production
eas build --profile production
```

## Sécurité

⚠️ **Important** :

- Le fichier `.env` est dans `.gitignore` et ne doit jamais être commité
- Utilisez `.env.example` comme template
- Pour la production, assurez-vous que toutes les variables sont correctement configurées

## Développement Local

Pour le développement local, les variables du fichier `.env` seront automatiquement chargées par Expo.

```bash
# Démarrer le serveur de développement
npx expo start
```