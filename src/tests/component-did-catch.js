import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorBoundary, BombButton } from '../component-did-catch';
import { reportError } from '../utils';

jest.mock('../utils', () => ({
  reportError: jest.fn(),
}));

describe('ErrorBoundary', () => {
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

  it('catches errors and displays fallback UI', () => {
    render(
      <ErrorBoundary>
        <BombButton />
      </ErrorBoundary>
    );

    fireEvent.click(screen.getByRole('button'));

    expect(screen.getByText('There was a problem')).toBeInTheDocument();
    expect(reportError).toHaveBeenCalledTimes(1);
    expect(console.error).toHaveBeenCalledTimes(2);
  });

  it('renders BombButton correctly before error', () => {
    render(<BombButton />);
    const bombSpan = screen.getByRole('img', { name: 'bomb' });
    expect(bombSpan).toHaveTextContent('💣');
    expect(bombSpan).toHaveAttribute('aria-label', 'bomb');
  });

  it('updates ErrorBoundary state on error', () => {
    render(
      <ErrorBoundary>
        <BombButton />
      </ErrorBoundary>
    );

    fireEvent.click(screen.getByRole('button'));

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.getByText('There was a problem')).toBeInTheDocument();
  });

  it('calls reportError with correct parameters', () => {
    render(
      <ErrorBoundary>
        <BombButton />
      </ErrorBoundary>
    );

    fireEvent.click(screen.getByRole('button'));

    expect(reportError).toHaveBeenCalledWith(
      expect.any(TypeError),
      expect.objectContaining({
        componentStack: expect.any(String),
      })
    );
  });

  it('allows application to remain usable after error', () => {
    const { rerender } = render(
      <ErrorBoundary>
        <BombButton />
      </ErrorBoundary>
    );

    fireEvent.click(screen.getByRole('button'));

    rerender(
      <ErrorBoundary>
        <div>New content</div>
      </ErrorBoundary>
    );

    expect(screen.getByText('New content')).toBeInTheDocument();
  });
});



