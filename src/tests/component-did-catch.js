```javascript
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

    fireEvent.click(screen.getByRole('button'));

    expect(screen.getByText('Something went wrong.')).toBeInTheDocument();
  });

  test('displays fallback UI when error is caught', () => {
    render(
      <ErrorBoundary>
        <BombButton />
      </ErrorBoundary>
    );

    fireEvent.click(screen.getByRole('button'));

    expect(screen.getByText('Something went wrong.')).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  test('allows customizable error messages', () => {
    render(
      <ErrorBoundary fallback={<div>Custom error message</div>}>
        <BombButton />
      </ErrorBoundary>
    );

    fireEvent.click(screen.getByRole('button'));

    expect(screen.getByText('Custom error message')).toBeInTheDocument();
  });
});

describe('BombButton', () => {
  test('renders correctly', () => {
    render(<BombButton />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  test('throws error on click', () => {
    render(
      <ErrorBoundary>
        <BombButton />
      </ErrorBoundary>
    );

    fireEvent.click(screen.getByRole('button'));

    expect(screen.getByText('Something went wrong.')).toBeInTheDocument();
  });
});

describe('reportError', () => {
  test('is called once when an error occurs', () => {
    render(
      <ErrorBoundary>
        <BombButton />
      </ErrorBoundary>
    );

    fireEvent.click(screen.getByRole('button'));

    expect(reportError).toHaveBeenCalledTimes(1);
  });

  test('receives correct error object', () => {
    render(
      <ErrorBoundary>
        <BombButton />
      </ErrorBoundary>
    );

    fireEvent.click(screen.getByRole('button'));

    expect(reportError).toHaveBeenCalledWith(expect.any(Error));
  });

  test('logs additional metadata', () => {
    render(
      <ErrorBoundary>
        <BombButton />
      </ErrorBoundary>
    );

    fireEvent.click(screen.getByRole('button'));

    const errorCall = reportError.mock.calls[0][0];
    expect(errorCall).toHaveProperty('timestamp');
    expect(errorCall).toHaveProperty('componentStack');
  });
});

describe('User Experience', () => {
  test('UI remains usable after error', () => {
    render(
      <ErrorBoundary>
        <BombButton />
        <div>Other content</div>
      </ErrorBoundary>
    );

    fireEvent.click(screen.getByRole('button'));

    expect(screen.getByText('Something went wrong.')).toBeInTheDocument();
    expect(screen.getByText('Other content')).toBeInTheDocument();
  });

  test('user-friendly error notification', () => {
    render(
      <ErrorBoundary>
        <BombButton />
      </ErrorBoundary>
    );

    fireEvent.click(screen.getByRole('button'));

    expect(screen.getByText('Something went wrong.')).toBeInTheDocument();
    expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
  });
});

describe('Integration', () => {
  test('error handling flow from generation to logging', () => {
    render(
      <ErrorBoundary>
        <BombButton />
      </ErrorBoundary>
    );

    fireEvent.click(screen.getByRole('button'));

    expect(screen.getByText('Something went wrong.')).toBeInTheDocument();
    expect(reportError).toHaveBeenCalledTimes(1);
    expect(reportError).toHaveBeenCalledWith(expect.any(Error));
  });
});
```