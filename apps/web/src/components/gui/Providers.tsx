'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export interface SiteContextValue {
  reducedMotion: boolean;
  isMobile: boolean;
}

const SiteContext = createContext<SiteContextValue>({ reducedMotion: false, isMobile: false });

export function SiteProviders({ children }: { children: ReactNode }) {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(media.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    media.addEventListener('change', handler);
    return () => media.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return (
    <SiteContext.Provider value={{ reducedMotion, isMobile }}>
      {children}
    </SiteContext.Provider>
  );
}

export function useSite() {
  return useContext(SiteContext);
}
