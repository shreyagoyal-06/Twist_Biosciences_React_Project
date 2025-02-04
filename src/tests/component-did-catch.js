// src/__tests__/component-did-catch.test.js

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ErrorBoundary, BombButton } from '../component-did-catch';

const reportError = jest.fn();

jest.mock('../utils/error-reporting', () => ({
  reportError: (error) => reportError(error),
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

  test('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div>Test Child</div>
      </ErrorBoundary>
    );
    expect(screen.getByText('Test Child')).toBeInTheDocument();
  });

  test('catches errors thrown by child components', () => {
    render(
      <ErrorBoundary>
        <BombButton />
      </ErrorBoundary>
    );
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Something went wrong.')).toBeInTheDocument();
  });

  test('renders fallback UI when an error is caught', () => {
    render(
      <ErrorBoundary>
        <BombButton />
      </ErrorBoundary>
    );
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Something went wrong.')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  test('displays customizable error messages', () => {
    render(
      <ErrorBoundary fallback={<div>Custom Error Message</div>}>
        <BombButton />
      </ErrorBoundary>
    );
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Custom Error Message')).toBeInTheDocument();
  });
});

describe('BombButton', () => {
  test('renders correctly', () => {
    render(<BombButton />);
    expect(screen.getByRole('button', { name: 'Bomb' })).toBeInTheDocument();
  });

  test('throws an error when clicked', () => {
    render(
      <ErrorBoundary>
        <BombButton />
      </ErrorBoundary>
    );
    fireEvent.click(screen.getByRole('button', { name: 'Bomb' }));
    expect(screen.getByText('Something went wrong.')).toBeInTheDocument();
  });
});

describe('reportError', () => {
  test('is called when an error occurs', () => {
    render(
      <ErrorBoundary>
        <BombButton />
      </ErrorBoundary>
    );
    fireEvent.click(screen.getByRole('button', { name: 'Bomb' }));
    expect(reportError).toHaveBeenCalled();
  });

  test('is called with the correct error object', () => {
    render(
      <ErrorBoundary>
        <BombButton />
      </ErrorBoundary>
    );
    fireEvent.click(screen.getByRole('button', { name: 'Bomb' }));
    expect(reportError).toHaveBeenCalledWith(expect.any(Error));
  });
});

describe('Accessibility', () => {
  test('error messages are accessible to screen readers', () => {
    render(
      <ErrorBoundary>
        <BombButton />
      </ErrorBoundary>
    );
    fireEvent.click(screen.getByRole('button', { name: 'Bomb' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Something went wrong.');
  });

  test('fallback UI is keyboard navigable', () => {
    render(
      <ErrorBoundary>
        <BombButton />
      </ErrorBoundary>
    );
    fireEvent.click(screen.getByRole('button', { name: 'Bomb' }));
    const fallbackButton = screen.getByRole('button', { name: 'Try again' });
    expect(fallbackButton).toBeInTheDocument();
    fallbackButton.focus();
    expect(fallbackButton).toHaveFocus();
  });
});