let Sentry = null;

export function initMonitoring() {
  const dsn = import.meta.env.VITE_SENTRY_DSN;
  if (!dsn) return;
  // lazy-import Sentry to avoid adding it to initial bundle when not configured
  import('@sentry/react').then((mod) => {
    Sentry = mod;
    Sentry.init({
      dsn,
      environment: import.meta.env.MODE,
      release: import.meta.env.VITE_COMMIT_SHA || undefined,
      tracesSampleRate: 0.0, // don't enable performance tracing by default
    });
  }).catch((err) => console.warn('Failed to initialize Sentry', err));
}

export function captureException(err) {
  if (Sentry && Sentry.captureException) {
    Sentry.captureException(err);
  } else {
    // fallback: console
    console.error(err);
  }
}
