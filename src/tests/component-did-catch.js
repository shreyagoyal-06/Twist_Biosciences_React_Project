// src/__tests__/component-did-catch.test.js

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorBoundary, BombButton } from '../component-did-catch';
import { reportError } from '../utils/error-reporting';

jest.mock('../utils/error-reporting', () => ({
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

  test('ErrorBoundary catches errors and displays fallback UI', () => {
    render(
      <ErrorBoundary>
        <BombButton />
      </ErrorBoundary>
    );

    fireEvent.click(screen.getByRole('button', { name: /throw error/i }));

    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    expect(reportError).toHaveBeenCalledTimes(1);
    expect(reportError.mock.calls[0][0]).toBeInstanceOf(Error);
  });

  test('BombButton triggers an error when clicked', () => {
    render(
      <ErrorBoundary>
        <BombButton />
      </ErrorBoundary>
    );

    fireEvent.click(screen.getByRole('button', { name: /throw error/i }));

    expect(screen.queryByRole('button', { name: /throw error/i })).not.toBeInTheDocument();
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
  });

  test('reportError is called with correct error object', () => {
    render(
      <ErrorBoundary>
        <BombButton />
      </ErrorBoundary>
    );

    fireEvent.click(screen.getByRole('button', { name: /throw error/i }));

    expect(reportError).toHaveBeenCalledTimes(1);
    const errorArg = reportError.mock.calls[0][0];
    expect(errorArg).toBeInstanceOf(Error);
    expect(errorArg.message).toBe('Bomb!');
  });

  test('ErrorBoundary displays customizable error messages', () => {
    const customErrorMessage = 'Custom error occurred';
    render(
      <ErrorBoundary fallback={<div>{customErrorMessage}</div>}>
        <BombButton />
      </ErrorBoundary>
    );

    fireEvent.click(screen.getByRole('button', { name: /throw error/i }));

    expect(screen.getByText(customErrorMessage)).toBeInTheDocument();
  });

  test('UI remains usable when an error occurs', () => {
    render(
      <div>
        <h1>App Title</h1>
        <ErrorBoundary>
          <BombButton />
        </ErrorBoundary>
        <p>Other content</p>
      </div>
    );

    fireEvent.click(screen.getByRole('button', { name: /throw error/i }));

    expect(screen.getByText(/app title/i)).toBeInTheDocument();
    expect(screen.getByText(/other content/i)).toBeInTheDocument();
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
  });
});