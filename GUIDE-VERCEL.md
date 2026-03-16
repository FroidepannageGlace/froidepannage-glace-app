# GUIDE DÉPLOIEMENT — App PWA sur Vercel
# app.livraison-glacons-marseille.fr
# ============================================================

## CONTENU DE CE PACKAGE
- index.html       → L'application PWA complète
- manifest.json    → Passeport PWA
- sw.js            → Service Worker (cache + offline + MAJ auto)
- sw-register.js   → Enregistrement automatique
- vercel.json      → Configuration Vercel
- icons/           → 8 icônes (72px → 512px)

## ÉTAPES SUR VERCEL

### 1. Créer un compte Vercel (gratuit)
- Allez sur : vercel.com
- Cliquez "Sign Up"
- Connectez-vous avec votre compte Google ou email

### 2. Déployer l'app (méthode simple — glisser-déposer)
- Sur le dashboard Vercel → "Add New Project"
- Faites glisser-déposer le dossier package-vercel/
- Vercel détecte automatiquement la config
- Cliquez "Deploy"
- En 30 secondes → votre app est en ligne ! ✅

### 3. Lier votre domaine OVH (sous-domaine app.)
- Dans Vercel → votre projet → Settings → Domains
- Ajoutez : app.livraison-glacons-marseille.fr
- Vercel vous donne un enregistrement DNS à ajouter
- Sur OVH → Zone DNS → Ajoutez l'enregistrement CNAME fourni par Vercel
- Propagation : 5 minutes à 2h

### 4. Tester l'app
- Ouvrez : https://app.livraison-glacons-marseille.fr
- Sur Android Chrome → ⋮ → "Ajouter à l'écran d'accueil" ✅
- Sur iPhone Safari → Partager → "Sur l'écran d'accueil" ✅

## MISES À JOUR (méthode simple)

Quand on fait une modification avec Claude :
1. Je télécharge le nouveau index.html (ou autre fichier modifié)
2. Sur Vercel → votre projet → "Deployments"
3. Glisser-déposer le nouveau fichier
4. Vercel redéploie en 30 secondes
5. Le Service Worker envoie automatiquement le popup
   "Mise à jour disponible" à tous vos clients ✅

## AVANTAGES VERCEL vs OVH pour l'app
✅ HTTPS automatique et gratuit
✅ CDN mondial (app ultra-rapide même en 3G)
✅ Déploiement en 30 secondes
✅ Rollback en 1 clic si erreur
✅ Logs en temps réel
✅ 100% gratuit jusqu'à 100k visiteurs/mois

## ARCHITECTURE FINALE
livraison-glacons-marseille.fr     → OVH  (site vitrine)
app.livraison-glacons-marseille.fr → Vercel (app PWA clients)

© 2025 Froidepannagebar — 9 Imp. Tontini, 13012 Marseille
