import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

// Service Worker Registration for PWA functionality
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('✅ SW registered: ', registration);

        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New content is available, show update notification
                if (confirm('تحديث جديد متاح! هل تريد إعادة تحميل الصفحة؟\nNew update available! Reload page?')) {
                  window.location.reload();
                }
              }
            });
          }
        });
      })
      .catch((registrationError) => {
        console.log('❌ SW registration failed: ', registrationError);
      });
  });
}

// PWA Install Prompt
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault();
  // Stash the event so it can be triggered later
  deferredPrompt = e;

  // Show custom install button or notification
  console.log('💡 PWA install prompt available');

  // You can show a custom install banner here
  const installBanner = document.createElement('div');
  installBanner.innerHTML = `
    <div style="position: fixed; bottom: 20px; left: 20px; right: 20px; background: #059669; color: white; padding: 15px; border-radius: 8px; z-index: 9999; display: flex; justify-content: space-between; align-items: center;">
      <span>📱 تثبيت التطبيق على الهاتف - Install Droguerie Jamal App</span>
      <button onclick="this.parentElement.parentElement.remove()" style="background: rgba(255,255,255,0.2); border: none; color: white; padding: 5px 10px; border-radius: 4px; cursor: pointer;">✕</button>
    </div>
  `;

  // Add click handler for install
  installBanner.addEventListener('click', async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`PWA install prompt outcome: ${outcome}`);
      deferredPrompt = null;
      document.body.removeChild(installBanner);
    }
  });

  document.body.appendChild(installBanner);

  // Auto-hide after 10 seconds
  setTimeout(() => {
    if (document.body.contains(installBanner)) {
      document.body.removeChild(installBanner);
    }
  }, 10000);
});

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Failed to find root element");
}

createRoot(rootElement).render(<App />);
