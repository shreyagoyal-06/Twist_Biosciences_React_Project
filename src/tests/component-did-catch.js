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

  it('renders BombButton without errors', () => {
    render(<BombButton />);
    const button = screen.getByRole('button', { name: /throw error/i });
    expect(button).toBeInTheDocument();
    const bombEmoji = screen.getByRole('img', { name: 'bomb' });
    expect(bombEmoji).toHaveAttribute('aria-label', 'bomb');
  });

  it('simulates button click and triggers error', () => {
    render(
      <ErrorBoundary>
        <BombButton />
      </ErrorBoundary>
    );
    const button = screen.getByRole('button', { name: /throw error/i });
    fireEvent.click(button);
    expect(screen.getByText('There was a problem.')).toBeInTheDocument();
  });

  it('verifies error logging', () => {
    render(
      <ErrorBoundary>
        <BombButton />
      </ErrorBoundary>
    );
    const button = screen.getByRole('button', { name: /throw error/i });
    fireEvent.click(button);
    expect(reportError).toHaveBeenCalled();
    expect(reportError.mock.calls[0][0]).toBeInstanceOf(Error);
    expect(reportError.mock.calls[0][0].message).toBe('💣');
  });

  it('tests error boundary functionality', () => {
    render(
      <ErrorBoundary>
        <BombButton />
      </ErrorBoundary>
    );
    const button = screen.getByRole('button', { name: /throw error/i });
    fireEvent.click(button);
    expect(screen.queryByRole('button', { name: /throw error/i })).not.toBeInTheDocument();
    expect(screen.getByText('There was a problem.')).toBeInTheDocument();
  });

  it('checks console error suppression', () => {
    render(
      <ErrorBoundary>
        <BombButton />
      </ErrorBoundary>
    );
    const button = screen.getByRole('button', { name: /throw error/i });
    fireEvent.click(button);
    expect(console.error).not.toHaveBeenCalled();
  });
});