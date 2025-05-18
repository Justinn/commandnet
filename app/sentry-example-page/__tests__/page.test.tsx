import { render, screen } from '@testing-library/react';
import Page from '@/app/sentry-example-page/page';

// Basic smoke test for the page title

describe('Sentry Example Page', () => {
  it('renders the page title', () => {
    render(<Page />);
    const title = screen.getByTestId('page-title');
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent('sentry-example-page');
  });
}); 