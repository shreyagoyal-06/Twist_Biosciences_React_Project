
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ErrorBoundary, BombButton } from '../component-did-catch';
import { reportError } from '../error-reporting';

jest.mock('../error-reporting', () => ({
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

  test('BombButton renders correctly', () => {
    render(<BombButton />);
    expect(screen.getByRole('button', { name: 'Bomb!' })).toBeInTheDocument();
  });

  test('BombButton throws error when clicked', () => {
    render(
      <ErrorBoundary>
        <BombButton />
      </ErrorBoundary>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Bomb!' }));

    expect(screen.getByText('Something went wrong.')).toBeInTheDocument();
  });

  test('reportError is called with the expected error object', () => {
    const TestError = () => {
      throw new Error('Test error');
    };

    render(
      <ErrorBoundary>
        <TestError />
      </ErrorBoundary>
    );

    expect(reportError).toHaveBeenCalledTimes(1);
    expect(reportError.mock.calls[0][0]).toBeInstanceOf(Error);
    expect(reportError.mock.calls[0][0].message).toBe('Test error');
  });

  test('Application remains usable when an error occurs', () => {
    render(
      <div>
        <h1>App Title</h1>
        <ErrorBoundary>
          <BombButton />
        </ErrorBoundary>
        <p>Other content</p>
      </div>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Bomb!' }));

    expect(screen.getByText('App Title')).toBeInTheDocument();
    expect(screen.getByText('Other content')).toBeInTheDocument();
    expect(screen.getByText('Something went wrong.')).toBeInTheDocument();
  });

  test('Integration: BombButton, ErrorBoundary, and reportError interaction', () => {
    render(
      <ErrorBoundary>
        <BombButton />
      </ErrorBoundary>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Bomb!' }));

    expect(screen.getByText('Something went wrong.')).toBeInTheDocument();
    expect(reportError).toHaveBeenCalledTimes(1);
    expect(reportError.mock.calls[0][0]).toBeInstanceOf(Error);
    expect(reportError.mock.calls[0][0].message).toBe('💣');
  });
});
