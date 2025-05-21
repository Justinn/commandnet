import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { RegisterAgentForm } from './index';
import { ThemeProvider } from 'styled-components';
import { theme } from '@/app/theme';

// Mock useSession
let mockSession: any = { user: { email: 'testuser@example.com' } };
jest.mock('next-auth/react', () => ({
  useSession: () => ({ data: mockSession }),
}));

// Mock useAgent
jest.mock('@/app/context/AgentContext', () => ({
  useAgent: () => ({ selectedAgent: null }),
}));

beforeAll(() => {
  Object.defineProperty(HTMLFormElement.prototype, 'checkValidity', {
    value: () => true,
    configurable: true,
  });
});

describe('RegisterAgentForm', () => {
  const setup = () => {
    return render(
      <ThemeProvider theme={theme}>
        <RegisterAgentForm />
      </ThemeProvider>
    );
  };

  beforeEach(() => {
    mockSession = { user: { email: 'testuser@example.com' } };
    jest.clearAllMocks();
  });

  it('renders form fields and email', () => {
    setup();
    expect(screen.getByText(/Registering as:/)).toBeInTheDocument();
    expect(screen.getByText('testuser@example.com')).toBeInTheDocument();
    expect(screen.getByLabelText(/Agent Symbol/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Faction/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Account Token/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Register Agent/i })).toBeInTheDocument();
  });

  it('shows (unknown) if no session email', () => {
    mockSession = undefined;
    setup();
    expect(screen.getByText('(unknown)', { selector: 'b' })).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    const { container } = setup();
    fireEvent.change(screen.getByLabelText(/Faction/i), { target: { value: 'COSMIC' } });
    fireEvent.change(screen.getByLabelText(/Account Token/i), { target: { value: 'sometoken' } });
    const form = container.querySelector('form');
    fireEvent.submit(form!);
    await waitFor(() => {
      const errors = screen.getAllByText((content, node) =>
        !!node && !!node.textContent && node.textContent.includes('Please provide Symbol and Faction.')
      );
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  it('validates account token required', async () => {
    const { container } = setup();
    fireEvent.change(screen.getByLabelText(/Agent Symbol/i), { target: { value: 'AGENT' } });
    fireEvent.change(screen.getByLabelText(/Faction/i), { target: { value: 'COSMIC' } });
    const form = container.querySelector('form');
    fireEvent.submit(form!);
    await waitFor(() => {
      const matches = screen.getAllByText((content, node) =>
        !!node && !!node.textContent && node.textContent.includes('Please provide your SpaceTraders Account Token.')
      );
      expect(matches.length).toBeGreaterThan(0);
    });
  });

  it('validates symbol max length', async () => {
    setup();
    fireEvent.change(screen.getByLabelText(/Agent Symbol/i), { target: { value: 'A'.repeat(15) } });
    fireEvent.change(screen.getByLabelText(/Account Token/i), { target: { value: 'token' } });
    fireEvent.click(screen.getByRole('button', { name: /Register Agent/i }));
    await waitFor(() => {
      expect(screen.getByText('Symbol must be at most 14 characters.')).toBeInTheDocument();
    });
  });

  it('submits form and shows success message', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ symbol: 'AGENT', startingFaction: 'COSMIC' }),
    });
    setup();
    fireEvent.change(screen.getByLabelText(/Agent Symbol/i), { target: { value: 'AGENT' } });
    fireEvent.change(screen.getByLabelText(/Account Token/i), { target: { value: 'token' } });
    fireEvent.click(screen.getByRole('button', { name: /Register Agent/i }));
    await waitFor(() => {
      expect(screen.getByText(/Agent 'AGENT' registered with faction 'COSMIC'/)).toBeInTheDocument();
    });
    // Fields should be cleared
    expect(screen.getByLabelText(/Agent Symbol/i)).toHaveValue('');
    expect(screen.getByLabelText(/Account Token/i)).toHaveValue('');
  });

  it('shows error message from API', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'Registration failed' }),
    });
    setup();
    fireEvent.change(screen.getByLabelText(/Agent Symbol/i), { target: { value: 'AGENT' } });
    fireEvent.change(screen.getByLabelText(/Account Token/i), { target: { value: 'token' } });
    fireEvent.click(screen.getByRole('button', { name: /Register Agent/i }));
    await waitFor(() => {
      expect(screen.getByText(/Registration failed/)).toBeInTheDocument();
    });
  });

  it('shows network error', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));
    setup();
    fireEvent.change(screen.getByLabelText(/Agent Symbol/i), { target: { value: 'AGENT' } });
    fireEvent.change(screen.getByLabelText(/Account Token/i), { target: { value: 'token' } });
    fireEvent.click(screen.getByRole('button', { name: /Register Agent/i }));
    await waitFor(() => {
      expect(screen.getByText('Network error. Please try again.')).toBeInTheDocument();
    });
  });

  it('disables submit button and shows loading text when loading', async () => {
    // Use a promise to control fetch resolution
    let resolveFetch: any;
    global.fetch = jest.fn().mockImplementation(
      () => new Promise(resolve => { resolveFetch = resolve; })
    );
    setup();
    fireEvent.change(screen.getByLabelText(/Agent Symbol/i), { target: { value: 'AGENT' } });
    fireEvent.change(screen.getByLabelText(/Account Token/i), { target: { value: 'token' } });
    fireEvent.click(screen.getByRole('button', { name: /Register Agent/i }));
    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByRole('button')).toHaveTextContent('Registering...');
    // Resolve fetch to finish loading
    resolveFetch && resolveFetch({ ok: true, json: async () => ({ symbol: 'AGENT', startingFaction: 'COSMIC' }) });
    await waitFor(() => {
      expect(screen.getByText(/Agent 'AGENT' registered/)).toBeInTheDocument();
    });
  });

  it('has accessible labels and required fields', () => {
    setup();
    expect(screen.getByLabelText(/Agent Symbol/i)).toBeRequired();
    expect(screen.getByLabelText(/Faction/i)).toBeRequired();
    expect(screen.getByLabelText(/Account Token/i)).toBeRequired();
  });
});
