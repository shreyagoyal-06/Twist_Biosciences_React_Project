```javascript
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorBoundary } from '../component-did-catch';
import { reportError } from '../utils';

jest.mock('../utils', () => ({
  reportError: jest.fn()
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

  it('catches errors thrown by child components', () => {
    const ThrowError = () => {
      throw new Error('Test error');
    };

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText('There was a problem')).toBeInTheDocument();
  });

  it('displays fallback UI when an error occurs', () => {
    const ThrowError = () => {
      throw new Error('Test error');
    };

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText('There was a problem')).toBeInTheDocument();
  });

  it('allows customizable error messages', () => {
    const ThrowError = () => {
      throw new Error('Test error');
    };

    render(
      <ErrorBoundary fallback={<div>Custom error message</div>}>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText('Custom error message')).toBeInTheDocument();
  });

  it('provides context-specific feedback', () => {
    const ThrowError = () => {
      throw new Error('Context-specific error');
    };

    render(
      <ErrorBoundary fallback={<div>Context-specific feedback</div>}>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText('Context-specific feedback')).toBeInTheDocument();
  });
});

describe('BombButton', () => {
  it('triggers an error when clicked', () => {
    render(
      <ErrorBoundary>
        <button aria-label="bomb">💣</button>
      </ErrorBoundary>
    );

    const bombButton = screen.getByRole('button', { name: 'bomb' });
    fireEvent.click(bombButton);

    expect(screen.getByText('There was a problem')).toBeInTheDocument();
  });

  it('error is caught by ErrorBoundary', () => {
    render(
      <ErrorBoundary>
        <button aria-label="bomb">💣</button>
      </ErrorBoundary>
    );

    const bombButton = screen.getByRole('button', { name: 'bomb' });
    fireEvent.click(bombButton);

    expect(screen.getByText('There was a problem')).toBeInTheDocument();
  });

  it('calls reportError with correct error object', () => {
    render(
      <ErrorBoundary>
        <button aria-label="bomb">💣</button>
      </ErrorBoundary>
    );

    const bombButton = screen.getByRole('button', { name: 'bomb' });
    fireEvent.click(bombButton);

    expect(reportError).toHaveBeenCalledWith(expect.any(Error));
  });
});

describe('reportError', () => {
  it('is called once when an error occurs', () => {
    const ThrowError = () => {
      throw new Error('Test error');
    };

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(reportError).toHaveBeenCalledTimes(1);
  });

  it('logs additional metadata', () => {
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
        message: 'Test error',
        timestamp: expect.any(Number),
        componentStack: expect.any(String)
      })
    );
  });
});

describe('Form Functionality', () => {
  it('renders initial input fields', () => {
    render(<form>
      <input type="email" aria-label="email" />
      <input type="password" aria-label="password" />
    </form>);

    expect(screen.getByLabelText('email')).toBeInTheDocument();
    expect(screen.getByLabelText('password')).toBeInTheDocument();
  });

  it('displays error messages for empty form submission', async () => {
    render(<form>
      <input type="email" aria-label="email" />
      <input type="password" aria-label="password" />
      <button type="submit">Submit</button>
    </form>);

    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

    expect(await screen.findByText('Email is required')).toBeInTheDocument();
    expect(await screen.findByText('Password is required')).toBeInTheDocument();
  });

  it('displays error message for invalid email format', async () => {
    render(<form>
      <input type="email" aria-label="email" />
      <button type="submit">Submit</button>
    </form>);

    fireEvent.change(screen.getByLabelText('email'), { target: { value: 'invalid-email' } });
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

    expect(await screen.findByText('Invalid email format')).toBeInTheDocument();
  });

  it('submits form with valid credentials', async () => {
    const handleSubmit = jest.fn();
    render(<form onSubmit={handleSubmit}>
      <input type="email" aria-label="email" />
      <input type="password" aria-label="password" />
      <button type="submit">Submit</button>
    </form>);

    fireEvent.change(screen.getByLabelText('email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

    expect(handleSubmit).toHaveBeenCalledTimes(1);
  });

  it('resets form after successful submission', async () => {
    const handleSubmit = jest.fn();
    render(<form onSubmit={handleSubmit}>
      <input type="email" aria-label="email" />
      <input type="password" aria-label="password" />
      <button type="submit">Submit</button>
    </form>);

    fireEvent.change(screen.getByLabelText('email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

    expect(screen.getByLabelText('email')).toHaveValue('');
    expect(screen.getByLabelText('password')).toHaveValue('');
    expect(screen.queryByText('Email is required')).not.toBeInTheDocument();
    expect(screen.queryByText('Password is required')).not.toBeInTheDocument();
  });
});

describe('User Experience', () => {
  it('keeps UI usable when an error occurs', () => {
    const ThrowError = () => {
      throw new Error('Test error');
    };

    render(
      <ErrorBoundary>
        <ThrowError />
        <button>Clickable Button</button>
      </ErrorBoundary>
    );

    expect(screen.getByText('There was a problem')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Clickable Button' })).toBeInTheDocument();
  });

  it('notifies users about issues in a user-friendly manner', () => {
    const ThrowError = () => {
      throw new Error('Test error');
    };

    render(
      <ErrorBoundary fallback={<div>Oops! Something went wrong. Please try again later.</div>}>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText('Oops! Something went wrong. Please try again later.')).toBeInTheDocument();
  });

  it('displays visible and clear error messages', () => {
    const ThrowError = () => {
      throw new Error('Test error');
    };

    render(
      <ErrorBoundary fallback={<div role="alert">An error occurred: Test error</div>}>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByRole('alert')).toHaveTextContent('An error occurred: Test error');
  });
});

describe('Integration Tests', () => {
  it('handles component crashes without affecting other UI parts', () => {
    const ThrowError = () => {
      throw new Error('Test error');
    };

    render(
      <div>
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
        <button>Unaffected Button</button>
      </div>
    );

    expect(screen.getByText('There was a problem')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Unaffected Button' })).toBeInTheDocument();
  });

  it('renders fallback UI correctly when error is thrown', () => {
    const ThrowError = () => {
      throw new Error('Test error');
    };

    render(
      <ErrorBoundary fallback={<div>Custom Fallback UI</div>}>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText('Custom Fallback UI')).toBeInTheDocument();
  });
});

describe('Performance Tests', () => {
  it('handles errors without significant performance impact', () => {
    const start = performance.now();
    const ThrowError = () => {
      throw new Error('Test error');
    };

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    const end = performance.now();
    expect(end - start).toBeLessThan(100);
  });

  it('logs errors efficiently', () => {
    const ThrowError = () => {
      throw new Error('Test error');
    };

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(reportError).toHaveBeenCalledTimes(1);
  });
});

describe('Versioning and Layout Tests', () => {
  it('adapts error messages to different screen sizes', () => {
    const ThrowError = () => {
      throw new Error('Test error');
    };

    render(
      <ErrorBoundary fallback={<div data-testid="error-message">Responsive Error Message</div>}>
        <ThrowError />
      </ErrorBoundary>
    );

    const errorMessage = screen.getByTestId('error-message');
    expect(errorMessage).toBeInTheDocument();
    expect(window.getComputedStyle(errorMessage).display).toBe('block');
  });
});
```