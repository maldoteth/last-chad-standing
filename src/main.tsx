import React from "react";
import ReactDOM from "react-dom/client";
import { PrivyProvider } from '@privy-io/react-auth';
import App from "./App.tsx";
import "./index.css";

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
