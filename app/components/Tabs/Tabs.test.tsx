import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from 'styled-components';
import Tabs, { Tab } from './index';
import { theme } from '@/app/theme';

const tabs: Tab[] = [
  { label: 'Tab 1', value: 'tab1' },
  { label: 'Tab 2', value: 'tab2' },
  { label: 'Tab 3', value: 'tab3', disabled: true },
];

describe('Tabs', () => {
  function renderTabs(active = 'tab1', onChange = jest.fn()) {
    return render(
      <ThemeProvider theme={theme}>
        <Tabs tabs={tabs} active={active} onChange={onChange} />
      </ThemeProvider>
    );
  }

  it('renders all tab labels', () => {
    renderTabs();
    expect(screen.getByText('Tab 1')).toBeInTheDocument();
    expect(screen.getByText('Tab 2')).toBeInTheDocument();
    expect(screen.getByText('Tab 3')).toBeInTheDocument();
  });

  it('highlights the active tab', () => {
    renderTabs('tab2');
    const tab2 = screen.getByText('Tab 2');
    expect(tab2).toHaveAttribute('aria-selected', 'true');
  });

  it('calls onChange when clicking an enabled tab', () => {
    const onChange = jest.fn();
    renderTabs('tab1', onChange);
    fireEvent.click(screen.getByText('Tab 2'));
    expect(onChange).toHaveBeenCalledWith('tab2');
  });

  it('does not call onChange when clicking a disabled tab', () => {
    const onChange = jest.fn();
    renderTabs('tab1', onChange);
    fireEvent.click(screen.getByText('Tab 3'));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('disabled tab has aria-disabled and is not focusable', () => {
    renderTabs();
    const tab3 = screen.getByText('Tab 3');
    expect(tab3).toHaveAttribute('aria-disabled', 'true');
    expect(tab3).toHaveAttribute('tabindex', '-1');
    expect(tab3).toBeDisabled();
  });

  it('active tab is focusable', () => {
    renderTabs('tab2');
    const tab2 = screen.getByText('Tab 2');
    expect(tab2).toHaveAttribute('tabindex', '0');
  });

  it('inactive, enabled tab is not focusable', () => {
    renderTabs('tab2');
    const tab1 = screen.getByText('Tab 1');
    expect(tab1).toHaveAttribute('tabindex', '-1');
  });

  it('renders the highlight for the active tab', () => {
    renderTabs('tab2');
    // The highlight is a div with role presentation, but we can check its presence
    const highlight = screen.getByRole('tablist').querySelector('div');
    expect(highlight).toBeInTheDocument();
  });
}); 