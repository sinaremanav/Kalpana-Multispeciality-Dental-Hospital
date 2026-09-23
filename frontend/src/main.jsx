import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';

// Initialize Google Search Console verification token if provided in environment
const gscVerification = import.meta.env.VITE_GSC_VERIFICATION;
if (gscVerification && typeof document !== 'undefined') {
  let meta = document.querySelector('meta[name="google-site-verification"]');
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('name', 'google-site-verification');
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', gscVerification);
}

// Initialize Google Analytics if Measurement ID is provided in environment
const gaId = import.meta.env.VITE_GA_MEASUREMENT_ID;
if (gaId && typeof window !== 'undefined' && typeof document !== 'undefined') {
  const gaScript = document.createElement('script');
  gaScript.async = true;
  gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
  document.head.appendChild(gaScript);

  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  gtag('js', new Date());
  gtag('config', gaId);
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
