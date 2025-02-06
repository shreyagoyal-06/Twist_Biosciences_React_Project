import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BombButton, ErrorBoundary } from '../component-did-catch';
import { reportError } from '../utils';

jest.mock('../utils', () => ({
  reportError: jest.fn(),
}));

describe('BombButton', () => {
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

  test('renders bomb button with correct accessibility attributes', () => {
    render(<BombButton />);
    const button = screen.getByRole('button');
    const span = screen.getByRole('img', { name: 'bomb' });
    expect(button).toBeInTheDocument();
    expect(span).toHaveAttribute('aria-label', 'bomb');
    expect(span).toHaveTextContent('💣');
  });

  test('displays error message and calls reportError when clicked', async () => {
    render(
      <ErrorBoundary>
        <BombButton />
      </ErrorBoundary>
    );
    
    fireEvent.click(screen.getByRole('button'));
    
    expect(await screen.findByText('There was a problem')).toBeInTheDocument();
    expect(reportError).toHaveBeenCalledTimes(1);
    expect(reportError.mock.calls[0][0]).toBeInstanceOf(TypeError);
    expect(reportError.mock.calls[0][1]).toHaveProperty('componentStack');
  });

  test('renders custom error message when provided', async () => {
    render(
      <ErrorBoundary fallback="Custom error message">
        <BombButton />
      </ErrorBoundary>
    );
    
    fireEvent.click(screen.getByRole('button'));
    
    expect(await screen.findByText('Custom error message')).toBeInTheDocument();
  });
});