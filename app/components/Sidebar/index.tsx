"use client";

import { useRouter, usePathname } from 'next/navigation';
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
// React Icons
import { FaHome, FaUser, FaRocket, FaFileAlt, FaGlobe, FaStore, FaSignOutAlt } from 'react-icons/fa';
import { useIsMobile } from '@/lib/hooks/useIsMobile';
import { Tooltip } from '@/app/components/Tooltip';
import {
  NeonIcon,
  ToolbarSpacer,
  MenuContainer,
  MenuTitle,
  NavList,
  NavItem,
  NavButton,
  NavText,
  SlidingSidebarContainer,
  DesktopLogoutButton,
  MobileLogoutButton,
} from '@/app/components/Sidebar/Sidebar.styles';
import { SessionStatus } from '@/app/types/session';

const navItems = [
  { label: 'Home', icon: FaHome, active: false, disabled: false, path: '/' },
  { label: 'Manage Agents', icon: FaUser, active: false, disabled: false, path: '/agents' },
  { label: 'Ships', icon: FaRocket, active: false, disabled: true },
  { label: 'Contracts', icon: FaFileAlt, active: false, disabled: true },
  { label: 'Systems', icon: FaGlobe, active: false, disabled: true },
  { label: 'Markets', icon: FaStore, active: false, disabled: true },
];

export default function Sidebar() {
  const { status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const isMobile = useIsMobile(600);
  // Dynamically set disabled for 'Manage Agents' if not authenticated
  const navItemsWithAuth = navItems.map(item =>
    item.label === 'Manage Agents'
      ? { ...item, disabled: status !== SessionStatus.Authenticated }
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
                aria-current={isActive ? 'page' : undefined}
              >
                <NeonIcon>
                  <Icon />
                </NeonIcon>
                <NavText>{item.label}</NavText>
              </NavButton>
            );
            return item.disabled ? (
              <Tooltip key={item.label} text={item.label === 'Manage Agents' ? 'Sign in to manage agents' : 'Under construction'} fullWidth>
                <span>{button}</span>
              </Tooltip>
            ) : (
              <NavItem key={item.label}>{button}</NavItem>
            );
          })}
          {/* Mobile logout button as a nav item */}
          {status === SessionStatus.Authenticated && isMobile && (
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
      {status === SessionStatus.Authenticated && !isMobile && (
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