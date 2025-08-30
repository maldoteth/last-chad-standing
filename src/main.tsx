import React from "react";
import ReactDOM from "react-dom/client";
import { PrivyProvider } from '@privy-io/react-auth';
import App from "./App.tsx";
import "./index.css";

// Add tablet-friendly modal styles for Privy
const style = document.createElement('style');
style.textContent = `
  /* Make Privy modal slide up from bottom on tablet */
  @media (max-width: 1024px) {
    [data-testid="privy-modal"] {
      position: fixed !important;
      bottom: 0 !important;
      top: auto !important;
      left: 0 !important;
      right: 0 !important;
      width: 100% !important;
      height: auto !important;
      max-height: 80vh !important;
      border-radius: 16px 16px 0 0 !important;
      transform: translateY(0) !important;
      animation: slideUpFromBottom 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important;
    }
    
    @keyframes slideUpFromBottom {
      from {
        transform: translateY(100%) !important;
      }
      to {
        transform: translateY(0) !important;
      }
    }
    
    [data-testid="privy-modal-backdrop"] {
      background: rgba(0, 0, 0, 0.5) !important;
    }
  }
`;
document.head.appendChild(style);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <PrivyProvider
      appId="cmetmshr8000gib0bakyp8zxa"
      config={{
        appearance: {
          theme: 'dark',
          accentColor: '#ffffff',
          logo: undefined,
          showWalletLoginFirst: false,
          walletChainType: 'ethereum-only',
          walletList: ['metamask', 'coinbase_wallet', 'wallet_connect'],
        },
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
        },
      }}
    >
      <App />
    </PrivyProvider>
  </React.StrictMode>
);
