import styled, { keyframes, css } from 'styled-components';

export const TooltipWrapper = styled.span`
  position: relative;
  display: inline-block;
  cursor: not-allowed;

  &:focus-within .tooltip-content,
  &:hover .tooltip-content {
    opacity: 1;
    pointer-events: auto;
  }
`;

// Animation: floating, fade-in, and scale
const floatScaleIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(8px) scale(0.95);
    box-shadow: 0 0.2em 0.8em rgba(0,0,0,0.25);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
    box-shadow: 0 0.4em 1.2em rgba(0,0,0,0.38);
  }
`;

export const TooltipContent = styled.div<{
  $left?: number;
  $right?: number;
  $top?: number;
  $visible: boolean;
}>`
  position: absolute;
  left: ${({ $left }) => ($left !== undefined ? `${$left}px` : '50%')};
  right: ${({ $right }) => ($right !== undefined ? `${$right}px` : 'auto')};
  top: ${({ $top }) => ($top !== undefined ? `${$top}px` : '-2.5em')};
  transform: ${({ $left, $right, $visible }) =>
    $left !== undefined || $right !== undefined
      ? $visible
        ? 'translateY(0) scale(1)'
        : 'translateY(8px) scale(0.95)'
      : $visible
        ? 'translateX(-50%) translateY(0) scale(1)'
        : 'translateX(-50%) translateY(8px) scale(0.95)'};
  background: rgba(16, 22, 36, 0.98);
  color: #fff;
  padding: 0.25em 0.75em;
  border-radius: 0.25em;
  white-space: nowrap;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  pointer-events: none;
  transition: opacity 0.2s, box-shadow 0.22s cubic-bezier(.4,0,.2,1), transform 0.22s cubic-bezier(.4,0,.2,1);
  z-index: 9999;
  font-size: 0.9em;
  font-family: ${({ theme }) => theme.fonts.main};
  box-shadow: none;
  animation: ${({ $visible }) => $visible ? css`${floatScaleIn} 0.22s cubic-bezier(.4,0,.2,1)` : 'none'};
`;