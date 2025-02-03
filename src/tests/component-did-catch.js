
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ErrorBoundary, BombButton } from '../component-did-catch';
import { reportError } from '../utils';

jest.mock('../utils', () => ({
  reportError: jest.fn()
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

  test('ErrorBoundary renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div>Test Content</div>
      </ErrorBoundary>
    );
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  test('ErrorBoundary catches errors and displays fallback UI', () => {
    const ThrowError = () => {
      throw new Error('Test error');
    };

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText('There was a problem')).toBeInTheDocument();
    expect(reportError).toHaveBeenCalledTimes(1);
    expect(reportError.mock.calls[0][0]).toBeInstanceOf(Error);
    expect(reportError.mock.calls[0][0].message).toBe('Test error');
  });

  test('BombButton renders correctly', () => {
    render(<BombButton />);
    const button = screen.getByRole('button', { name: /bomb/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('aria-label', 'bomb');
  });

  test('Clicking BombButton throws an error caught by ErrorBoundary', () => {
    render(
      <ErrorBoundary>
        <BombButton />
      </ErrorBoundary>
    );

    const button = screen.getByRole('button', { name: /bomb/i });
    fireEvent.click(button);

    expect(screen.getByText('There was a problem')).toBeInTheDocument();
    expect(reportError).toHaveBeenCalledTimes(1);
    expect(reportError.mock.calls[0][0]).toBeInstanceOf(Error);
  });
});
