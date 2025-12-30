import { useState, useEffect } from 'react';

const MOBILE_BREAKPOINT = 768;

export interface ResponsiveState {
  isMobile: boolean;
  isDesktop: boolean;
  width: number;
}

export function useResponsive(): ResponsiveState {
  const [state, setState] = useState<ResponsiveState>(() => ({
    isMobile: typeof window !== 'undefined' ? window.innerWidth < MOBILE_BREAKPOINT : false,
    isDesktop: typeof window !== 'undefined' ? window.innerWidth >= MOBILE_BREAKPOINT : true,
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
  }));

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setState({
        isMobile: width < MOBILE_BREAKPOINT,
        isDesktop: width >= MOBILE_BREAKPOINT,
        width,
      });
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return state;
}
