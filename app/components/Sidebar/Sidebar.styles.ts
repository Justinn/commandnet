import styled from 'styled-components';

export const NeonIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.primary};
  filter: drop-shadow(0 0 0.5rem ${({ theme }) => theme.colors.primary});
  font-size: 1.2rem;
  @media (max-width: 600px) {
    width: 1.4rem;
    height: 1.4rem;
    min-width: 1.4rem;
    min-height: 1.4rem;
    max-width: 1.4rem;
    max-height: 1.4rem;
    border-radius: 50%;
    background: none;
    padding: 0;
    margin: 0;
    box-sizing: border-box;
  }
`;

export const SidebarContainer = styled.aside`
  position: relative;
  width: 14rem;
  flex-shrink: 0;
  background: ${({ theme }) => theme.colors.sidebarGradient};
  border-right: 0.125rem solid ${({ theme }) => theme.colors.primary};
  box-shadow: 0 0 1.5rem ${({ theme }) => theme.colors.primary};
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  z-index: 20000;
  overflow: visible;

  @media (max-width: 600px) {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100vw;
    height: 4.5rem;
    min-height: unset;
    flex-direction: row;
    align-items: center;
    border-right: none;
    border-top: 0.125rem solid ${({ theme }) => theme.colors.primary};
    border-bottom: none;
    box-shadow: 0 -2px 1.5rem ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.sidebarGradient};
  }
`;

export const ToolbarSpacer = styled.div`
  min-height: 5.5rem;
  @media (max-width: 600px) {
    display: none;
  }
`;

export const MenuContainer = styled.div`
  flex: 1 1 auto;
  overflow-y: auto;
  overflow-x: hidden;
  margin-top: 2rem;
  overflow: visible;
  @media (max-width: 600px) {
    margin-top: 0;
    width: 100vw;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
    height: 100%;
    flex: unset;
  }
`;

export const MenuTitle = styled.h6`
  color: ${({ theme }) => theme.colors.primary};
  font-family: var(--font-share-tech-mono);
  font-weight: 700;
  font-size: 1.1rem;
  letter-spacing: 0.18em;
  text-shadow: 0 0 1rem ${({ theme }) => theme.colors.primary};
  margin-bottom: 2rem;
  margin-left: 2rem;
  text-transform: uppercase;
  @media (max-width: 600px) {
    display: none;
  }
`;

export const NavList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  @media (max-width: 600px) {
    width: 100vw;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    height: 100%;
    overflow-x: auto;
    overflow-y: hidden;
    white-space: nowrap;
    scrollbar-width: thin;
    scrollbar-color: ${({ theme }) => theme.colors.primary} transparent;
    &::-webkit-scrollbar {
      height: 0.3rem;
      background: transparent;
    }
    &::-webkit-scrollbar-thumb {
      background: ${({ theme }) => theme.colors.primary};
      border-radius: 0.2rem;
    }
  }
`;

export const NavItem = styled.li`
  @media (max-width: 600px) {
    flex: 0 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
  }
`;

// --- DRY BUTTONS ---

export const BaseButton = styled.button`
  display: flex;
  align-items: center;
  border-radius: 0.25rem;
  font-family: var(--font-share-tech-mono);
  font-weight: 600;
  font-size: 0.95rem;
  letter-spacing: 0.12em;
  color: ${({ theme }) => theme.colors.primary};
  transition: all 0.2s;
  cursor: pointer;
  border: none;
  background: none;
`;

export const IconButton = styled(BaseButton)`
  width: 3.5rem;
  height: 3.5rem;
  min-width: 3.5rem;
  min-height: 3.5rem;
  max-width: 3.5rem;
  max-height: 3.5rem;
  justify-content: center;
  border-radius: 50%;
  font-size: 2rem;
  margin: 0 0.25rem;
  padding: 0;
`;

