import styled from "styled-components";

export const SlideWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 56rem;
  flex: 1 1 auto;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
  margin: 0 auto;
  border: 0.12rem solid ${({ theme }) => theme.colors.primary};
  border-radius: 0.7rem;
  box-shadow: 0 0 1.2rem ${({ theme }) => theme.colors.primary}22;
  background: ${({ theme }) => theme.colors.background};
  /* Custom scrollbar styles */
  &::-webkit-scrollbar {
    width: 0.7rem;
    background: ${({ theme }) => theme.colors.background};
    border-radius: 0.7rem;
  }
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.primary};
    border-radius: 0.7rem;
    box-shadow: 0 0 0.7rem ${({ theme }) => theme.colors.primary};
    border: 2px solid ${({ theme }) => theme.colors.background};
  }
  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.background};
    border-radius: 0.7rem;
  }
  /* Firefox */
  scrollbar-width: thin;
  scrollbar-color: ${({ theme }) => theme.colors.primary} ${({ theme }) => theme.colors.background};
  @media (max-width: 600px) {
    height: 100%;
    max-width: 100vw;
  }
`;

export const SlideView = styled.div<{
  $active: boolean;
  $direction: 'left' | 'right';
}>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  transition: transform 0.45s cubic-bezier(0.7, 0.2, 0.2, 1), opacity 0.3s;
  transform: ${({ $active, $direction }) => {
    if ($active) return 'translateX(0%)';
    return $direction === 'right' ? 'translateX(-100%)' : 'translateX(100%)';
  }};
  opacity: ${({ $active }) => ($active ? 1 : 0)};
  pointer-events: ${({ $active }) => ($active ? 'auto' : 'none')};
`; 