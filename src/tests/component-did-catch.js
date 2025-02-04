import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ComponentDidCatch } from '../component-did-catch';
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
    expect(screen.getByRole('button', { name: /bomb/i })).toBeInTheDocument();
  });

  test('displays error message when error is thrown', async () => {
    render(<ComponentDidCatch />);
    fireEvent.click(screen.getByRole('button', { name: /bomb/i }));
    expect(await screen.findByText('There was a problem.')).toBeInTheDocument();
  });

  test('calls reportError when error is thrown', async () => {
    render(<ComponentDidCatch />);
    fireEvent.click(screen.getByRole('button', { name: /bomb/i }));
    await screen.findByText('There was a problem.');
    expect(reportError).toHaveBeenCalled();
  });

  test('bomb button has correct accessibility attributes', () => {
    render(<ComponentDidCatch />);
    const bombSpan = screen.getByRole('img', { name: 'bomb' });
    expect(bombSpan).toHaveAttribute('aria-label', 'bomb');
  });

  test('error boundary catches errors from child components', async () => {
    render(<ComponentDidCatch />);
    fireEvent.click(screen.getByRole('button', { name: /bomb/i }));
    expect(await screen.findByText('There was a problem.')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /bomb/i })).not.toBeInTheDocument();
  });
});