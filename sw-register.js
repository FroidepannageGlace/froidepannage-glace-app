// ============================================================
// SW-REGISTER.JS — Enregistrement du Service Worker
// À inclure dans index.html avant la fermeture </body>
// ============================================================

(function () {
  'use strict';

  // Vérifier que le navigateur supporte les Service Workers
  if (!('serviceWorker' in navigator)) {
    console.log('[PWA] Service Workers non supportés sur ce navigateur');
    return;
  }

  // Enregistrer le Service Worker après le chargement de la page
  window.addEventListener('load', function () {

    navigator.serviceWorker.register('/sw.js', { scope: '/' })
      .then(function (registration) {
        console.log('[PWA] Service Worker enregistré :', registration.scope);

        // Vérifier les mises à jour au chargement
        registration.update();

        // Écouter les mises à jour disponibles
        registration.addEventListener('updatefound', function () {
          const newWorker = registration.installing;
          console.log('[PWA] Nouvelle version détectée, téléchargement...');

          newWorker.addEventListener('statechange', function () {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('[PWA] Nouvelle version prête');
              // Afficher le popup de mise à jour dans l'app
              showUpdatePopup();
            }
          });
        });
      })
      .catch(function (err) {
        console.warn('[PWA] Erreur enregistrement Service Worker :', err);
      });

    // Détecter quand une nouvelle version prend le contrôle
    navigator.serviceWorker.addEventListener('controllerchange', function () {
      console.log('[PWA] Nouvelle version active — rechargement');
      window.location.reload();
    });
  });

  // Afficher le popup de mise à jour (celui déjà dans l'app)
  function showUpdatePopup() {
    var popup = document.getElementById('upop');
    if (popup) {
      popup.style.display = 'block';
      // Bouton "Mettre à jour" → forcer le rechargement
      var btn = document.getElementById('btn-update');
      if (btn) {
        btn.addEventListener('click', function () {
          if (navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });
          }
          popup.style.display = 'none';
        });
      }
    }
  }

})();
