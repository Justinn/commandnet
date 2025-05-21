import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { AddExistingAgentForm } from './index';
import '@testing-library/jest-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from '@/app/theme';

// Variable to control the mock session
let mockSession: any = { user: { email: 'testuser@example.com' } };

jest.mock('next-auth/react', () => ({
  useSession: () => ({ data: mockSession }),
}));

describe('AddExistingAgentForm', () => {
  const setup = (props = {}) => {
    const onAgentAdded = jest.fn();
    const utils = render(
      <ThemeProvider theme={theme}>
        <AddExistingAgentForm
          onAgentAdded={onAgentAdded}
          loading={false}
          success=""
          error=""
          {...props}
        />
      </ThemeProvider>
    );
    return { onAgentAdded, ...utils };
  };

  beforeEach(() => {
    mockSession = { user: { email: 'testuser@example.com' } };
  });

  it('renders form fields and email', () => {
    setup();
    expect(screen.getByText(/Adding for:/)).toBeInTheDocument();
    expect(screen.getByText('testuser@example.com')).toBeInTheDocument();
    expect(screen.getByLabelText(/Agent Symbol/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Token/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Add Existing Agent/i })).toBeInTheDocument();
  });

  it('calls onAgentAdded with trimmed values on submit', () => {
    const { onAgentAdded } = setup();
    fireEvent.change(screen.getByLabelText(/Agent Symbol/i), { target: { value: '  AGENT  ' } });
    fireEvent.change(screen.getByLabelText(/Token/i), { target: { value: '  TOKEN  ' } });
    fireEvent.click(screen.getByRole('button', { name: /Add Existing Agent/i }));
    expect(onAgentAdded).toHaveBeenCalledWith('AGENT', 'TOKEN');
  });

  it('disables submit button when loading', () => {
    setup({ loading: true });
    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByRole('button')).toHaveTextContent('Adding...');
  });

  it('shows success message and clears fields', () => {
    const { onAgentAdded, rerender } = setup();
    fireEvent.change(screen.getByLabelText(/Agent Symbol/i), { target: { value: 'AGENT' } });
    fireEvent.change(screen.getByLabelText(/Token/i), { target: { value: 'TOKEN' } });
    fireEvent.click(screen.getByRole('button'));
    rerender(
      <ThemeProvider theme={theme}>
        <AddExistingAgentForm
          onAgentAdded={onAgentAdded}
          loading={false}
          success="Agent added!"
          error=""
        />
      </ThemeProvider>
    );
    expect(screen.getByText('Agent added!')).toBeInTheDocument();
    expect(screen.getByLabelText(/Agent Symbol/i)).toHaveValue('');
    expect(screen.getByLabelText(/Token/i)).toHaveValue('');
  });

  it('shows error message', () => {
    setup({ error: 'Something went wrong' });
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('shows (unknown) if no session email', () => {
    mockSession = undefined;
    setup();
    expect(screen.getByText('(unknown)', { selector: 'b' })).toBeInTheDocument();
  });

  it('has accessible labels and required fields', () => {
    setup();
    expect(screen.getByLabelText(/Agent Symbol/i)).toBeRequired();
    expect(screen.getByLabelText(/Token/i)).toBeRequired();
  });
}); 