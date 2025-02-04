import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ErrorBoundary from '../component-did-catch';
import BombButton from '../component-did-catch';
import { reportError } from '../utils';

jest.mock('../utils', () => ({
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
    jest.clearAllMocks();
  });

  test('catches errors thrown by child components', () => {
    render(
      <ErrorBoundary>
        <BombButton />
      </ErrorBoundary>
    );

    fireEvent.click(screen.getByRole('button', { name: /throw error/i }));

    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
  });

  test('renders fallback UI when error is caught', () => {
    render(
      <ErrorBoundary>
        <BombButton />
      </ErrorBoundary>
    );

    fireEvent.click(screen.getByRole('button', { name: /throw error/i }));

    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /throw error/i })).not.toBeInTheDocument();
  });

  test('supports customizable error messages', () => {
    const customMessage = 'Custom error message';
    render(
      <ErrorBoundary fallback={<div>{customMessage}</div>}>
        <BombButton />
      </ErrorBoundary>
    );

    fireEvent.click(screen.getByRole('button', { name: /throw error/i }));

    expect(screen.getByText(customMessage)).toBeInTheDocument();
  });

  test('resets properly after an error occurs', () => {
    const { rerender } = render(
      <ErrorBoundary>
        <BombButton />
      </ErrorBoundary>
    );

    fireEvent.click(screen.getByRole('button', { name: /throw error/i }));
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();

    rerender(
      <ErrorBoundary>
        <div>New content</div>
      </ErrorBoundary>
    );

    expect(screen.getByText('New content')).toBeInTheDocument();
    expect(screen.queryByText(/something went wrong/i)).not.toBeInTheDocument();
  });
});

describe('BombButton', () => {
  test('renders correctly', () => {
    render(<BombButton />);
    expect(screen.getByRole('button', { name: /throw error/i })).toBeInTheDocument();
  });

  test('triggers an error when clicked', () => {
    render(
      <ErrorBoundary>
        <BombButton />
      </ErrorBoundary>
    );

    fireEvent.click(screen.getByRole('button', { name: /throw error/i }));

    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
  });
});

describe('reportError', () => {
  test('is called when an error occurs', () => {
    render(
      <ErrorBoundary>
        <BombButton />
      </ErrorBoundary>
    );

    fireEvent.click(screen.getByRole('button', { name: /throw error/i }));

    expect(reportError).toHaveBeenCalled();
  });

  test('logs the correct error object', () => {
    render(
      <ErrorBoundary>
        <BombButton />
      </ErrorBoundary>
    );

    fireEvent.click(screen.getByRole('button', { name: /throw error/i }));

    expect(reportError).toHaveBeenCalledWith(expect.any(Error));
  });

  test('includes additional metadata in the error log', () => {
    render(
      <ErrorBoundary>
        <BombButton />
      </ErrorBoundary>
    );

    fireEvent.click(screen.getByRole('button', { name: /throw error/i }));

    expect(reportError).toHaveBeenCalledWith(
      expect.objectContaining({
        timestamp: expect.any(Number),
        componentStack: expect.any(String),
      })
    );
  });
});