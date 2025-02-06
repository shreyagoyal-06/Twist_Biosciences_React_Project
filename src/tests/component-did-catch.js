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
    const errorMessage = await screen.findByText('There was a problem.');
    expect(errorMessage).toBeInTheDocument();
  });

  test('calls reportError when error occurs', async () => {
    render(
      <ErrorBoundary>
        <BombButton />
      </ErrorBoundary>
    );
    const button = screen.getByRole('button');
    fireEvent.click(button);
    await screen.findByText('There was a problem.');
    expect(reportError).toHaveBeenCalledTimes(1);
    expect(reportError.mock.calls[0][0]).toBeInstanceOf(Error);
  });
});