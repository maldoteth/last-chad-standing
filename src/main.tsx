import React from "react";
import ReactDOM from "react-dom/client";
import { PrivyProvider } from '@privy-io/react-auth';
import App from "./App.tsx";
import "./index.css";

// Add comprehensive tablet-friendly modal styles for Privy
const addPrivyTabletStyles = () => {
  const style = document.createElement('style');
  style.id = 'privy-tablet-styles';
  style.textContent = `
    /* Comprehensive Privy modal tablet styles with black theme */
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
        background-color: #000000 !important;
        background: #000000 !important;
        color: #ffffff !important;
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

// Helper function to detect if an element is a close or back button
const isCloseOrBackButton = (element: Element): boolean => {
  // Check if it's a button element
  if (element.tagName !== 'BUTTON') {
    // Check if it's inside a button
    const buttonParent = element.closest('button');
    if (!buttonParent) return false;
    element = buttonParent;
  }
  
  // Check various attributes and properties that indicate close/back buttons
  const ariaLabel = element.getAttribute('aria-label')?.toLowerCase() || '';
  const className = element.className?.toLowerCase() || '';
  const role = element.getAttribute('role')?.toLowerCase() || '';
  
  // Look for close button indicators
  if (ariaLabel.includes('close') || ariaLabel.includes('back') || 
      className.includes('close') || className.includes('back') ||
      role === 'button') {
    return true;
  }
  
  // Check if it contains close/back icon (X, arrow, etc.)
  const textContent = element.textContent?.trim() || '';
  const innerHTML = element.innerHTML?.toLowerCase() || '';
  
  if (textContent === '×' || textContent === '✕' || textContent === '⨯' ||
      innerHTML.includes('close') || innerHTML.includes('back') ||
      innerHTML.includes('arrow') || innerHTML.includes('×')) {
    return true;
  }
  
  // Check if it's positioned like a close button (top-right area)
  const rect = element.getBoundingClientRect();
  const modal = element.closest('[data-privy-modal], [data-testid="privy-modal"], [data-privy-dialog-content]');
  if (modal) {
    const modalRect = modal.getBoundingClientRect();
    const isTopRight = rect.right > modalRect.right - 60 && rect.top < modalRect.top + 60;
    const isTopLeft = rect.left < modalRect.left + 60 && rect.top < modalRect.top + 60;
    
    if ((isTopRight || isTopLeft) && element.tagName === 'BUTTON') {
      return true;
    }
  }
  
  return false;
};

// Aggressive hover effect override function
const overridePrivyHoverEffects = () => {
  const privyElements = document.querySelectorAll(`
    [data-privy-modal] *, 
    [data-testid="privy-modal"] *, 
    [data-privy-dialog-content] *,
    div[role="dialog"][aria-modal="true"] *
  `);
  
  privyElements.forEach((element: any) => {
    if (element.style) {
      // Check if this is a close or back button
      const isButton = isCloseOrBackButton(element);
      
      if (isButton) {
        // For close/back buttons, only force transparent background and black icons
        element.style.background = 'transparent';
        element.style.backgroundColor = 'transparent';
        element.style.border = 'none';
        element.style.borderRadius = '0';
        element.style.boxShadow = 'none';
        
        // Force icon colors to black for visibility
        const svgs = element.querySelectorAll('svg, path');
        svgs.forEach((svg: any) => {
          if (svg.style) {
            svg.style.fill = '#000000';
            svg.style.stroke = '#000000';
            svg.style.color = '#000000';
          }
        });
        
        return; // Skip the rest of the processing for close/back buttons
      }
      
      // Store original styles for non-button elements
      const originalBg = element.style.backgroundColor || '#000000';
      const originalColor = element.style.color || '#ffffff';
      
      // Override mouse events for regular elements
      element.addEventListener('mouseenter', (e: any) => {
        e.stopPropagation();
        if (element.style && !isCloseOrBackButton(element)) {
          element.style.backgroundColor = '#000000';
          element.style.background = '#000000';
          element.style.color = '#ffffff';
          element.style.transition = 'none';
          element.style.transform = 'none';
          element.style.filter = 'none';
        }
      }, true);
      
      element.addEventListener('mouseleave', (e: any) => {
        e.stopPropagation();
        if (element.style && !isCloseOrBackButton(element)) {
          element.style.backgroundColor = originalBg;
          element.style.color = originalColor;
        }
      }, true);
      
      element.addEventListener('mouseover', (e: any) => {
        e.stopPropagation();
        if (element.style && !isCloseOrBackButton(element)) {
          element.style.backgroundColor = '#000000';
          element.style.background = '#000000';
          element.style.color = '#ffffff';
        }
      }, true);
    }
  });
};

// Set up mutation observer to re-apply styles and override hover effects
const observePrivyModals = () => {
  const observer = new MutationObserver((mutations) => {
    let shouldReapply = false;
    
    mutations.forEach((mutation) => {
      // Check for new nodes
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const element = node as Element;
          if (element.querySelector?.('[data-privy-modal], [data-testid="privy-modal"], .privy-modal') ||
              element.matches?.('[data-privy-modal], [data-testid="privy-modal"], .privy-modal')) {
            shouldReapply = true;
          }
        }
      });
      
      // Check for style attribute changes
      if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
        const element = mutation.target as Element;
        if (element.closest('[data-privy-modal], [data-testid="privy-modal"], [data-privy-dialog-content]')) {
          // Force override inline styles that might be white
          if (element instanceof HTMLElement && element.style) {
            if (element.style.backgroundColor?.includes('white') || 
                element.style.backgroundColor?.includes('#fff') ||
                element.style.background?.includes('white') ||
                element.style.background?.includes('#fff')) {
              element.style.backgroundColor = '#000000';
              element.style.background = '#000000';
              element.style.color = '#ffffff';
            }
          }
        }
      }
    });
    
    if (shouldReapply) {
      setTimeout(() => {
        addPrivyTabletStyles();
        overridePrivyHoverEffects();
      }, 50);
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['style', 'class']
  });
  
  // Also run periodically to catch any dynamic changes
  setInterval(overridePrivyHoverEffects, 1000);
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
      appId="cmetmshr8000gib0bakyp8zxa"
      config={{
        appearance: {
          theme: 'light',
          accentColor: '#000000',
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
