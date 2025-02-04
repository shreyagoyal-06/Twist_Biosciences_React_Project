import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BombButton, ErrorBoundary } from '../component-did-catch';
import { reportError } from '../utils';

jest.mock('../utils', () => ({
  reportError: jest.fn(),
}));

describe('ErrorBoundary and BombButton', () => {
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

  test('BombButton renders correctly', () => {
    render(<BombButton />);
    const button = screen.getByRole('button', { name: /throw error/i });
    const bombEmoji = screen.getByRole('img', { name: 'bomb' });
    expect(button).toBeInTheDocument();
    expect(bombEmoji).toHaveAttribute('aria-label', 'bomb');
  });

  test('ErrorBoundary catches error and displays message', async () => {
    render(
      <ErrorBoundary>
        <BombButton />
      </ErrorBoundary>
    );
    const button = screen.getByRole('button', { name: /throw error/i });
    fireEvent.click(button);
    const errorMessage = await screen.findByText('There was a problem.');
    expect(errorMessage).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /throw error/i })).not.toBeInTheDocument();
  });

  test('reportError is called with correct error details', () => {
    render(
      <ErrorBoundary>
        <BombButton />
      </ErrorBoundary>
    );
    const button = screen.getByRole('button', { name: /throw error/i });
    fireEvent.click(button);
    expect(reportError).toHaveBeenCalledTimes(1);
    const [error] = reportError.mock.calls[0];
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe('💣');
  });

  test('ErrorBoundary resets after error is resolved', () => {
    const { rerender } = render(
      <ErrorBoundary>
        <BombButton />
      </ErrorBoundary>
    );
    const button = screen.getByRole('button', { name: /throw error/i });
    fireEvent.click(button);
    expect(screen.getByText('There was a problem.')).toBeInTheDocument();
    rerender(
      <ErrorBoundary>
        <div>New content</div>
      </ErrorBoundary>
    );
    expect(screen.getByText('New content')).toBeInTheDocument();
    expect(screen.queryByText('There was a problem.')).not.toBeInTheDocument();
  });
});