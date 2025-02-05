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

  test('renders correctly', () => {
    render(<BombButton />);
    const button = screen.getByRole('button');
    const emoji = screen.getByRole('img', { name: 'bomb' });
    expect(button).toBeInTheDocument();
    expect(emoji).toHaveTextContent('💣');
  });

  test('displays error message when clicked', async () => {
    render(
      <ErrorBoundary>
        <BombButton />
      </ErrorBoundary>
    );
    const button = screen.getByRole('button');
    fireEvent.click(button);
    const errorMessage = await screen.findByText('There was a problem');
    expect(errorMessage).toBeInTheDocument();
  });

  test('calls reportError when error occurs', () => {
    render(
      <ErrorBoundary>
        <BombButton />
      </ErrorBoundary>
    );
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(reportError).toHaveBeenCalledTimes(1);
    expect(reportError.mock.calls[0][0]).toBeInstanceOf(TypeError);
    expect(reportError.mock.calls[0][1].componentStack).toContain('BombButton');
  });

  test('limits console.error calls during error handling', () => {
    render(
      <ErrorBoundary>
        <BombButton />
      </ErrorBoundary>
    );
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(console.error).toHaveBeenCalledTimes(2);
  });
});