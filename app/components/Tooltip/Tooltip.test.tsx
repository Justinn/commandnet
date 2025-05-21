import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Tooltip } from './index';
import { ThemeProvider } from 'styled-components';
import { theme } from '@/app/theme';

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
}

describe('Tooltip', () => {
  it('renders children and does not show tooltip by default', () => {
    renderWithTheme(
      <Tooltip text="Hello Tooltip"><button>Hover me</button></Tooltip>
    );
    expect(screen.getByText('Hover me')).toBeInTheDocument();
    expect(screen.queryByRole('tooltip')).not.toBeVisible();
  });

  it('shows tooltip on hover', () => {
    renderWithTheme(
      <Tooltip text="Tooltip on hover"><button>Hover</button></Tooltip>
    );
    fireEvent.mouseEnter(screen.getByText('Hover'));
    expect(screen.getByRole('tooltip')).toBeVisible();
    expect(screen.getByRole('tooltip')).toHaveTextContent('Tooltip on hover');
    fireEvent.mouseLeave(screen.getByText('Hover'));
    expect(screen.getByRole('tooltip')).not.toBeVisible();
  });

  it('shows tooltip on focus', () => {
    renderWithTheme(
      <Tooltip text="Tooltip on focus"><button>Focus</button></Tooltip>
    );
    fireEvent.focus(screen.getByText('Focus'));
    expect(screen.getByRole('tooltip')).toBeVisible();
    fireEvent.blur(screen.getByText('Focus'));
    expect(screen.getByRole('tooltip')).not.toBeVisible();
  });

  it('shows tooltip on touch (mobile)', () => {
    renderWithTheme(
      <Tooltip text="Tooltip on touch"><button>Touch</button></Tooltip>
    );
    fireEvent.touchStart(screen.getByText('Touch'));
    expect(screen.getByRole('tooltip')).toBeVisible();
    fireEvent.touchEnd(screen.getByText('Touch'));
    // Tooltip should remain visible for a short time
    expect(screen.getByRole('tooltip')).toBeVisible();
  });

  it('renders long tooltip text correctly', () => {
    const longText = 'This is a very long tooltip text that should not break the component or overflow the screen.';
    renderWithTheme(
      <Tooltip text={longText}><span>LongText</span></Tooltip>
    );
    fireEvent.mouseEnter(screen.getByText('LongText'));
    expect(screen.getByRole('tooltip')).toHaveTextContent(longText);
  });

  it('is accessible with aria-label and role', () => {
    renderWithTheme(
      <Tooltip text="Accessible tooltip"><button>Button</button></Tooltip>
    );
    const wrapper = screen.getByLabelText('Accessible tooltip');
    expect(wrapper).toBeInTheDocument();
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
  });
}); 