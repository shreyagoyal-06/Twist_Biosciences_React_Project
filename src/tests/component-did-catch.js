```javascript
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorBoundary, BombButton } from '../component-did-catch';
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

  test('renders BombButton initially', () => {
    render(<ErrorBoundary><BombButton /></ErrorBoundary>);
    const button = screen.getByRole('button', { name: /throw error/i });
    expect(button).toBeInTheDocument();
    const bombEmoji = screen.getByRole('img', { name: 'bomb' });
    expect(bombEmoji).toHaveAttribute('aria-label', 'bomb');
  });

  test('displays error message when BombButton is clicked', async () => {
    render(<ErrorBoundary><BombButton /></ErrorBoundary>);
    const button = screen.getByRole('button', { name: /throw error/i });
    fireEvent.click(button);
    const errorMessage = await screen.findByText('There was a problem');
    expect(errorMessage).toBeInTheDocument();
  });

  test('calls reportError when an error occurs', () => {
    render(<ErrorBoundary><BombButton /></ErrorBoundary>);
    const button = screen.getByRole('button', { name: /throw error/i });
    fireEvent.click(button);
    expect(reportError).toHaveBeenCalledTimes(1);
    expect(reportError.mock.calls[0][0]).toBeInstanceOf(Error);
  });

  test('ErrorBoundary renders children when no error', () => {
    render(<ErrorBoundary><div>Test Content</div></ErrorBoundary>);
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  test('ErrorBoundary catches errors from children', () => {
    const ThrowError = () => {
      throw new Error('Test error');
    };
    render(<ErrorBoundary><ThrowError /></ErrorBoundary>);
    expect(screen.getByText('There was a problem')).toBeInTheDocument();
  });
});
```