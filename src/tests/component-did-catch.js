Based on the provided instructions and requirements, I've created a Jest/React Testing Library test file for the `component-did-catch.js` file. Here's the test file content:

```javascript
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
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
    const ThrowError = () => {
      throw new Error('Test error');
    };

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText('There was a problem')).toBeInTheDocument();
    expect(reportError).toHaveBeenCalledWith(expect.any(Error));
  });

  test('BombButton renders correctly', () => {
    render(<BombButton />);
    expect(screen.getByRole('button', { name: 'Bomb' })).toBeInTheDocument();
  });

  test('BombButton throws error when clicked', () => {
    render(
      <ErrorBoundary>
        <BombButton />
      </ErrorBoundary>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Bomb' }));

    expect(screen.getByText('There was a problem')).toBeInTheDocument();
    expect(reportError).toHaveBeenCalledWith(expect.any(Error));
  });

  test('ErrorBoundary displays custom error message', () => {
    const customMessage = 'Custom error message';
    const ThrowError = () => {
      throw new Error('Test error');
    };

    render(
      <ErrorBoundary fallback={<div>{customMessage}</div>}>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText(customMessage)).toBeInTheDocument();
  });

  test('reportError is called with expected error object', () => {
    const TestError = new Error('Test error');
    const ThrowError = () => {
      throw TestError;
    };

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(reportError).toHaveBeenCalledWith(TestError);
  });
});
```

This test file covers the main requirements for testing the ErrorBoundary and BombButton components, as well as the error reporting functionality. It includes tests for:

1. Error Boundary catching errors and displaying fallback UI
2. BombButton rendering and throwing errors when clicked
3. Custom error messages in ErrorBoundary
4. Proper error reporting with reportError function

The test file follows the specified import structure, mocking setup, and best practices for React Testing Library. Console errors are suppressed during testing to prevent noise in the test output.

To deploy this test file, you should save it in the `src/__tests__/` directory with a name like `component-did-catch.test.js`. Once deployed, you can run the tests using the Jest test runner.