export default function () {
  try {
    let sentryjs = document.createElement('script');
    sentryjs.async = true;
    sentryjs.type = 'text/javascript';
    sentryjs.crossorigin = 'anonymous';
    sentryjs.src = 'https://cdn.ravenjs.com/3.26.2/raven.min.js';
    const sentryLoaded = function () {
      window.Raven.config('https://6734563574df44879830b65353ff5d64@log-sentry.zmlearn.com/85').install();
    };

    sentryjs.addEventListener('load', sentryLoaded, false);
    document.body.appendChild(sentryjs);
    sentryjs = null;
  } catch (error) {
    console.error('error in raven', error);
  }
}
