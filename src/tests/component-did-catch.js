import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ComponentDidCatch, BombButton } from '../component-did-catch';
import { reportError } from '../utils';

jest.mock('../utils', () => ({
  reportError: jest.fn(),
}));

describe('ComponentDidCatch', () => {
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

  test('renders without crashing', () => {
    render(<ComponentDidCatch />);
    expect(screen.getByText('ComponentDidCatch Example')).toBeInTheDocument();
  });

  test('renders BombButton', () => {
    render(<ComponentDidCatch />);
    const bombButton = screen.getByRole('button', { name: /throw error/i });
    expect(bombButton).toBeInTheDocument();
  });

  test('shows error message when BombButton is clicked', async () => {
    render(<ComponentDidCatch />);
    const bombButton = screen.getByRole('button', { name: /throw error/i });
    fireEvent.click(bombButton);
    expect(await screen.findByText('There was a problem.')).toBeInTheDocument();
  });

  test('calls reportError when error is thrown', async () => {
    render(<ComponentDidCatch />);
    const bombButton = screen.getByRole('button', { name: /throw error/i });
    fireEvent.click(bombButton);
    await screen.findByText('There was a problem.');
    expect(reportError).toHaveBeenCalled();
  });
});

describe('BombButton', () => {
  test('renders with correct text and emoji', () => {
    render(<BombButton />);
    const button = screen.getByRole('button', { name: /throw error/i });
    expect(button).toBeInTheDocument();
    expect(screen.getByText('💣')).toBeInTheDocument();
  });

  test('has correct accessibility attributes', () => {
    render(<BombButton />);
    const bombEmoji = screen.getByRole('img', { name: 'bomb' });
    expect(bombEmoji).toHaveAttribute('aria-label', 'bomb');
  });
});