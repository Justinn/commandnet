var pushMock = jest.fn();
var useRouterMock = jest.fn();
var usePathnameMock = jest.fn();

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Sidebar from './index';
import { ThemeProvider } from 'styled-components';
import { theme } from '@/app/theme';
import { Tooltip } from '@/app/components/Tooltip';

jest.mock('next/navigation', () => ({
  useRouter: useRouterMock,
  usePathname: usePathnameMock,
}));

jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
  signOut: jest.fn(),
}));
jest.mock('@/lib/hooks/useIsMobile', () => ({
  useIsMobile: jest.fn(),
}));

const { useSession, signOut } = require('next-auth/react');
const { useIsMobile } = require('@/lib/hooks/useIsMobile');

describe('Sidebar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useRouterMock.mockReturnValue({ push: pushMock });
    usePathnameMock.mockReturnValue('/');
  });

  function setup({
    status = 'unauthenticated',
    pathname = '/',
    isMobile = false,
  } = {}) {
    useSession.mockReturnValue({ status });
    useIsMobile.mockReturnValue(isMobile);
    usePathnameMock.mockReturnValue(pathname);
    return render(
      <ThemeProvider theme={theme}>
        <Sidebar />
      </ThemeProvider>
    );
  }

  it('renders all nav items with correct labels and icons', () => {
    setup();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Manage Agents')).toBeInTheDocument();
    expect(screen.getByText('Ships')).toBeInTheDocument();
    expect(screen.getByText('Contracts')).toBeInTheDocument();
    expect(screen.getByText('Systems')).toBeInTheDocument();
    expect(screen.getByText('Markets')).toBeInTheDocument();
  });

  it('highlights the active nav item', () => {
    setup({ pathname: '/' });
    const homeButton = screen.getByText('Home').closest('button');
    expect(homeButton).toHaveAttribute('aria-current', 'page');
  });

  it('disables "Manage Agents" when unauthenticated and shows tooltip', async () => {
    setup({ status: 'unauthenticated' });
    const manageAgentsButton = screen.getByText('Manage Agents').closest('button');
    expect(manageAgentsButton).toBeDisabled();
    // Tooltip should be present
    fireEvent.mouseOver(screen.getByText('Manage Agents'));
    expect(await screen.findByText('Sign in to manage agents')).toBeInTheDocument();
  });

  it('enables "Manage Agents" when authenticated', () => {
    setup({ status: 'authenticated' });
    const manageAgentsButton = screen.getByText('Manage Agents').closest('button');
    expect(manageAgentsButton).not.toBeDisabled();
  });

  it('shows "Under construction" tooltip for disabled nav items', async () => {
    setup();
    const shipsButton = screen.getByText('Ships').closest('button');
    expect(shipsButton).toBeDisabled();
    fireEvent.mouseOver(screen.getByText('Ships'));
    const tooltips = await screen.findAllByText('Under construction');
    expect(tooltips.length).toBeGreaterThan(0);
  });

  it('renders mobile logout button when authenticated and mobile', () => {
    setup({ status: 'authenticated', isMobile: true });
    expect(screen.getByLabelText('Logout')).toBeInTheDocument();
  });

  it('renders desktop logout button when authenticated and not mobile', () => {
    setup({ status: 'authenticated', isMobile: false });
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  it('calls signOut on logout button click (desktop)', () => {
    setup({ status: 'authenticated', isMobile: false });
    fireEvent.click(screen.getByText('Logout'));
    expect(signOut).toHaveBeenCalledWith({ callbackUrl: '/login' });
  });

  it('calls signOut on logout button click (mobile)', () => {
    setup({ status: 'authenticated', isMobile: true });
    fireEvent.click(screen.getByLabelText('Logout'));
    expect(signOut).toHaveBeenCalledWith({ callbackUrl: '/login' });
  });

  it('navigates to correct path on nav item click', () => {
    setup({ status: 'authenticated', pathname: '/agents' });
    const homeButton = screen.getByText('Home').closest('button');
    expect(homeButton).not.toBeNull();
    if (homeButton) {
      fireEvent.click(homeButton);
      expect(pushMock).toHaveBeenCalledWith('/');
    }
  });

  it('sets tabIndex -1 for disabled items', () => {
    setup();
    const shipsButton = screen.getByText('Ships').closest('button');
    expect(shipsButton).toHaveAttribute('tabindex', '-1');
  });

  it('sets tabIndex 0 for enabled items', () => {
    setup({ status: 'authenticated' });
    const homeButton = screen.getByText('Home').closest('button');
    expect(homeButton).toHaveAttribute('tabindex', '0');
  });
}); 