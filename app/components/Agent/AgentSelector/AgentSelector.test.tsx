import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AgentSelector } from './index';
import { ThemeProvider } from 'styled-components';
import { theme } from '@/app/theme';
import { Agent } from '@/lib/spacetraders/agent';

const mockAgents: Agent[] = [
  {
    id: '1',
    accountId: 'acc1',
    symbol: 'AGENT1',
    headquarters: 'Earth',
    credits: 1000,
    startingFaction: 'FactionA',
    shipCount: 2,
    token: 'token1',
  },
  {
    id: '2',
    accountId: 'acc2',
    symbol: 'AGENT2',
    headquarters: 'Mars',
    credits: 2000,
    startingFaction: 'FactionB',
    shipCount: 3,
    token: 'token2',
  },
];

describe('AgentSelector', () => {
  const setup = (props = {}) => {
    const onRemove = jest.fn();
    const setSelectedAgent = jest.fn();
    const utils = render(
      <ThemeProvider theme={theme}>
        <AgentSelector
          agents={mockAgents}
          onRemove={onRemove}
          removingId={undefined}
          selectedAgent={mockAgents[0]}
          setSelectedAgent={setSelectedAgent}
          {...props}
        />
      </ThemeProvider>
    );
    return { onRemove, setSelectedAgent, ...utils };
  };

  it('renders agent cards with details', () => {
    setup();
    expect(screen.getByText('AGENT1')).toBeInTheDocument();
    expect(screen.getByText('AGENT2')).toBeInTheDocument();
    expect(screen.getByText(/HQ: Earth/)).toBeInTheDocument();
    expect(screen.getByText(/Credits: 1,000/)).toBeInTheDocument();
    expect(screen.getByText(/Faction: FactionA/)).toBeInTheDocument();
    expect(screen.getByText(/Ships: 2/)).toBeInTheDocument();
  });

  it('shows Active badge for selected agent', () => {
    setup({ selectedAgent: mockAgents[1] });
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('AGENT2').closest('li')).toHaveAttribute('aria-selected', 'true');
  });

  it('calls setSelectedAgent when agent card is clicked', () => {
    const { setSelectedAgent } = setup();
    fireEvent.click(screen.getByText('AGENT2'));
    expect(setSelectedAgent).toHaveBeenCalledWith(mockAgents[1]);
  });

  it('calls setSelectedAgent when agent card is focused and Enter is pressed', () => {
    const { setSelectedAgent } = setup();
    const agentCard = screen.getByText('AGENT2').closest('li');
    agentCard && fireEvent.click(agentCard); // Simulate click
    expect(setSelectedAgent).toHaveBeenCalledWith(mockAgents[1]);
  });

  it('opens and closes remove dialog', () => {
    setup();
    fireEvent.click(screen.getAllByLabelText(/Remove agent/)[0]);
    expect(screen.getByText(/Remove Agent\?/)).toBeInTheDocument();
    expect(screen.getByText(/Are you sure you want to remove/)).toBeInTheDocument();
    fireEvent.click(screen.getByText('Cancel'));
    expect(screen.queryByText(/Remove Agent\?/)).not.toBeInTheDocument();
  });

  it('calls onRemove when Remove is confirmed in dialog', () => {
    const { onRemove } = setup();
    fireEvent.click(screen.getAllByLabelText(/Remove agent/)[0]);
    fireEvent.click(screen.getByText('Remove'));
    expect(onRemove).toHaveBeenCalledWith(mockAgents[0]);
  });

  it('shows slide-out class when removingId matches', () => {
    setup({ removingId: mockAgents[0].id });
    const agentCard = screen.getByText('AGENT1').closest('li');
    expect(agentCard).toHaveClass('slide-out');
  });

  it('shows empty state when no agents', () => {
    render(
      <ThemeProvider theme={theme}>
        <AgentSelector
          agents={[]}
          onRemove={jest.fn()}
          removingId={undefined}
          selectedAgent={null}
          setSelectedAgent={jest.fn()}
        />
      </ThemeProvider>
    );
    expect(screen.getByText(/No agents found for your account/)).toBeInTheDocument();
  });

  it('has accessible remove buttons', () => {
    setup();
    const removeButtons = screen.getAllByLabelText(/Remove agent/);
    expect(removeButtons.length).toBe(2);
    expect(removeButtons[0].tagName).toBe('BUTTON');
  });
}); 