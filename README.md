# 🚀 Guide de Déploiement - Boutique E-commerce

Site web interactif et moderne contenant un guide complet de déploiement pour une boutique e-commerce avec Supabase, PHP et VPS.

## ✨ Fonctionnalités

- 📋 **Guide complet** : Instructions détaillées étape par étape
- ⚙️ **Configuration interactive** : Formulaire pour personnaliser toutes les valeurs
- 🤖 **Génération automatique** : Création automatique de scripts de déploiement
- 📦 **Script .bat Windows** : Déploiement entièrement automatisé
- 🌙 **Thème sombre/clair** : Basculement entre thèmes
- 📋 **Copie en un clic** : Copie automatique du schéma SQL Supabase
- 💾 **Sauvegarde locale** : Les valeurs sont sauvegardées dans le navigateur

## 🚀 Déploiement sur Vercel

### Méthode rapide

1. Cliquez sur le bouton ci-dessous pour déployer sur Vercel :

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Spassix/d-ploiement)

2. Ou utilisez Vercel CLI :

```bash
npm i -g vercel
vercel
```

### Méthode manuelle

1. Forkez ce dépôt
2. Allez sur [vercel.com](https://vercel.com)
3. Importez votre fork
4. Déployez !

## 📁 Structure du projet

```
.
├── index.html      # Page principale avec le guide
├── styles.css      # Styles CSS (thème clair/sombre)
├── script.js       # JavaScript (génération de scripts)
├── README.md       # Ce fichier
└── vercel.json     # Configuration Vercel
```

## 🎯 Utilisation

1. **Remplissez le formulaire** en haut de la page avec vos informations :
   - IP du VPS
   - Nom de la boutique
   - Sous-domaine
   - Clés Supabase
   - Mot de passe VPS (optionnel)

2. **Générez le script** : Cliquez sur "🚀 Générer le script de déploiement"

3. **Téléchargez run.bat** : Le fichier est téléchargé automatiquement

4. **Exécutez le script** : Placez `run.bat` dans votre projet et double-cliquez dessus

## 🔧 Prérequis pour le script .bat

- **SSH** : Git for Windows (inclut OpenSSH) ou OpenSSH séparément
- **sshpass** (optionnel mais recommandé) : Pour l'authentification automatique
  - Téléchargez depuis : https://github.com/keimpx/sshpass-windows

## 📝 Fonctionnalités du guide

- ✅ Configuration Supabase complète
- ✅ Configuration SQLite pour les avis
- ✅ Script de déploiement VPS multi-boutiques
- ✅ Génération automatique de config.php
- ✅ Instructions pour Apache/Nginx
- ✅ Configuration SSL avec Certbot
- ✅ Checklist de déploiement interactive

## 🎨 Personnalisation

Le site est entièrement personnalisable :
- Modifiez `styles.css` pour changer les couleurs
- Modifiez `index.html` pour ajouter/modifier le contenu
- Modifiez `script.js` pour ajouter des fonctionnalités

## 📱 Responsive

Le site est entièrement responsive et fonctionne sur :
- 💻 Desktop
- 📱 Mobile
- 📱 Tablette

## 🔒 Sécurité

- ⚠️ Le mot de passe VPS est stocké dans le script .bat généré
- 🔐 Gardez le fichier `run.bat` sécurisé
- 💡 Pour plus de sécurité, utilisez des clés SSH au lieu d'un mot de passe

## 📄 Licence

Ce projet est libre d'utilisation.

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

## 📞 Support

Pour toute question ou problème, ouvrez une issue sur GitHub.

---

**Créé avec ❤️ pour simplifier le déploiement de boutiques e-commerce**
