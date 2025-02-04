
// src/__tests__/ErrorBoundary.test.js

import React from 'react';
import { render, screen } from '@testing-library/react';
import { ErrorBoundary } from '../component-did-catch';

// Mock console.error to suppress expected error messages
const originalError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalError;
});

beforeEach(() => {
  console.error.mockClear();
});

describe('ErrorBoundary', () => {
  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div>Test Content</div>
      </ErrorBoundary>
    );
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('renders fallback UI when an error is caught', () => {
    const ThrowError = () => {
      throw new Error('Test error');
    };

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
  });

  it('supports customizable error messages', () => {
    const customMessage = 'Custom error message';
    const ThrowError = () => {
      throw new Error('Test error');
    };

    render(
      <ErrorBoundary fallback={<div role="alert">{customMessage}</div>}>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText(customMessage)).toBeInTheDocument();
  });
});
```

Now, let's create the test file for the BombButton component:

```javascript
// src/__tests__/BombButton.test.js

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BombButton, ErrorBoundary } from '../component-did-catch';

// Mock console.error to suppress expected error messages
const originalError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalError;
});

beforeEach(() => {
  console.error.mockClear();
});

describe('BombButton', () => {
  it('renders correctly', () => {
    render(<BombButton />);
    expect(screen.getByRole('button', { name: /throw error/i })).toBeInTheDocument();
  });

  it('throws an error when clicked', () => {
    render(
      <ErrorBoundary>
        <BombButton />
      </ErrorBoundary>
    );

    const button = screen.getByRole('button', { name: /throw error/i });
    fireEvent.click(button);

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
  });
});
```

Lastly, let's create a test file for the reportError function:

```javascript
// src/__tests__/reportError.test.js

import { reportError } from '../component-did-catch';

// Mock console.error to suppress expected error messages
const originalError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalError;
});

beforeEach(() => {
  console.error.mockClear();
});

describe('reportError', () => {
  it('logs the error with additional metadata', () => {
    const testError = new Error('Test error');
    const componentStack = 'ComponentA > ComponentB > ComponentC';

    reportError(testError, componentStack);

    expect(console.error).toHaveBeenCalledTimes(1);
    const errorCall = console.error.mock.calls[0];
    expect(errorCall[0]).toContain('Error reported:');
    expect(errorCall[1]).toBe(testError);
    expect(errorCall[2]).toContain('Component Stack:');
    expect(errorCall[3]).toBe(componentStack);
    expect(errorCall[4]).toContain('Timestamp:');
  });
});
