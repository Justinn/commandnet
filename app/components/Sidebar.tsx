"use client";

import styled from 'styled-components';
import { useRouter, usePathname } from 'next/navigation';
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { useEffect, useState } from 'react';
// React Icons
import { FaHome, FaUser, FaRocket, FaFileAlt, FaGlobe, FaStore, FaSignOutAlt } from 'react-icons/fa';

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
    justify-content: flex-start;
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

const NavItem = styled.li`
  @media (max-width: 600px) {
    flex: 0 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
  }
`;

const NavButton = styled.button<{
  $$active: boolean;
  $$disabled: boolean;
}>`
  width: calc(100% - 1.5rem);
  display: flex;
  align-items: center;
  border-radius: 0.25rem;
  margin: 0 0.75rem 0.5rem 0.75rem;
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
  color: ${({ theme }) => theme.colors.primary};
  transition: all 0.2s;
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
    background: ${({ $$active }) =>
      $$active
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

const navItems = [
  { label: 'Home', icon: FaHome, active: false, disabled: false, path: '/' },
  { label: 'Manage Agents', icon: FaUser, active: false, disabled: false, path: '/agents' },
  { label: 'Ships', icon: FaRocket, active: false, disabled: true },
  { label: 'Contracts', icon: FaFileAlt, active: false, disabled: true },
  { label: 'Systems', icon: FaGlobe, active: false, disabled: true },
  { label: 'Markets', icon: FaStore, active: false, disabled: true },
];

const BoxyButton = styled.button`
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

const LogoutIconButton = styled.button`
  background: ${({ theme }) => 'linear-gradient(90deg, rgba(16,22,36,0.95) 60%, rgba(45,26,74,0.95) 100%)'};
  color: ${({ theme }) => theme.colors.primary};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  box-shadow: 0 0 0.5rem ${({ theme }) => theme.colors.primary};
  width: 3.5rem;
  height: 3.5rem;
  min-width: 3.5rem;
  min-height: 3.5rem;
  max-width: 3.5rem;
  max-height: 3.5rem;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 2rem;
  margin: 0 0.25rem;
  transition: background 0.2s, box-shadow 0.2s, color 0.2s;
  &:hover, &:focus {
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.background};
    box-shadow: 0 0 1.5rem ${({ theme }) => theme.colors.primary};
    border: 1px solid ${({ theme }) => theme.colors.primary};
  }
`;

// Custom hook to detect mobile view
function useIsMobile(breakpoint = 600) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= breakpoint);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, [breakpoint]);
  return isMobile;
}

const SlidingSidebarContainer = styled(SidebarContainer)<{ $mobile: boolean }>`
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

const DesktopLogoutButton = styled(BoxyButton)`
  display: block;
  max-width: 10rem;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  @media (max-width: 600px) {
    display: none;
  }
`;

const MobileLogoutButton = styled(LogoutIconButton)`
  display: none;
  @media (max-width: 600px) {
    display: flex;
  }
`;

export default function Sidebar() {
  const { status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const isMobile = useIsMobile(600);
  // Dynamically set disabled for 'Manage Agents' if not authenticated
  const navItemsWithAuth = navItems.map(item =>
    item.label === 'Manage Agents'
      ? { ...item, disabled: status !== 'authenticated' }
      : item
  );
  return (
    <SlidingSidebarContainer $mobile={isMobile}>
      <ToolbarSpacer />
      <MenuContainer>
        <MenuTitle>Menu</MenuTitle>
        <NavList>
          {navItemsWithAuth.map((item) => {
            const Icon = item.icon;
            const isActive = item.path ? pathname === item.path : item.active;
            const button = (
              <NavButton
                key={item.label}
                $$active={isActive}
                $$disabled={item.disabled}
                onClick={
                  !item.disabled && item.path
                    ? () => router.push(item.path!)
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
              <Tooltip key={item.label} data-tooltip={item.label === 'Manage Agents' ? 'Sign in to manage agents' : 'Under construction'}>
                <span style={{ display: 'block' }}>{button}</span>
              </Tooltip>
            ) : (
              <NavItem key={item.label}>{button}</NavItem>
            );
          })}
          {/* Mobile logout button as a nav item */}
          {status === 'authenticated' && isMobile && (
            <NavItem key="logout-mobile">
              <MobileLogoutButton
                onClick={() => signOut({ callbackUrl: "/login" })}
                aria-label="Logout"
              >
                <FaSignOutAlt />
              </MobileLogoutButton>
            </NavItem>
          )}
        </NavList>
      </MenuContainer>
      {/* Desktop logout button at the bottom */}
      {status === 'authenticated' && !isMobile && (
        <div style={{ width: '100%', marginTop: 'auto', padding: '1.5rem 0 1.5rem 0', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <DesktopLogoutButton
            onClick={() => signOut({ callbackUrl: "/login" })}
          >
            Logout
          </DesktopLogoutButton>
        </div>
      )}
    </SlidingSidebarContainer>
  );
} 