
// src/__tests__/component-did-catch.test.js

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorBoundary, BombButton } from '../component-did-catch';

// Mock the reportError function
jest.mock('../utils/error-reporting', () => ({
  reportError: jest.fn(),
}));

describe('ErrorBoundary and BombButton Components', () => {
  const originalError = console.error;
  beforeAll(() => {
    console.error = jest.fn();
  });

  afterAll(() => {
    console.error = originalError;
  });

  beforeEach(() => {
    console.error.mockClear();
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

    expect(screen.getByText('Something went wrong.')).toBeInTheDocument();
  });

  test('ErrorBoundary allows customizable error messages', () => {
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

  test('BombButton renders correctly', () => {
    render(<BombButton />);
    expect(screen.getByRole('button', { name: 'Bomb!' })).toBeInTheDocument();
  });

  test('Clicking BombButton triggers an error caught by ErrorBoundary', () => {
    render(
      <ErrorBoundary>
        <BombButton />
      </ErrorBoundary>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Bomb!' }));
    expect(screen.getByText('Something went wrong.')).toBeInTheDocument();
  });

  test('reportError is called with the expected error object', () => {
    const { reportError } = require('../utils/error-reporting');
    const ThrowError = () => {
      throw new Error('Test error');
    };

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(reportError).toHaveBeenCalledTimes(1);
    expect(reportError.mock.calls[0][0]).toBeInstanceOf(Error);
    expect(reportError.mock.calls[0][0].message).toBe('Test error');
  });

  test('ErrorBoundary maintains usability when an error occurs', () => {
    const ThrowError = () => {
      throw new Error('Test error');
    };

    render(
      <div>
        <h1>App Title</h1>
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
        <footer>App Footer</footer>
      </div>
    );

    expect(screen.getByText('App Title')).toBeInTheDocument();
    expect(screen.getByText('Something went wrong.')).toBeInTheDocument();
    expect(screen.getByText('App Footer')).toBeInTheDocument();
  });

  test('Integration: BombButton, ErrorBoundary, and reportError function', () => {
    const { reportError } = require('../utils/error-reporting');
    
    render(
      <ErrorBoundary>
        <BombButton />
      </ErrorBoundary>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Bomb!' }));

    expect(screen.getByText('Something went wrong.')).toBeInTheDocument();
    expect(reportError).toHaveBeenCalledTimes(1);
    expect(reportError.mock.calls[0][0]).toBeInstanceOf(Error);
    expect(reportError.mock.calls[0][0].message).toBe('Boom!');
  });
});
