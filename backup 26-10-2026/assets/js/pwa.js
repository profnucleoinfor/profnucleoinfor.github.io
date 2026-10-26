/* NIC Formação — V21.1
 * Registro centralizado do Service Worker.
 * A instalação continua opcional e silenciosa: falhas não impedem o uso do portal.
 */
(() => {
  'use strict';

  const SERVICE_WORKER_URL = './service-worker.js';

  const registrar = async () => {
    if (!('serviceWorker' in navigator)) return null;

    try {
      const registro = await navigator.serviceWorker.register(SERVICE_WORKER_URL, {
        updateViaCache: 'none'
      });

      await registro.update();
      return registro;
    } catch (error) {
      console.warn('[NIC] Service Worker indisponível.', error);
      return null;
    }
  };

  window.addEventListener('load', registrar, { once: true });

  window.NICPWA = Object.freeze({ registrar });
})();
