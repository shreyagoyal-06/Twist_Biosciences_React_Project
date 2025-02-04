import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BombButton } from '../component-did-catch';
import { ErrorBoundary } from '../error-boundary';
import { reportError } from '../utils';

jest.mock('../utils', () => ({
  reportError: jest.fn(),
}));

describe('BombButton', () => {
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

  test('renders bomb button', () => {
    render(<BombButton />);
    expect(screen.getByRole('button', { name: '💣' })).toBeInTheDocument();
  });

  test('triggers error and displays fallback UI', () => {
    render(
      <ErrorBoundary>
        <BombButton />
      </ErrorBoundary>
    );
    fireEvent.click(screen.getByRole('button', { name: '💣' }));
    expect(screen.getByText('There was a problem.')).toBeInTheDocument();
  });

  test('calls reportError with correct parameters', () => {
    render(
      <ErrorBoundary>
        <BombButton />
      </ErrorBoundary>
    );
    fireEvent.click(screen.getByRole('button', { name: '💣' }));
    expect(reportError).toHaveBeenCalledTimes(1);
    expect(reportError.mock.calls[0][0]).toBeInstanceOf(TypeError);
    expect(reportError.mock.calls[0][1]).toHaveProperty('componentStack');
    expect(reportError.mock.calls[0][1].componentStack).toContain('BombButton');
  });

  test('calls console.error twice during error handling', () => {
    render(
      <ErrorBoundary>
        <BombButton />
      </ErrorBoundary>
    );
    fireEvent.click(screen.getByRole('button', { name: '💣' }));
    expect(console.error).toHaveBeenCalledTimes(2);
  });

  test('updates ErrorBoundary state on error', () => {
    const errorBoundary = React.createRef();
    render(
      <ErrorBoundary ref={errorBoundary}>
        <BombButton />
      </ErrorBoundary>
    );
    expect(errorBoundary.current.state.hasError).toBe(false);
    fireEvent.click(screen.getByRole('button', { name: '💣' }));
    expect(errorBoundary.current.state.hasError).toBe(true);
  });

  test('attempts to recover after error', () => {
    const errorBoundary = React.createRef();
    render(
      <ErrorBoundary ref={errorBoundary}>
        <BombButton />
      </ErrorBoundary>
    );
    fireEvent.click(screen.getByRole('button', { name: '💣' }));
    expect(screen.getByText('There was a problem.')).toBeInTheDocument();
    errorBoundary.current.setState({ hasError: false });
    expect(screen.queryByText('There was a problem.')).not.toBeInTheDocument();
  });
});