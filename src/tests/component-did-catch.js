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

  test('ErrorBoundary renders children correctly', () => {
    render(
      <ErrorBoundary>
        <div>Test Child</div>
      </ErrorBoundary>
    );
    expect(screen.getByText('Test Child')).toBeInTheDocument();
  });

  test('ErrorBoundary catches and handles errors', async () => {
    render(
      <ErrorBoundary>
        <BombButton />
      </ErrorBoundary>
    );
    fireEvent.click(screen.getByRole('button'));
    expect(await screen.findByText('There was a problem.')).toBeInTheDocument();
  });

  test('BombButton renders correctly with accessibility attributes', () => {
    render(<BombButton />);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Trigger error');
    expect(button).toHaveAttribute('tabIndex', '0');
    expect(button).toHaveAttribute('title', 'Trigger an error for testing');
    
    const span = screen.getByRole('img', { name: 'bomb' });
    expect(span).toHaveTextContent('💣');
  });

  test('Error is reported when BombButton is clicked', async () => {
    render(
      <ErrorBoundary>
        <BombButton />
      </ErrorBoundary>
    );
    fireEvent.click(screen.getByRole('button'));
    await screen.findByText('There was a problem.');
    expect(reportError).toHaveBeenCalled();
  });
});