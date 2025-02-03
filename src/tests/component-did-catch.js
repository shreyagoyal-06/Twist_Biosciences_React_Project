import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorBoundary, BombButton, reportError } from '../component-did-catch';

jest.mock('../reportError', () => ({
  reportError: jest.fn(),
}));

describe('ErrorBoundary', () => {
  const originalError = console.error;
  beforeAll(() => {
    console.error = jest.fn();
  });

  afterAll(() => {
    console.error = originalError;
  });

  beforeEach(() => {
    console.error.mockClear();
    reportError.mockClear();
  });

  test('catches errors thrown by child components', () => {
    render(
      <ErrorBoundary>
        <BombButton />
      </ErrorBoundary>
    );

    fireEvent.click(screen.getByRole('button', { name: /throw error/i }));

    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
  });

  test('displays fallback UI when an error occurs', () => {
    render(
      <ErrorBoundary>
        <BombButton />
      </ErrorBoundary>
    );

    fireEvent.click(screen.getByRole('button', { name: /throw error/i }));

    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /throw error/i })).not.toBeInTheDocument();
  });

  test('displays customizable error messages', () => {
    const customErrorMessage = 'Custom error message';
    render(
      <ErrorBoundary fallback={<div>{customErrorMessage}</div>}>
        <BombButton />
      </ErrorBoundary>
    );

    fireEvent.click(screen.getByRole('button', { name: /throw error/i }));

    expect(screen.getByText(customErrorMessage)).toBeInTheDocument();
  });
});

describe('BombButton', () => {
  test('renders correctly on initial load', () => {
    render(<BombButton />);
    expect(screen.getByRole('button', { name: /throw error/i })).toBeInTheDocument();
  });

  test('triggers an error when clicked', () => {
    render(
      <ErrorBoundary>
        <BombButton />
      </ErrorBoundary>
    );

    fireEvent.click(screen.getByRole('button', { name: /throw error/i }));

    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
  });
});

describe('reportError', () => {
  test('is called once when an error occurs', () => {
    render(
      <ErrorBoundary>
        <BombButton />
      </ErrorBoundary>
    );

    fireEvent.click(screen.getByRole('button', { name: /throw error/i }));

    expect(reportError).toHaveBeenCalledTimes(1);
  });

  test('is called with the correct error object', () => {
    render(
      <ErrorBoundary>
        <BombButton />
      </ErrorBoundary>
    );

    fireEvent.click(screen.getByRole('button', { name: /throw error/i }));

    expect(reportError).toHaveBeenCalledWith(expect.any(Error));
  });

  test('logs additional metadata', () => {
    render(
      <ErrorBoundary>
        <BombButton />
      </ErrorBoundary>
    );

    fireEvent.click(screen.getByRole('button', { name: /throw error/i }));

    expect(reportError).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({
        timestamp: expect.any(Number),
        componentStack: expect.any(String),
      })
    );
  });
});

describe('Form Functionality', () => {
  test('renders form with email and password fields', () => {
    render(<ErrorBoundary><Form /></ErrorBoundary>);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  test('displays error messages for empty form submission', async () => {
    render(<ErrorBoundary><Form /></ErrorBoundary>);
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
    expect(screen.getByText(/password is required/i)).toBeInTheDocument();
  });

  test('handles invalid email format', async () => {
    render(<ErrorBoundary><Form /></ErrorBoundary>);
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'invalid-email' } });
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    expect(await screen.findByText(/invalid email format/i)).toBeInTheDocument();
  });

  test('submits form with valid credentials', async () => {
    render(<ErrorBoundary><Form /></ErrorBoundary>);
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    expect(await screen.findByText(/form submitted successfully/i)).toBeInTheDocument();
  });

  test('resets form after successful submission', async () => {
    render(<ErrorBoundary><Form /></ErrorBoundary>);
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    await screen.findByText(/form submitted successfully/i);
    expect(screen.getByLabelText(/email/i)).toHaveValue('');
    expect(screen.getByLabelText(/password/i)).toHaveValue('');
  });
});

describe('User Experience', () => {
  test('application remains usable after an error occurs', () => {
    render(
      <ErrorBoundary>
        <BombButton />
        <Counter />
      </ErrorBoundary>
    );

    fireEvent.click(screen.getByRole('button', { name: /throw error/i }));
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /increment/i })).toBeInTheDocument();
  });

  test('users are notified about the issue through fallback UI', () => {
    render(
      <ErrorBoundary>
        <BombButton />
      </ErrorBoundary>
    );

    fireEvent.click(screen.getByRole('button', { name: /throw error/i }));
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    expect(screen.getByText(/please try again later/i)).toBeInTheDocument();
  });

  test('counter component functions correctly', () => {
    render(<ErrorBoundary><Counter /></ErrorBoundary>);
    expect(screen.getByText(/count: 0/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /increment/i }));
    expect(screen.getByText(/count: 1/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /decrement/i }));
    expect(screen.getByText(/count: 0/i)).toBeInTheDocument();
  });
});

describe('Integration Tests', () => {
  test('interaction between ErrorBoundary and BombButton', () => {
    render(
      <ErrorBoundary>
        <BombButton />
      </ErrorBoundary>
    );

    fireEvent.click(screen.getByRole('button', { name: /throw error/i }));
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    expect(reportError).toHaveBeenCalledTimes(1);
  });

  test('integration of reportError with error handling process', () => {
    render(
      <ErrorBoundary>
        <BombButton />
      </ErrorBoundary>
    );

    fireEvent.click(screen.getByRole('button', { name: /throw error/i }));
    expect(reportError).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({
        timestamp: expect.any(Number),
        componentStack: expect.any(String),
      })
    );
  });

  test('error handling mechanism works across different components', () => {
    render(
      <ErrorBoundary>
        <BombButton />
        <Counter />
      </ErrorBoundary>
    );

    fireEvent.click(screen.getByRole('button', { name: /throw error/i }));
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /increment/i })).not.toBeInTheDocument();
    expect(reportError).toHaveBeenCalledTimes(1);
  });
});