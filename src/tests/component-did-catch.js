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

  test('renders children correctly when there are no errors', () => {
    render(
      <ErrorBoundary>
        <div>Test Content</div>
      </ErrorBoundary>
    );
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  test('displays fallback UI when an error is caught', () => {
    render(
      <ErrorBoundary>
        <BombButton />
      </ErrorBoundary>
    );
    fireEvent.click(screen.getByRole('button', { name: /throw error/i }));
    expect(screen.getByText('There was a problem.')).toBeInTheDocument();
  });

  test('calls reportError when an error is caught', () => {
    render(
      <ErrorBoundary>
        <BombButton />
      </ErrorBoundary>
    );
    fireEvent.click(screen.getByRole('button', { name: /throw error/i }));
    expect(reportError).toHaveBeenCalled();
  });

  test('resets state when receiving new children after an error', () => {
    const { rerender } = render(
      <ErrorBoundary>
        <BombButton />
      </ErrorBoundary>
    );
    fireEvent.click(screen.getByRole('button', { name: /throw error/i }));
    expect(screen.getByText('There was a problem.')).toBeInTheDocument();

    rerender(
      <ErrorBoundary>
        <div>New Content</div>
      </ErrorBoundary>
    );
    expect(screen.getByText('New Content')).toBeInTheDocument();
  });

  test('BombButton renders correctly', () => {
    render(<BombButton />);
    const button = screen.getByRole('button', { name: /throw error/i });
    expect(button).toBeInTheDocument();
    const bombEmoji = screen.getByRole('img', { name: 'bomb' });
    expect(bombEmoji).toHaveAttribute('aria-label', 'bomb');
  });
});