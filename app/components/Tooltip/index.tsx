import React, { useRef, useLayoutEffect, useState, useCallback } from 'react';
import { TooltipWrapper, TooltipContent } from './Tooltip.styles';

interface TooltipProps {
  children: React.ReactNode;
  text: string;
  className?: string;
  fullWidth?: boolean;
}

export const Tooltip: React.FC<TooltipProps> = ({ children, text, className, fullWidth }) => {
  const wrapperRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ left?: number; right?: number; top?: number }>({});
  const [visible, setVisible] = useState(false);
  const hideTimeout = useRef<NodeJS.Timeout | null>(null);

  // Positioning logic
  useLayoutEffect(() => {
    const wrapper = wrapperRef.current;
    const tooltip = tooltipRef.current;
    if (!wrapper || !tooltip) return;

    setPos({});

    const wrapperRect = wrapper.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    let left: number | undefined;
    let right: number | undefined;
    let top: number | undefined;

    let tooltipLeft = wrapperRect.left + wrapperRect.width / 2 - tooltipRect.width / 2;
    let tooltipRight = tooltipLeft + tooltipRect.width;
    let tooltipTop = wrapperRect.top - tooltipRect.height - 8;

    if (tooltipLeft < 4) {
      left = 4 - wrapperRect.left;
    }
    if (tooltipRight > viewportWidth - 4) {
      left = viewportWidth - tooltipRect.width - wrapperRect.left - 4;
    }
    if (tooltipTop < 4) {
      top = wrapperRect.height + 8;
    }

    setPos({ left, top });
  }, [text, visible]);

  // Touch support
  const showTooltip = useCallback(() => {
    setVisible(true);
    if (hideTimeout.current) clearTimeout(hideTimeout.current);
  }, []);

  const hideTooltip = useCallback(() => {
    if (hideTimeout.current) clearTimeout(hideTimeout.current);
    hideTimeout.current = setTimeout(() => setVisible(false), 1200); // Show for 1.2s after tap
  }, []);

  // Hide on outside touch
  useLayoutEffect(() => {
    if (!visible) return;
    const handleTouch = (e: TouchEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setVisible(false);
      }
    };
    document.addEventListener('touchstart', handleTouch);
    return () => document.removeEventListener('touchstart', handleTouch);
  }, [visible]);

  return (
    <TooltipWrapper
      className={className}
      tabIndex={0}
      aria-label={text}
      ref={wrapperRef}
      onTouchStart={showTooltip}
      onTouchEnd={hideTooltip}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
      style={fullWidth ? { display: 'block', width: '100%' } : undefined}
    >
      {children}
      <TooltipContent
        className="tooltip-content"
        role="tooltip"
        ref={tooltipRef}
        $left={pos.left}
        $right={pos.right}
        $top={pos.top}
        $visible={visible}
      >
        {text}
      </TooltipContent>
    </TooltipWrapper>
  );
}; 