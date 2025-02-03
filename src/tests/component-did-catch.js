
// src/__tests__/component-did-catch.test.js

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ErrorBoundary, BombButton } from '../component-did-catch';

// Mock the reportError function
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
    const TestError = () => {
      throw new Error('Test error');
    };

    render(
      <ErrorBoundary>
        <TestError />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong.')).toBeInTheDocument();
  });

  test('ErrorBoundary displays custom error message', () => {
    const TestError = () => {
      throw new Error('Custom error');
    };

    render(
      <ErrorBoundary fallback={<div>Custom error message</div>}>
        <TestError />
      </ErrorBoundary>
    );

    expect(screen.getByText('Custom error message')).toBeInTheDocument();
  });

  test('BombButton renders correctly and triggers error when clicked', () => {
    render(
      <ErrorBoundary>
        <BombButton />
      </ErrorBoundary>
    );

    const button = screen.getByRole('button', { name: /throw error/i });
    expect(button).toBeInTheDocument();

    fireEvent.click(button);

    expect(screen.getByText('Something went wrong.')).toBeInTheDocument();
  });

  test('reportError is called with correct error object', () => {
    const { reportError } = require('../utils/error-reporting');
    const TestError = () => {
      throw new Error('Test error for reporting');
    };

    render(
      <ErrorBoundary>
        <TestError />
      </ErrorBoundary>
    );

    expect(reportError).toHaveBeenCalledTimes(1);
    expect(reportError.mock.calls[0][0]).toBeInstanceOf(Error);
    expect(reportError.mock.calls[0][0].message).toBe('Test error for reporting');
  });

  test('ErrorBoundary resets after error occurs', () => {
    const TestError = () => {
      throw new Error('Test error');
    };

    const { rerender } = render(
      <ErrorBoundary>
        <TestError />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong.')).toBeInTheDocument();

    rerender(
      <ErrorBoundary>
        <div>Normal content</div>
      </ErrorBoundary>
    );

    expect(screen.getByText('Normal content')).toBeInTheDocument();
    expect(screen.queryByText('Something went wrong.')).not.toBeInTheDocument();
  });
});
