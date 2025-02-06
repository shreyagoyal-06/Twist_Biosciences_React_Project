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

  test('ErrorBoundary catches error from BombButton', async () => {
    render(
      <ErrorBoundary>
        <BombButton />
      </ErrorBoundary>
    );

    fireEvent.click(screen.getByRole('button'));
    
    expect(await screen.findByText('There was a problem.')).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  test('reportError is called when error occurs', async () => {
    render(
      <ErrorBoundary>
        <BombButton />
      </ErrorBoundary>
    );

    fireEvent.click(screen.getByRole('button'));
    
    await screen.findByText('There was a problem.');
    expect(reportError).toHaveBeenCalledTimes(1);
    expect(reportError.mock.calls[0][0]).toBeInstanceOf(Error);
    expect(reportError.mock.calls[0][1]).toHaveProperty('componentStack');
  });

  test('console.error is called with error message', async () => {
    render(
      <ErrorBoundary>
        <BombButton />
      </ErrorBoundary>
    );

    fireEvent.click(screen.getByRole('button'));
    
    await screen.findByText('There was a problem.');
    expect(console.error).toHaveBeenCalled();
  });

  test('BombButton renders correctly', () => {
    render(<BombButton />);
    
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    
    const span = screen.getByRole('img', { name: 'bomb' });
    expect(span).toBeInTheDocument();
    expect(span).toHaveTextContent('💣');
  });
});