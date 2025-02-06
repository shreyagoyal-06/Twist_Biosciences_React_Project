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

  test('BombButton renders correctly', () => {
    render(<BombButton />);
    const button = screen.getByRole('button');
    const span = screen.getByRole('img', { name: 'bomb' });
    expect(button).toBeInTheDocument();
    expect(span).toHaveAttribute('aria-label', 'bomb');
    expect(span).toHaveTextContent('💣');
  });

  test('ErrorBoundary catches error and displays fallback UI', async () => {
    render(
      <ErrorBoundary>
        <BombButton />
      </ErrorBoundary>
    );
    
    fireEvent.click(screen.getByRole('button'));
    
    expect(await screen.findByText('There was a problem')).toBeInTheDocument();
    expect(reportError).toHaveBeenCalledTimes(1);
    expect(console.error).toHaveBeenCalledTimes(2);
  });

  test('reportError is called with correct arguments', () => {
    render(
      <ErrorBoundary>
        <BombButton />
      </ErrorBoundary>
    );
    
    fireEvent.click(screen.getByRole('button'));
    
    expect(reportError).toHaveBeenCalledWith(
      expect.any(TypeError),
      expect.objectContaining({
        componentStack: expect.stringContaining('BombButton')
      })
    );
  });
});