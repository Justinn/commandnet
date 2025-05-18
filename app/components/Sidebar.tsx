"use client";

import styled from 'styled-components';
import { useRouter } from 'next/navigation';

const NeonIcon = styled.span`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.primary};
  filter: drop-shadow(0 0 0.5rem ${({ theme }) => theme.colors.primary});
  font-size: 1.2rem;
`;

const SidebarContainer = styled.aside`
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

const ToolbarSpacer = styled.div`
  min-height: 5.5rem;
  @media (max-width: 600px) {
    display: none;
  }
`;

const MenuContainer = styled.div`
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
  }
`;

const MenuTitle = styled.h6`
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

const NavList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  @media (max-width: 600px) {
    width: 100vw;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
    height: 100%;
  }
`;

const NavItem = styled.li`
  @media (max-width: 600px) {
    flex: 1 1 0;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
  }
`;

const NavButton = styled.button<{
  $active: boolean;
  $disabled: boolean;
}>`
  width: calc(100% - 1.5rem);
  display: flex;
  align-items: center;
  border-radius: 0.25rem;
  margin: 0 0.75rem 0.5rem 0.75rem;
  padding: 0.5rem 0.75rem;
  min-height: 2.2rem;
  background: ${({ $active }) =>
    $active
      ? 'linear-gradient(90deg, rgba(16,22,36,0.95) 60%, rgba(45,26,74,0.95) 100%)'
      : 'rgba(16,22,36,0.7)'};
  box-shadow: ${({ $active, theme }) =>
    $active ? `0 0 0.5rem ${theme.colors.primary}` : 'none'};
  border: ${({ $active, theme }) =>
    $active ? `1px solid ${theme.colors.primary}` : '1px solid rgba(0,191,255,0.08)'};
  opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  color: ${({ theme }) => theme.colors.primary};
  transition: all 0.2s;
  &:hover {
    background: ${({ $disabled }) =>
      $disabled
        ? undefined
        : 'linear-gradient(90deg, rgba(16,22,36,1) 60%, rgba(45,26,74,1) 100%)'};
    box-shadow: ${({ $disabled, theme }) =>
      $disabled ? undefined : `0 0 0.7rem ${theme.colors.primary}`};
    border: ${({ $disabled, theme }) =>
      $disabled ? undefined : `1px solid ${theme.colors.primary}`};
  }
  @media (max-width: 600px) {
    width: 3.5rem;
    min-width: 3.5rem;
    max-width: 3.5rem;
    height: 3.5rem;
    min-height: 3.5rem;
    max-height: 3.5rem;
    margin: 0 0.25rem;
    padding: 0;
    justify-content: center;
    border-radius: 50%;
    background: ${({ $active }) =>
      $active
        ? 'linear-gradient(135deg, rgba(16,22,36,1) 60%, rgba(45,26,74,1) 100%)'
        : 'rgba(16,22,36,0.7)'};
  }
`;

const NavText = styled.span`
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

const Tooltip = styled.div`
  position: relative;
  display: inline-block;
  cursor: not-allowed;
  &::after {
    content: attr(data-tooltip);
    position: absolute;
    left: 50%;
    top: -2.5rem;
    transform: translateX(-50%);
    background: ${({ theme }) => theme.colors.primary};
    color: #101624;
    padding: 0.25rem 0.75rem;
    border-radius: 0.25rem;
    white-space: nowrap;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.2s;
    z-index: 9999;
    font-size: 0.9rem;
    font-family: ${({ theme }) => theme.fonts.main};
    box-shadow: 0 2px 8px rgba(0,0,0,0.25);
  }
  &:hover::after, &:focus-within::after {
    opacity: 1;
  }
  @media (max-width: 600px) {
    &::after {
      top: -3.5rem;
      left: 50%;
      transform: translateX(-50%);
    }
  }
`;

// Placeholder icons
const HomeIcon = () => <span role="img" aria-label="home">🏠</span>;
const PersonIcon = () => <span role="img" aria-label="person">👤</span>;
const RocketLaunchIcon = () => <span role="img" aria-label="rocket">🚀</span>;
const AssignmentIcon = () => <span role="img" aria-label="assignment">📄</span>;
const PublicIcon = () => <span role="img" aria-label="public">🌐</span>;
const StorefrontIcon = () => <span role="img" aria-label="storefront">🏪</span>;

const NEON_COLOR = '#00bfff'; // blue-cyan neon (Deep Sky Blue)

const navItems = [
  { label: 'Home', icon: HomeIcon, active: true, disabled: false },
  { label: 'Agent', icon: PersonIcon, active: false, disabled: true },
  { label: 'Ships', icon: RocketLaunchIcon, active: false, disabled: true },
  { label: 'Contracts', icon: AssignmentIcon, active: false, disabled: true },
  { label: 'Systems', icon: PublicIcon, active: false, disabled: true },
  { label: 'Markets', icon: StorefrontIcon, active: false, disabled: true },
];

export default function Sidebar() {
  const router = useRouter();
  return (
    <SidebarContainer>
      <ToolbarSpacer />
      <MenuContainer>
        <MenuTitle>Menu</MenuTitle>
        <NavList>
          {navItems.map((item) => {
            const Icon = item.icon;
            const button = (
              <NavButton
                key={item.label}
                $active={item.active}
                $disabled={item.disabled}
                onClick={
                  item.label === 'Home' && !item.disabled
                    ? () => router.push('/')
                    : undefined
                }
                disabled={item.disabled}
                tabIndex={item.disabled ? -1 : 0}
              >
                <NeonIcon>
                  <Icon />
                </NeonIcon>
                <NavText>{item.label}</NavText>
              </NavButton>
            );
            return item.disabled ? (
              <Tooltip key={item.label} data-tooltip="Under construction">
                <span style={{ display: 'block' }}>{button}</span>
              </Tooltip>
            ) : (
              <NavItem key={item.label}>{button}</NavItem>
            );
          })}
        </NavList>
      </MenuContainer>
    </SidebarContainer>
  );
} 