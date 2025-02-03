// src/__tests__/component-did-catch.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
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
    const TestError = () => {
      throw new Error('Test error');
    };

    render(
      <ErrorBoundary>
        <TestError />
      </ErrorBoundary>
    );

    expect(screen.getByText(/An error has occurred/i)).toBeInTheDocument();
    expect(reportError).toHaveBeenCalled();
  });

  test('ErrorBoundary supports customizable error messages', () => {
    const customMessage = 'Custom error message';
    const TestError = () => {
      throw new Error('Test error');
    };

    render(
      <ErrorBoundary fallbackMessage={customMessage}>
        <TestError />
      </ErrorBoundary>
    );

    expect(screen.getByText(customMessage)).toBeInTheDocument();
  });

  test('BombButton displays a button with bomb emoji', () => {
    render(<BombButton />);
    const button = screen.getByRole('button', { name: /💣/i });
    expect(button).toBeInTheDocument();
  });

  test('Clicking BombButton triggers error caught by ErrorBoundary', () => {
    render(
      <ErrorBoundary>
        <BombButton />
      </ErrorBoundary>
    );

    const button = screen.getByRole('button', { name: /💣/i });
    fireEvent.click(button);

    expect(screen.getByText(/An error has occurred/i)).toBeInTheDocument();
    expect(reportError).toHaveBeenCalled();
  });

  test('reportError function is called with additional metadata', () => {
    const TestError = () => {
      throw new Error('Test error');
    };

    render(
      <ErrorBoundary>
        <TestError />
      </ErrorBoundary>
    );

    expect(reportError).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({
        timestamp: expect.any(Number),
        componentStack: expect.any(String),
      })
    );
  });

  test('Application maintains usability when error occurs', () => {
    const TestError = () => {
      throw new Error('Test error');
    };

    const { rerender } = render(
      <ErrorBoundary>
        <TestError />
        <div>Other content</div>
      </ErrorBoundary>
    );

    expect(screen.getByText(/An error has occurred/i)).toBeInTheDocument();
    expect(screen.getByText('Other content')).toBeInTheDocument();

    rerender(
      <ErrorBoundary>
        <div>New content</div>
      </ErrorBoundary>
    );

    expect(screen.getByText('New content')).toBeInTheDocument();
  });

  test('Error messages are accessible to screen readers', () => {
    const TestError = () => {
      throw new Error('Test error');
    };

    render(
      <ErrorBoundary>
        <TestError />
      </ErrorBoundary>
    );

    const errorMessage = screen.getByText(/An error has occurred/i);
    expect(errorMessage).toHaveAttribute('role', 'alert');
  });
});
