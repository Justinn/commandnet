import styled from "styled-components";

export const TabsBar = styled.div`
  position: relative;
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2.2rem;
  background: ${({ theme }) => theme.colors.background};
  border-radius: 0.7rem;
  box-shadow: 0 0 0.7rem ${({ theme }) => theme.colors.primary}22;
  padding: 0.3rem 0.3rem;
  @media (max-width: 600px) {
    width: 100%;
    justify-content: center;
    margin-bottom: 1.2rem;
  }
`;

export const TabButton = styled.button<{ $active: boolean; $disabled: boolean }>`
  position: relative;
  flex: 1 1 0;
  font-family: var(--font-share-tech-mono);
  font-size: 1.1rem;
  font-weight: 700;
  color: ${({ theme, $active, $disabled }) =>
    $disabled
      ? theme.colors.textSecondary
      : $active
      ? theme.colors.primary
      : theme.colors.textPrimary};
  background: transparent;
  border: none;
  border-radius: 0.5rem;
  padding: 0.7rem 2.2rem 0.7rem 2.2rem;
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ $disabled }) => ($disabled ? 0.6 : 1)};
  transition: color 0.18s, opacity 0.18s;
  z-index: 1;
  @media (max-width: 600px) {
    font-size: 1rem;
    padding: 0.5rem 1.2rem 0.5rem 1.2rem;
  }
`;

export const TabHighlight = styled.div<{ $index: number; $count: number }>`
  position: absolute;
  bottom: 0.15rem;
  left: ${({ $index, $count }) => `${($index / $count) * 100}%`};
  height: 0.22rem;
  width: ${({ $count }) => `${100 / $count}%`};
  background: ${({ theme }) => theme.colors.primary};
  border-radius: 0.2rem;
  box-shadow: 0 0 0.7rem ${({ theme }) => theme.colors.primary};
  transition: left 0.32s cubic-bezier(0.7, 0.2, 0.2, 1);
`; 