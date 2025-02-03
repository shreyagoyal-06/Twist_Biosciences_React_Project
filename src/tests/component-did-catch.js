
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
    expect(reportError).toHaveBeenCalledWith(expect.any(Error));
  });

  test('BombButton renders correctly', () => {
    render(<BombButton />);
    expect(screen.getByRole('button', { name: 'Bomb' })).toBeInTheDocument();
  });

  test('BombButton throws error when clicked', () => {
    render(
      <ErrorBoundary>
        <BombButton />
      </ErrorBoundary>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Bomb' }));

    expect(screen.getByText('There was a problem')).toBeInTheDocument();
    expect(reportError).toHaveBeenCalledWith(expect.any(Error));
  });

  test('ErrorBoundary displays custom error message', () => {
    const customMessage = 'Custom error message';
    const ThrowError = () => {
      throw new Error('Test error');
    };

    render(
      <ErrorBoundary fallback={<div>{customMessage}</div>}>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText(customMessage)).toBeInTheDocument();
  });

  test('reportError is called with expected error object', () => {
    const TestError = new Error('Test error');
    const ThrowError = () => {
      throw TestError;
    };

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(reportError).toHaveBeenCalledWith(TestError);
  });
});
