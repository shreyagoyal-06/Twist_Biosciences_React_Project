```javascript
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ErrorBoundary, BombButton, reportError } from '../component-did-catch';

jest.mock('../utils', () => ({
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
    jest.clearAllMocks();
  });

  test('catches errors thrown by child components', () => {
    const ThrowError = () => {
      throw new Error('Test error');
    };

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong.')).toBeInTheDocument();
  });

  test('renders fallback UI when error is caught', () => {
    const ThrowError = () => {
      throw new Error('Test error');
    };

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong.')).toBeInTheDocument();
  });

  test('displays customizable error messages', () => {
    const ThrowError = () => {
      throw new Error('Custom error');
    };

    render(
      <ErrorBoundary fallback={<div>Custom error message</div>}>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText('Custom error message')).toBeInTheDocument();
  });

  test('resets properly after an error occurs', () => {
    const ThrowError = () => {
      throw new Error('Test error');
    };

    const { rerender } = render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong.')).toBeInTheDocument();

    rerender(
      <ErrorBoundary>
        <div>Normal content</div>
      </ErrorBoundary>
    );

    expect(screen.getByText('Normal content')).toBeInTheDocument();
  });
});

describe('BombButton', () => {
  test('renders correctly', () => {
    render(<BombButton />);
    expect(screen.getByRole('button', { name: 'Bomb!' })).toBeInTheDocument();
  });

  test('triggers an error when clicked', () => {
    render(
      <ErrorBoundary>
        <BombButton />
      </ErrorBoundary>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Bomb!' }));

    expect(screen.getByText('Something went wrong.')).toBeInTheDocument();
  });

  test('is disabled after throwing an error', () => {
    render(
      <ErrorBoundary>
        <BombButton />
      </ErrorBoundary>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Bomb!' }));

    expect(screen.getByRole('button', { name: 'Bomb!' })).toBeDisabled();
  });
});

describe('reportError', () => {
  test('is called when an error occurs', () => {
    const ThrowError = () => {
      throw new Error('Test error');
    };

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(reportError).toHaveBeenCalled();
  });

  test('logs the correct error object', () => {
    const testError = new Error('Test error');
    const ThrowError = () => {
      throw testError;
    };

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(reportError).toHaveBeenCalledWith(
      expect.objectContaining({
        error: testError,
      })
    );
  });

  test('includes additional metadata in the error log', () => {
    const ThrowError = () => {
      throw new Error('Test error');
    };

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(reportError).toHaveBeenCalledWith(
      expect.objectContaining({
        timestamp: expect.any(Number),
        componentStack: expect.any(String),
      })
    );
  });
});
```