import { useState, useEffect } from 'react';

/**
 * Custom React hook to detect if the viewport is mobile-sized.
 * @param breakpoint - The max width (in px) to consider as mobile. Default is 600.
 * @returns {boolean} True if the viewport width is less than or equal to the breakpoint.
 */
export function useIsMobile(breakpoint: number = 600): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= breakpoint);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, [breakpoint]);

  return isMobile;
} 