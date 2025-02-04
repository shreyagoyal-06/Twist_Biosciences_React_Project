import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorBoundary, BombButton, reportError } from '../component-did-catch';

jest.mock('../reportError', () => ({
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
    console.error.mockClear();
    reportError.mockClear();
  });

  test('renders children when no error', () => {
    render(
      <ErrorBoundary>
        <div>Child Component</div>
      </ErrorBoundary>
    );
    expect(screen.getByText('Child Component')).toBeInTheDocument();
  });

  test('catches error and displays fallback UI', () => {
    render(
      <ErrorBoundary>
        <BombButton />
      </ErrorBoundary>
    );
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Something went wrong.')).toBeInTheDocument();
  });

  test('displays custom error message', () => {
    render(
      <ErrorBoundary fallback="Custom error message">
        <BombButton />
      </ErrorBoundary>
    );
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Custom error message')).toBeInTheDocument();
  });

  test('calls reportError when error occurs', () => {
    render(
      <ErrorBoundary>
        <BombButton />
      </ErrorBoundary>
    );
    fireEvent.click(screen.getByRole('button'));
    expect(reportError).toHaveBeenCalled();
  });
});

describe('BombButton', () => {
  test('renders correctly', () => {
    render(<BombButton />);
    expect(screen.getByRole('button', { name: 'Bomb' })).toBeInTheDocument();
  });

  test('throws error when clicked', () => {
    render(<BombButton />);
    expect(() => fireEvent.click(screen.getByRole('button'))).toThrow('Bomb!');
  });
});

describe('reportError', () => {
  test('is called with correct error object', () => {
    const error = new Error('Test error');
    reportError(error);
    expect(reportError).toHaveBeenCalledWith(error);
  });
});

