if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(function(registrations) {
    for(let registration of registrations) {
      registration.unregister();
    }
  });
}

import { StrictMode } from 'react'
import { BrowserRouter } from 'react-router-dom'  
import { createRoot } from 'react-dom/client'
import './css/index.css'
import App from './App.jsx'
import { MovieProvider } from './Contexts/MovieContexts'

// Capacitor StatusBar plugin: set status bar color on native only
// This import is safe on the web because we dynamically load the plugin only when running on Capacitor/native.
async function configureStatusBar() {
  try {
    // Detect running on Capacitor by checking for the global Capacitor object
    // If running in web, this will either be undefined or not provide the StatusBar plugin, so we guard.
    const isCapacitor = typeof window !== 'undefined' && window.Capacitor !== undefined;
    if (!isCapacitor) return;

    const { StatusBar } = await import('@capacitor/status-bar');

    // Set a background color matching the app's theme and set style.
    // On Android the color should be a hex string without alpha, e.g. '#0f172a'
    StatusBar.setBackgroundColor({ color: '#0f172a' });
    // Use LIGHT or DARK depending on your content. Set to LIGHT if text/icons should be light-on-dark.
    StatusBar.setStyle({ style: 'DARK' });
  } catch (e) {
    // Silently ignore errors — web environments and missing plugins will throw here.
    console.debug('StatusBar plugin not available or failed to configure:', e?.message || e);
  }
}

configureStatusBar();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <MovieProvider>
        <App />
      </MovieProvider>
    </BrowserRouter>
  </StrictMode>
);

