import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorBoundary, BombButton } from '../component-did-catch';
import { reportError } from '../utils';

jest.mock('../utils', () => ({
  reportError: jest.fn()
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

  test('ErrorBoundary catches errors and displays fallback UI', () => {
    const TestError = () => {
      throw new Error('Test error');
    };

    render(
      <ErrorBoundary>
        <TestError />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong.')).toBeInTheDocument();
  });

  test('ErrorBoundary displays custom error message', () => {
    const TestError = () => {
      throw new Error('Custom error');
    };

    render(
      <ErrorBoundary fallback={<div>Custom fallback</div>}>
        <TestError />
      </ErrorBoundary>
    );

    expect(screen.getByText('Custom fallback')).toBeInTheDocument();
  });

  test('BombButton renders correctly', () => {
    render(<BombButton />);
    expect(screen.getByRole('button', { name: 'Bomb!' })).toBeInTheDocument();
  });

  test('BombButton throws error when clicked', () => {
    render(
      <ErrorBoundary>
        <BombButton />
      </ErrorBoundary>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Bomb!' }));
    expect(screen.getByText('Something went wrong.')).toBeInTheDocument();
  });

  test('reportError is called with expected error object', () => {
    const TestError = () => {
      throw new Error('Test error');
    };

    render(
      <ErrorBoundary>
        <TestError />
      </ErrorBoundary>
    );

    expect(reportError).toHaveBeenCalledTimes(1);
    expect(reportError.mock.calls[0][0]).toBeInstanceOf(Error);
    expect(reportError.mock.calls[0][0].message).toBe('Test error');
  });

  test('Form renders initial fields correctly', () => {
    render(<ErrorBoundary><form><input type="email" /><input type="password" /></form></ErrorBoundary>);
    expect(screen.getByRole('textbox', { type: 'email' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { type: 'password' })).toBeInTheDocument();
  });

  test('Form displays error for empty submission', async () => {
    render(<ErrorBoundary><form><input type="email" /><input type="password" /><button type="submit">Submit</button></form></ErrorBoundary>);
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
    expect(await screen.findByText('Please fill out all fields')).toBeInTheDocument();
  });

  test('Form displays error for invalid email', async () => {
    render(<ErrorBoundary><form><input type="email" /><input type="password" /><button type="submit">Submit</button></form></ErrorBoundary>);
    fireEvent.change(screen.getByRole('textbox', { type: 'email' }), { target: { value: 'invalid-email' } });
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
    expect(await screen.findByText('Please enter a valid email address')).toBeInTheDocument();
  });

  test('Form submits successfully with valid credentials', async () => {
    render(<ErrorBoundary><form><input type="email" /><input type="password" /><button type="submit">Submit</button></form></ErrorBoundary>);
    fireEvent.change(screen.getByRole('textbox', { type: 'email' }), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByRole('textbox', { type: 'password' }), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
    expect(await screen.findByText('Form submitted successfully')).toBeInTheDocument();
  });

  test('Form resets after successful submission', async () => {
    render(<ErrorBoundary><form><input type="email" /><input type="password" /><button type="submit">Submit</button></form></ErrorBoundary>);
    fireEvent.change(screen.getByRole('textbox', { type: 'email' }), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByRole('textbox', { type: 'password' }), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
    await screen.findByText('Form submitted successfully');
    expect(screen.getByRole('textbox', { type: 'email' })).toHaveValue('');
    expect(screen.getByRole('textbox', { type: 'password' })).toHaveValue('');
  });

  test('Application remains usable when error occurs', () => {
    render(
      <ErrorBoundary>
        <div>
          <BombButton />
          <button>Safe Button</button>
        </div>
      </ErrorBoundary>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Bomb!' }));
    expect(screen.getByText('Something went wrong.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Safe Button' })).toBeInTheDocument();
  });

  test('Users are notified about issues through fallback UI', () => {
    const TestError = () => {
      throw new Error('Test error');
    };

    render(
      <ErrorBoundary fallback={<div>An error occurred. Please try again later.</div>}>
        <TestError />
      </ErrorBoundary>
    );

    expect(screen.getByText('An error occurred. Please try again later.')).toBeInTheDocument();
  });

  test('Integration of BombButton, ErrorBoundary, and reportError', () => {
    render(
      <ErrorBoundary>
        <BombButton />
      </ErrorBoundary>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Bomb!' }));
    expect(screen.getByText('Something went wrong.')).toBeInTheDocument();
    expect(reportError).toHaveBeenCalledTimes(1);
    expect(reportError.mock.calls[0][0]).toBeInstanceOf(Error);
  });
});