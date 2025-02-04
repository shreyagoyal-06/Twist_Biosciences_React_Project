import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BombButton, ErrorBoundary } from '../component-did-catch';
import { reportError } from '../utils';

jest.mock('../utils', () => ({
  reportError: jest.fn(),
}));

describe('BombButton and ErrorBoundary', () => {
  const originalError = console.error;
  beforeAll(() => {
    console.error = jest.fn();
  });

  afterAll(() => {
    console.error = originalError;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders BombButton without error', () => {
    render(<BombButton />);
    const button = screen.getByRole('button');
    const bombEmoji = screen.getByRole('img', { name: 'bomb' });
    expect(button).toBeInTheDocument();
    expect(bombEmoji).toBeInTheDocument();
    expect(bombEmoji).toHaveAttribute('aria-label', 'bomb');
  });

  test('ErrorBoundary catches error when BombButton is clicked', () => {
    render(
      <ErrorBoundary>
        <BombButton />
      </ErrorBoundary>
    );
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('There was a problem')).toBeInTheDocument();
  });

  

  test('Console errors are properly managed', () => {
    render(
      <ErrorBoundary>
        <BombButton />
      </ErrorBoundary>
    );
    fireEvent.click(screen.getByRole('button'));
    expect(console.error).toHaveBeenCalledTimes(2);
  });

  test('ErrorBoundary resets state on unmount', () => {
    const { unmount, rerender } = render(
      <ErrorBoundary>
        <BombButton />
      </ErrorBoundary>
    );
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('There was a problem')).toBeInTheDocument();
    unmount();
    rerender(
      <ErrorBoundary>
        <BombButton />
      </ErrorBoundary>
    );
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
