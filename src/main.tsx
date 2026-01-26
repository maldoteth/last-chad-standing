import React from "react";
import ReactDOM from "react-dom/client";
import { PrivyProvider } from '@privy-io/react-auth';
import { SmartWalletsProvider } from '@privy-io/react-auth/smart-wallets';
import App from "./App.tsx";
import "./index.css";
import { base, baseSepolia } from "viem/chains";
import { ProfileProvider } from "./context/profileContext.tsx";
// Add this line at the very top of the file
import { Buffer } from "buffer";
import { NotificationProvider } from "./context/notificationContext.tsx";
if (!window.Buffer) window.Buffer = Buffer;

// Add comprehensive tablet-friendly modal styles for Privy
const addPrivyTabletStyles = () => {
  const style = document.createElement('style');
  style.id = 'privy-tablet-styles';
  style.textContent = `
    /* Comprehensive Privy modal tablet styles */
    @media (max-width: 1024px) {
      /* Target all possible Privy modal selectors */
      [data-privy-modal],
      [data-testid="privy-modal"],
      [data-privy-dialog-content],
      .privy-modal,
      [class*="privy-modal"],
      [id*="privy-modal"],
      div[style*="position: fixed"][style*="z-index"],
      div[role="dialog"][aria-modal="true"] {
        position: fixed !important;
        bottom: 0 !important;
        top: auto !important;
        left: 0 !important;
        right: 0 !important;
        width: 100% !important;
        height: auto !important;
        max-height: 85vh !important;
        min-height: 200px !important;
        border-radius: 20px 20px 0 0 !important;
        transform: translateY(0) !important;
        animation: slideUpFromBottom 0.4s cubic-bezier(0.16, 1, 0.3, 1) !important;
        margin: 0 !important;
        box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.3) !important;
      }
      
      /* Target Privy modal containers */
      [data-privy-modal] > div,
      [data-testid="privy-modal"] > div,
      .privy-modal > div {
        width: 100% !important;
        height: 100% !important;
        border-radius: 20px 20px 0 0 !important;
      }
      
      /* Animation keyframes */
      @keyframes slideUpFromBottom {
        from {
          transform: translateY(100%) !important;
          opacity: 0 !important;
        }
        to {
          transform: translateY(0) !important;
          opacity: 1 !important;
        }
      }
      
      /* Backdrop styling */
      [data-testid="privy-modal-backdrop"],
      [data-privy-backdrop],
      div[style*="background"][style*="fixed"] {
        background: rgba(0, 0, 0, 0.6) !important;
        backdrop-filter: blur(4px) !important;
      }
      
      /* Ensure content is scrollable */
      [data-privy-modal] .scrollable,
      [data-testid="privy-modal"] .scrollable {
        max-height: calc(85vh - 40px) !important;
        overflow-y: auto !important;
      }
    }
  `;

  // Remove existing style if present
  const existingStyle = document.getElementById('privy-tablet-styles');
  if (existingStyle) {
    existingStyle.remove();
  }

  document.head.appendChild(style);
};

// Apply styles immediately
addPrivyTabletStyles();

// Set up mutation observer to re-apply styles when Privy modals are added
const observePrivyModals = () => {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const element = node as Element;
          // Check if this is a Privy modal or contains one
          if (element.querySelector?.('[data-privy-modal], [data-testid="privy-modal"], .privy-modal') ||
            element.matches?.('[data-privy-modal], [data-testid="privy-modal"], .privy-modal')) {
            // Re-apply styles with a slight delay to ensure DOM is ready
            setTimeout(addPrivyTabletStyles, 50);
          }
        }
      });
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
};

// Start observing after DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', observePrivyModals);
} else {
  observePrivyModals();
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <PrivyProvider
      appId={import.meta.env.VITE_APPID}
      config={{
        appearance: {
          theme: 'dark',
          accentColor: '#ffffff',
          logo: undefined,
          showWalletLoginFirst: false,
          walletChainType: 'ethereum-only',
        },
        defaultChain: base,
        supportedChains: [base],
        embeddedWallets: {
          ethereum: {
            createOnLogin: 'users-without-wallets',
          }
        },
      }}
    >
      <SmartWalletsProvider>
        <ProfileProvider>
          <NotificationProvider>
            <App />
          </NotificationProvider>
        </ProfileProvider>
      </SmartWalletsProvider>
    </PrivyProvider>
  </React.StrictMode >
);
