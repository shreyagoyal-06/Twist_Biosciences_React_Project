
// src/__tests__/ErrorBoundary.test.js

import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ErrorBoundary, BombButton } from '../component-did-catch';

// Mock the reportError function
jest.mock('../utils/error-reporting', () => ({
  reportError: jest.fn(),
}));

describe('ErrorBoundary', () => {
  // Console error handling
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

  test('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div>Test Content</div>
      </ErrorBoundary>
    );
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  test('renders fallback UI when an error is caught', () => {
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

  test('allows customizable error messages', () => {
    const customMessage = 'Custom error message';
    const TestError = () => {
      throw new Error('Test error');
    };

    render(
      <ErrorBoundary fallback={<div>{customMessage}</div>}>
        <TestError />
      </ErrorBoundary>
    );

    expect(screen.getByText(customMessage)).toBeInTheDocument();
  });

  test('BombButton triggers an error when clicked', async () => {
    const user = userEvent.setup();

    render(
      <ErrorBoundary>
        <BombButton />
      </ErrorBoundary>
    );

    const button = screen.getByRole('button', { name: /throw error/i });
    await user.click(button);

    expect(screen.getByText('Something went wrong.')).toBeInTheDocument();
  });

  test('reportError function is called when an error occurs', async () => {
    const { reportError } = require('../utils/error-reporting');
    const user = userEvent.setup();

    render(
      <ErrorBoundary>
        <BombButton />
      </ErrorBoundary>
    );

    const button = screen.getByRole('button', { name: /throw error/i });
    await user.click(button);

    expect(reportError).toHaveBeenCalledTimes(1);
    expect(reportError.mock.calls[0][0]).toBeInstanceOf(Error);
    expect(reportError.mock.calls[0][0].message).toBe('💥');
  });

  test('UI remains responsive after an error occurs', async () => {
    const user = userEvent.setup();

    render(
      <div>
        <ErrorBoundary>
          <BombButton />
        </ErrorBoundary>
        <button>Other Button</button>
      </div>
    );

    const bombButton = screen.getByRole('button', { name: /throw error/i });
    await user.click(bombButton);

    const otherButton = screen.getByRole('button', { name: /other button/i });
    expect(otherButton).toBeInTheDocument();
    await user.click(otherButton);
    // Add assertion for the click event if there's a specific behavior to test
  });

  test('error messages are accessible to screen readers', () => {
    const TestError = () => {
      throw new Error('Test error');
    };

    render(
      <ErrorBoundary>
        <TestError />
      </ErrorBoundary>
    );

    const errorMessage = screen.getByText('Something went wrong.');
    expect(errorMessage).toHaveAttribute('role', 'alert');
  });
});
