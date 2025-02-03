
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ErrorBoundary, BombButton } from '../component-did-catch';
import { reportError } from '../utils';

jest.mock('../utils', () => ({
  reportError: jest.fn()
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

  test('ErrorBoundary catches errors and displays fallback UI', async () => {
    render(
      <ErrorBoundary>
        <BombButton />
      </ErrorBoundary>
    );

    const button = screen.getByRole('button', { name: /throw error/i });
    fireEvent.click(button);

    const errorMessage = await screen.findByText('There was a problem');
    expect(errorMessage).toBeInTheDocument();
  });

  test('BombButton renders correctly and triggers error on click', () => {
    render(<BombButton />);
    const button = screen.getByRole('button', { name: /throw error/i });
    expect(button).toBeInTheDocument();
    
    expect(() => fireEvent.click(button)).toThrow('Bomb!');
  });

  test('reportError is called with the expected error object', async () => {
    render(
      <ErrorBoundary>
        <BombButton />
      </ErrorBoundary>
    );

    const button = screen.getByRole('button', { name: /throw error/i });
    fireEvent.click(button);

    await screen.findByText('There was a problem');
    expect(reportError).toHaveBeenCalledTimes(1);
    expect(reportError.mock.calls[0][0]).toBeInstanceOf(Error);
    expect(reportError.mock.calls[0][0].message).toBe('Bomb!');
  });

  test('ErrorBoundary remains usable after an error occurs', async () => {
    render(
      <ErrorBoundary>
        <BombButton />
        <div>Other content</div>
      </ErrorBoundary>
    );

    const button = screen.getByRole('button', { name: /throw error/i });
    fireEvent.click(button);

    await screen.findByText('There was a problem');
    expect(screen.getByText('Other content')).toBeInTheDocument();
  });

  test('ErrorBoundary does not expose sensitive information', async () => {
    render(
      <ErrorBoundary>
        <BombButton />
      </ErrorBoundary>
    );

    const button = screen.getByRole('button', { name: /throw error/i });
    fireEvent.click(button);

    const errorMessage = await screen.findByText('There was a problem');
    expect(errorMessage).toBeInTheDocument();
    expect(screen.queryByText('Bomb!')).not.toBeInTheDocument();
  });
});
