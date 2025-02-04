import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
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

  test('Error Handling and UI Behavior', () => {
    render(
      <ErrorBoundary>
        <BombButton />
      </ErrorBoundary>
    );
    fireEvent.click(screen.getByRole('button', { name: /bomb/i }));
    expect(reportError).toHaveBeenCalledTimes(1);
    expect(reportError).toHaveBeenCalledWith(expect.any(Error));
    expect(screen.getByText('There was a problem')).toBeInTheDocument();
    expect(console.error).toHaveBeenCalledTimes(2);
  });

  test('Error Boundary Rendering', () => {
    const SafeComponent = () => <div>Safe Component</div>;
    render(
      <ErrorBoundary>
        <SafeComponent />
      </ErrorBoundary>
    );
    expect(screen.getByText('Safe Component')).toBeInTheDocument();
  });

  test('Multiple Error Handling', () => {
    render(
      <ErrorBoundary>
        <BombButton />
        <BombButton />
      </ErrorBoundary>
    );
    fireEvent.click(screen.getAllByRole('button', { name: /bomb/i })[0]);
    fireEvent.click(screen.getAllByRole('button', { name: /bomb/i })[1]);
    expect(reportError).toHaveBeenCalledTimes(1);
    expect(screen.getByText('There was a problem')).toBeInTheDocument();
  });

  test('Error Boundary Reset', () => {
    const { rerender } = render(
      <ErrorBoundary>
        <BombButton />
      </ErrorBoundary>
    );
    fireEvent.click(screen.getByRole('button', { name: /bomb/i }));
    expect(screen.getByText('There was a problem')).toBeInTheDocument();
    rerender(
      <ErrorBoundary>
        <BombButton />
      </ErrorBoundary>
    );
    expect(screen.getByRole('button', { name: /bomb/i })).toBeInTheDocument();
  });

  test('Console Error Suppression', () => {
    render(
      <ErrorBoundary>
        <BombButton />
      </ErrorBoundary>
    );
    fireEvent.click(screen.getByRole('button', { name: /bomb/i }));
    expect(console.error).toHaveBeenCalledTimes(2);
  });
});