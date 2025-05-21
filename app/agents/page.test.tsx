import React from 'react';
import { render as rtlRender, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AgentsPage from './page';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useAgent } from '@/app/context/AgentContext';
import { ThemeProvider } from 'styled-components';
import { theme } from '@/app/theme';

// Helper render to wrap in ThemeProvider
function render(ui: React.ReactElement) {
  return rtlRender(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
}

// Mock child components
jest.mock('@/app/components/Agent', () => ({
  AgentSelector: jest.fn(() => <div data-testid="agent-selector" />),
  RegisterAgentForm: jest.fn(() => <div data-testid="register-agent-form" />),
  AddExistingAgentForm: jest.fn(() => <div data-testid="add-existing-agent-form" />),
}));
jest.mock('@/app/components/Tabs', () => ({
  Tabs: ({ tabs, active, onChange }: any) => (
    <div data-testid="tabs">
      {tabs.map((tab: any) => (
        <button
          key={tab.value}
          data-testid={`tab-${tab.value}`}
          aria-selected={active === tab.value}
          onClick={() => onChange(tab.value)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  ),
}));
jest.mock('@/app/components/Slide', () => ({
  Slide: ({ children }: any) => <div data-testid="slide">{children}</div>,
  SlideView: ({ children }: any) => <div data-testid="slide-view">{children}</div>,
}));

jest.mock('next-auth/react');
jest.mock('next/navigation');
jest.mock('@/app/context/AgentContext');

const mockRouterReplace = jest.fn();

const mockAgents = [
  {
    id: '1',
    accountId: 'acc1',
    symbol: 'JUSTINN',
    headquarters: 'Earth',
    credits: 1000,
    startingFaction: 'COSMIC',
    shipCount: 2,
    token: 'token1',
  },
  {
    id: '2',
    accountId: 'acc2',
    symbol: 'SPACEY',
    headquarters: 'Mars',
    credits: 2000,
    startingFaction: 'GALACTIC',
    shipCount: 3,
    token: 'token2',
  },
];

describe('AgentsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useSession as jest.Mock).mockReturnValue({ status: 'authenticated' });
    (useRouter as jest.Mock).mockReturnValue({ replace: mockRouterReplace });
    (useAgent as jest.Mock).mockReturnValue({
      agents: mockAgents,
      agentsLoading: false,
      agentsError: null,
      addAgent: jest.fn(),
      removeAgent: jest.fn(),
      selectedAgent: mockAgents[0],
      setSelectedAgent: jest.fn(),
    });
  });

  it('renders the page title and tabs', () => {
    render(<AgentsPage />);
    expect(screen.getByText('Agent Management')).toBeInTheDocument();
    expect(screen.getByTestId('tabs')).toBeInTheDocument();
    expect(screen.getByTestId('tab-select')).toBeInTheDocument();
    expect(screen.getByTestId('tab-add')).toBeInTheDocument();
    expect(screen.getByTestId('tab-register')).toBeInTheDocument();
  });

  it('shows the AgentSelector by default', () => {
    render(<AgentsPage />);
    expect(screen.getByTestId('agent-selector')).toBeInTheDocument();
  });

  it('switches to AddExistingAgentForm when Add tab is clicked', () => {
    render(<AgentsPage />);
    fireEvent.click(screen.getByTestId('tab-add'));
    expect(screen.getByTestId('add-existing-agent-form')).toBeInTheDocument();
  });

  it('switches to RegisterAgentForm when Register tab is clicked', () => {
    render(<AgentsPage />);
    fireEvent.click(screen.getByTestId('tab-register'));
    expect(screen.getByTestId('register-agent-form')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    (useAgent as jest.Mock).mockReturnValue({
      agents: [],
      agentsLoading: true,
      agentsError: null,
      addAgent: jest.fn(),
      removeAgent: jest.fn(),
      selectedAgent: null,
      setSelectedAgent: jest.fn(),
    });
    render(<AgentsPage />);
    expect(screen.getByText('Loading agents...')).toBeInTheDocument();
  });

  it('shows error state', () => {
    (useAgent as jest.Mock).mockReturnValue({
      agents: [],
      agentsLoading: false,
      agentsError: 'Failed to load',
      addAgent: jest.fn(),
      removeAgent: jest.fn(),
      selectedAgent: null,
      setSelectedAgent: jest.fn(),
    });
    render(<AgentsPage />);
    expect(screen.getByText(/Error: Failed to load/)).toBeInTheDocument();
  });

  it('redirects to home if unauthenticated', () => {
    (useSession as jest.Mock).mockReturnValue({ status: 'unauthenticated' });
    render(<AgentsPage />);
    expect(mockRouterReplace).toHaveBeenCalledWith('/');
  });

  it('passes correct props to AddExistingAgentForm', () => {
    render(<AgentsPage />);
    fireEvent.click(screen.getByTestId('tab-add'));
    expect(screen.getByTestId('add-existing-agent-form')).toBeInTheDocument();
  });

  it('passes correct props to RegisterAgentForm', () => {
    render(<AgentsPage />);
    fireEvent.click(screen.getByTestId('tab-register'));
    expect(screen.getByTestId('register-agent-form')).toBeInTheDocument();
  });
}); 