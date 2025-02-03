
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

  test('BombButton triggers an error when clicked', async () => {
    render(
      <ErrorBoundary>
        <BombButton />
      </ErrorBoundary>
    );

    const button = screen.getByRole('button', { name: 'Bomb' });
    fireEvent.click(button);

    expect(await screen.findByText('Something went wrong.')).toBeInTheDocument();
  });

  test('ErrorBoundary displays custom error message', () => {
    const customMessage = 'Custom error message';
    render(
      <ErrorBoundary fallback={<div>{customMessage}</div>}>
        <BombButton />
      </ErrorBoundary>
    );

    const button = screen.getByRole('button', { name: 'Bomb' });
    fireEvent.click(button);

    expect(screen.getByText(customMessage)).toBeInTheDocument();
  });

  test('reportError is called with the correct error object', async () => {
    const { reportError } = require('../utils/error-reporting');

    render(
      <ErrorBoundary>
        <BombButton />
      </ErrorBoundary>
    );

    const button = screen.getByRole('button', { name: 'Bomb' });
    fireEvent.click(button);

    await screen.findByText('Something went wrong.');

    expect(reportError).toHaveBeenCalledTimes(1);
    expect(reportError.mock.calls[0][0]).toBeInstanceOf(Error);
    expect(reportError.mock.calls[0][0].message).toBe('💥');
  });

  test('Application remains usable after an error occurs', async () => {
    render(
      <ErrorBoundary>
        <BombButton />
        <div>Other content</div>
      </ErrorBoundary>
    );

    const button = screen.getByRole('button', { name: 'Bomb' });
    fireEvent.click(button);

    await screen.findByText('Something went wrong.');
    expect(screen.getByText('Other content')).toBeInTheDocument();
  });
});
