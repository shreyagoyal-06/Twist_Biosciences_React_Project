import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BombButton, ErrorBoundary } from '../component-did-catch';
import { reportError } from '../utils';

jest.mock('../utils', () => ({
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

  test('ErrorBoundary catches error and displays fallback UI', async () => {
    render(
      <ErrorBoundary>
        <BombButton />
      </ErrorBoundary>
    );

    fireEvent.click(screen.getByRole('button'));
    
    expect(await screen.findByText('There was a problem')).toBeInTheDocument();
  });

  test('Error is reported when BombButton is clicked', async () => {
    render(
      <ErrorBoundary>
        <BombButton />
      </ErrorBoundary>
    );

    fireEvent.click(screen.getByRole('button'));

    await screen.findByText('There was a problem');
    expect(reportError).toHaveBeenCalledTimes(1);
    expect(reportError.mock.calls[0][0]).toBeInstanceOf(TypeError);
    expect(reportError.mock.calls[0][1].componentStack).toContain('BombButton');
  });

  test('Console.error is called twice during error handling', async () => {
    render(
      <ErrorBoundary>
        <BombButton />
      </ErrorBoundary>
    );

    fireEvent.click(screen.getByRole('button'));

    await screen.findByText('There was a problem');
    expect(console.error).toHaveBeenCalledTimes(2);
  });

  test('BombButton has correct accessibility attributes', () => {
    render(<BombButton />);

    const button = screen.getByRole('button');
    const span = screen.getByRole('img', { name: 'bomb' });

    expect(button).toBeInTheDocument();
    expect(span).toHaveAttribute('aria-label', 'bomb');
    expect(span).toHaveTextContent('💣');
  });
});