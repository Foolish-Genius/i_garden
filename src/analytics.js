const GA_ID = import.meta.env.VITE_GA_ID;
const GA_DEBUG = import.meta.env.VITE_GA_DEBUG === 'true';

function log(...args) {
  if (GA_DEBUG) console.debug('[GA]', ...args);
}

export function trackEvent(action, params) {
  if (typeof window === 'undefined') return;
  if (window.gtag) {
    log('trackEvent', action, params);
    window.gtag('event', action, params);
  }
}

export function trackPageview(path) {
  if (typeof window === 'undefined') return;
  if (!GA_ID) return;
  log('pageview', path);
  if (window.gtag) {
    window.gtag('config', GA_ID, { page_path: path });
  }
}

export function sendWebVital(name, value, id) {
  // Send Web Vitals measurements to GA as an event
  if (!GA_ID || typeof window === 'undefined') return;
  log('web-vital', { name, value, id });
  if (window.gtag) {
    window.gtag('event', name, {
      event_category: 'Web Vitals',
      event_label: id,
      value: Math.round(name === 'CLS' ? value * 1000 : value), // CLS is fractional
      non_interaction: true,
    });
  }
}

export function initGA() {
  if (!GA_ID) return;
  // Load the GA script
  if (!document.querySelector(`script[src*="googletagmanager"]`)) {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag(){window.dataLayer.push(arguments);} // eslint-disable-line no-inner-declarations
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', GA_ID, {send_page_view: true});
  }
}
