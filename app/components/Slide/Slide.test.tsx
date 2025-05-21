import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from '@/app/theme';
import { Slide, SlideView } from './index';

describe('Slide', () => {
  function renderSlide(activeIndex = 0, direction: 'left' | 'right' = 'right') {
    return render(
      <ThemeProvider theme={theme}>
        <Slide activeIndex={activeIndex} direction={direction}>
          {/* @ts-expect-error Props injected by Slide */}
          <SlideView data-testid="slide-view">First</SlideView>
          {/* @ts-expect-error Props injected by Slide */}
          <SlideView data-testid="slide-view">Second</SlideView>
          {/* @ts-expect-error Props injected by Slide */}
          <SlideView data-testid="slide-view">Third</SlideView>
        </Slide>
      </ThemeProvider>
    );
  }

  it('renders only the active SlideView as visible', () => {
    const { container } = renderSlide(1);
    const slideViews = container.querySelectorAll('[data-testid="slide-view"]');
    expect(slideViews[0]).toHaveStyle('opacity: 0');
    expect(slideViews[1]).toHaveStyle('opacity: 1');
    expect(slideViews[2]).toHaveStyle('opacity: 0');
  });

  it('passes direction prop to SlideView', () => {
    const { container } = renderSlide(2, 'left');
    const slideViews = container.querySelectorAll('[data-testid="slide-view"]');
    // Only the third is active, so its style should have transform: translateX(0%)
    expect(slideViews[2]).toHaveStyle('transform: translateX(0%)');
    // The others should have transform based on direction
    expect(slideViews[0]).toHaveStyle('transform: translateX(100%)');
    expect(slideViews[1]).toHaveStyle('transform: translateX(100%)');
  });

  it('renders children content correctly', () => {
    renderSlide(0);
    expect(screen.getByText('First')).toBeInTheDocument();
    expect(screen.getByText('Second')).toBeInTheDocument();
    expect(screen.getByText('Third')).toBeInTheDocument();
  });
}); 