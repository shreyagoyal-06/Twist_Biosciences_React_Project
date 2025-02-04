```javascript
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { ErrorBoundary, BombButton } from '../component-did-catch';
import { reportError } from '../error-reporting';

jest.mock('../error-reporting');

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

  test('catches and handles errors', () => {
    render(
      <ErrorBoundary>
        <BombButton />
      </ErrorBoundary>
    );
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('There was a problem')).toBeInTheDocument();
  });

  test('logs errors using reportError', () => {
    render(
      <ErrorBoundary>
        <BombButton />
      </ErrorBoundary>
    );
    fireEvent.click(screen.getByRole('button'));
    expect(reportError).toHaveBeenCalledTimes(1);
    expect(reportError.mock.calls[0][0]).toBeInstanceOf(TypeError);
    expect(reportError.mock.calls[0][1].componentStack).toContain('BombButton');
  });

  test('manages console errors', () => {
    render(
      <ErrorBoundary>
        <BombButton />
      </ErrorBoundary>
    );
    fireEvent.click(screen.getByRole('button'));
    expect(console.error).toHaveBeenCalledTimes(2);
  });

  test('updates state when error occurs', () => {
    const { rerender } = render(
      <ErrorBoundary>
        <BombButton />
      </ErrorBoundary>
    );
    expect(screen.queryByText('There was a problem')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('There was a problem')).toBeInTheDocument();
  });

  test('handles multiple errors independently', () => {
    render(
      <>
        <ErrorBoundary>
          <BombButton />
        </ErrorBoundary>
        <ErrorBoundary>
          <BombButton />
        </ErrorBoundary>
      </>
    );
    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[0]);
    fireEvent.click(buttons[1]);
    expect(screen.getAllByText('There was a problem')).toHaveLength(2);
    expect(reportError).toHaveBeenCalledTimes(2);
  });

  test('resets state and re-renders children', () => {
    const { rerender } = render(
      <ErrorBoundary>
        <BombButton />
      </ErrorBoundary>
    );
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('There was a problem')).toBeInTheDocument();
    rerender(
      <ErrorBoundary>
        <BombButton />
      </ErrorBoundary>
    );
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
```