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

  test('renders BombButton correctly', () => {
    render(<BombButton />);
    const button = screen.getByRole('button');
    const span = screen.getByRole('img', { name: 'bomb' });
    expect(button).toBeInTheDocument();
    expect(span).toHaveAttribute('aria-label', 'bomb');
    expect(span).toHaveTextContent('💣');
  });

  test('clicking BombButton triggers error and displays error message', async () => {
    render(
      <ErrorBoundary>
        <BombButton />
      </ErrorBoundary>
    );
    const button = screen.getByRole('button');
    fireEvent.click(button);
    const errorMessage = await screen.findByText('There was a problem.');
    expect(errorMessage).toBeInTheDocument();
    expect(button).not.toBeInTheDocument();
  });

  test('reportError is called with correct parameters when error occurs', () => {
    render(
      <ErrorBoundary>
        <BombButton />
      </ErrorBoundary>
    );
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(reportError).toHaveBeenCalledTimes(1);
    expect(reportError.mock.calls[0][0]).toBeInstanceOf(Error);
    expect(reportError.mock.calls[0][1]).toHaveProperty('componentStack');
  });

  test('console.error is called with expected error message', () => {
    render(
      <ErrorBoundary>
        <BombButton />
      </ErrorBoundary>
    );
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(console.error).toHaveBeenCalled();
    expect(console.error.mock.calls[0][0]).toMatch(/Error was caught by ErrorBoundary/);
  });
});