export const NavButton = styled(BaseButton)<{
  $$active: boolean;
  $$disabled: boolean;
}>`
  width: calc(100% - 1rem);
  margin: 0 0.5rem 0.5rem 0.5rem;
  padding: 0.5rem 0.75rem;
  min-height: 2.2rem;
  background: ${({ $$active }) =>
    $$active
      ? 'linear-gradient(90deg, rgba(16,22,36,0.95) 60%, rgba(45,26,74,0.95) 100%)'
      : 'rgba(16,22,36,0.7)'};
  box-shadow: ${({ $$active, theme }) =>
    $$active ? `0 0 0.5rem ${theme.colors.primary}` : 'none'};
  border: ${({ $$active, theme }) =>
    $$active ? `1px solid ${theme.colors.primary}` : '1px solid rgba(0,191,255,0.08)'};
  opacity: ${({ $$disabled }) => ($$disabled ? 0.5 : 1)};
  cursor: ${({ $$disabled }) => ($$disabled ? 'not-allowed' : 'pointer')};
  &:hover {
    background: ${({ $$disabled }) =>
      $$disabled
        ? undefined
        : 'linear-gradient(90deg, rgba(16,22,36,1) 60%, rgba(45,26,74,1) 100%)'};
    box-shadow: ${({ $$disabled, theme }) =>
      $$disabled ? undefined : `0 0 0.7rem ${theme.colors.primary}`};
    border: ${({ $$disabled, theme }) =>
      $$disabled ? undefined : `1px solid ${theme.colors.primary}`};
  }
  @media (max-width: 600px) {
    width: 2.5rem;
    height: 2.5rem;
    aspect-ratio: 1 / 1;
    min-width: 2.5rem;
    min-height: 2.5rem;
    max-width: 2.5rem;
    max-height: 2.5rem;
    margin: 0 0.25rem;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: ${({ $$active }) =>
      $$active
        ? 'linear-gradient(135deg, rgba(16,22,36,1) 60%, rgba(45,26,74,1) 100%)'
        : 'rgba(16,22,36,0.7)'};
    border: 1px solid ${({ theme }) => theme.colors.primary};
    box-shadow: none;
    opacity: ${({ $$disabled }) => ($$disabled ? 0.5 : 1)};
    cursor: ${({ $$disabled }) => ($$disabled ? 'not-allowed' : 'pointer')};
    pointer-events: ${({ $$disabled }) => ($$disabled ? 'none' : 'auto')};
    & ${NeonIcon} {
      filter: ${({ $$disabled, theme }) =>
        $$disabled
          ? `grayscale(1) opacity(0.5) drop-shadow(0 0 0.5rem ${theme.colors.primary})`
          : `drop-shadow(0 0 0.5rem ${theme.colors.primary})`};
    }
  }
`;

export const BoxyButton = styled(BaseButton)`
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.primary};
  border: 0.15rem solid ${({ theme }) => theme.colors.primary};
  border-radius: 0.22rem;
  padding: 0.5rem 0.7rem;
  font-size: 1rem;
  font-weight: 700;
  width: 100%;
  margin: 0.5rem 0 0 0;
  box-shadow: 0 0 0.7rem ${({ theme }) => theme.colors.primary}33;
  transition: background 0.18s, color 0.18s, border 0.18s;
  cursor: pointer;
  &:hover {
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.background};
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

export const LogoutIconButton = styled(IconButton)`
  background: ${({ theme }) => 'linear-gradient(90deg, rgba(16,22,36,0.95) 60%, rgba(45,26,74,0.95) 100%)'};
  color: ${({ theme }) => theme.colors.primary};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  box-shadow: 0 0 0.5rem ${({ theme }) => theme.colors.primary};
  transition: background 0.2s, box-shadow 0.2s, color 0.2s;
  &:hover, &:focus {
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.background};
    box-shadow: 0 0 1.5rem ${({ theme }) => theme.colors.primary};
    border: 1px solid ${({ theme }) => theme.colors.primary};
  }
`;

export const SlidingSidebarContainer = styled(SidebarContainer)<{ $mobile: boolean }>`
  @media (max-width: 600px) {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100vw;
    min-height: unset;
    height: 4.5rem;
    transform: translateY(${({ $mobile }) => ($mobile ? '0' : '100%')});
    transition: transform 0.38s cubic-bezier(0.4, 0.2, 0.2, 1);
    z-index: 20000;
  }
`;

export const DesktopLogoutButton = styled(BoxyButton)`
  display: block;
  max-width: 10rem;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  @media (max-width: 600px) {
    display: none;
  }
`;

export const MobileLogoutButton = styled(LogoutIconButton)`
  display: none;
  @media (max-width: 600px) {
    display: flex;
    width: 2.5rem;
    height: 2.5rem;
    aspect-ratio: 1 / 1;
    min-width: 2.5rem;
    min-height: 2.5rem;
    max-width: 2.5rem;
    max-height: 2.5rem;
    margin: 0 0.25rem;
    padding: 0;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: ${({ theme }) => 'linear-gradient(90deg, rgba(16,22,36,0.95) 60%, rgba(45,26,74,0.95) 100%)'};
    border: 1px solid ${({ theme }) => theme.colors.primary};
    box-shadow: none;
    opacity: 1;
    cursor: pointer;
    color: #FF4B4B;
    & > svg {
      font-size: 1.4rem;
    }
  }
`;

export const NavText = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  font-family: var(--font-share-tech-mono);
  font-weight: 600;
  font-size: 0.95rem;
  letter-spacing: 0.12em;
  margin-left: 0.5rem;
  @media (max-width: 600px) {
    display: none;
  }
`; 