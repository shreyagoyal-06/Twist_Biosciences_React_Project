import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorBoundary, BombButton } from '../component-did-catch';
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

  test('ErrorBoundary catches error and displays fallback UI', () => {
    render(
      <ErrorBoundary>
        <BombButton />
      </ErrorBoundary>
    );

    fireEvent.click(screen.getByRole('button', { name: '💣' }));

    expect(screen.getByText('There was a problem')).toBeInTheDocument();
  });

  test('reportError is called with correct arguments when error occurs', () => {
    render(
      <ErrorBoundary>
        <BombButton />
      </ErrorBoundary>
    );

    fireEvent.click(screen.getByRole('button', { name: '💣' }));

    expect(reportError).toHaveBeenCalledTimes(1);
    expect(reportError.mock.calls[0][0]).toBeInstanceOf(TypeError);
    expect(reportError.mock.calls[0][1]).toHaveProperty('componentStack');
  });

  test('console.error is called twice when error occurs', () => {
    render(
      <ErrorBoundary>
        <BombButton />
      </ErrorBoundary>
    );

    fireEvent.click(screen.getByRole('button', { name: '💣' }));

    expect(console.error).toHaveBeenCalledTimes(2);
  });

  test('ErrorBoundary renders children when no error occurs', () => {
    render(
      <ErrorBoundary>
        <BombButton />
      </ErrorBoundary>
    );

    expect(screen.getByRole('button', { name: '💣' })).toBeInTheDocument();
  });

  test('BombButton has correct accessibility attributes', () => {
    render(<BombButton />);

    const button = screen.getByRole('button', { name: '💣' });
    expect(button).toBeInTheDocument();
    expect(button.querySelector('span')).toHaveAttribute('role', 'img');
    expect(button.querySelector('span')).toHaveAttribute('aria-label', 'bomb');
  });
});