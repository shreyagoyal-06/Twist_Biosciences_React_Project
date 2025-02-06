import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BombButton, ErrorBoundary } from '../component-did-catch';
import { reportError } from '../utils';

jest.mock('../utils', () => ({
  reportError: jest.fn(),
}));

describe('BombButton and ErrorBoundary', () => {
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

  test('BombButton renders correctly and throws error when clicked', async () => {
    render(<ErrorBoundary><BombButton /></ErrorBoundary>);
    const button = screen.getByRole('button');
    const bombEmoji = screen.getByRole('img', { name: 'bomb' });

    expect(button).toBeInTheDocument();
    expect(bombEmoji).toHaveTextContent('💣');

    fireEvent.click(button);
    
    const errorMessage = await screen.findByText('There was a problem');
    expect(errorMessage).toBeInTheDocument();
  });

  test('ErrorBoundary catches error and calls reportError', async () => {
    render(<ErrorBoundary><BombButton /></ErrorBoundary>);
    const button = screen.getByRole('button');

    fireEvent.click(button);

    await screen.findByText('There was a problem');
    expect(reportError).toHaveBeenCalledTimes(1);
    expect(reportError.mock.calls[0][0]).toBeInstanceOf(TypeError);
    expect(reportError.mock.calls[0][1]).toHaveProperty('componentStack');
  });

  test('console.error is called twice during error handling', async () => {
    render(<ErrorBoundary><BombButton /></ErrorBoundary>);
    const button = screen.getByRole('button');

    fireEvent.click(button);

    await screen.findByText('There was a problem');
    expect(console.error).toHaveBeenCalledTimes(2);
  });
});