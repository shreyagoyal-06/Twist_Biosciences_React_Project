import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BombButton } from '../component-did-catch';
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

  test('renders button with correct accessibility attributes', () => {
    render(<BombButton />);
    const button = screen.getByRole('button');
    const span = screen.getByRole('img', { name: 'bomb' });
    expect(button).toBeInTheDocument();
    expect(span).toHaveAttribute('aria-label', 'bomb');
    expect(span).toHaveTextContent('💣');
  });

  test('displays error message when clicked', async () => {
    render(<BombButton />);
    fireEvent.click(screen.getByRole('button'));
    expect(await screen.findByText('There was a problem')).toBeInTheDocument();
  });

  test('calls reportError when error occurs', async () => {
    render(<BombButton />);
    fireEvent.click(screen.getByRole('button'));
    await screen.findByText('There was a problem');
    expect(reportError).toHaveBeenCalled();
  });
});