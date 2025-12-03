import * as React from "react"

const MOBILE_BREAKPOINT = 1024

export function useIsMobile() {
  return React.useSyncExternalStore(
    // Subscribe: listen to viewport changes
    (onStoreChange) => {
      const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
      mql.addEventListener("change", onStoreChange)
      return () => mql.removeEventListener("change", onStoreChange)
    },
    // Get current snapshot
    () => window.innerWidth < MOBILE_BREAKPOINT,
    // Server snapshot (SSR safe)
    () => false
  )
}
