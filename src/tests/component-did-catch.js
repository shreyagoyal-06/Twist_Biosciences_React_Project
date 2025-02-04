import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BombButton, ErrorBoundary } from '../component-did-catch';

const reportError = jest.fn();

jest.spyOn(console, 'error').mockImplementation(() => {});

describe('BombButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    console.error.mockRestore();
  });

  test('Verify error is caught by ErrorBoundary', () => {
    render(
      <ErrorBoundary>
        <BombButton />
      </ErrorBoundary>
    );
    fireEvent.click(screen.getByRole('button', { name: /throw error/i }));
    expect(screen.getByText('There was a problem.')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /throw error/i })).not.toBeInTheDocument();
  });

  test('Confirm correct UI display on error', () => {
    render(
      <ErrorBoundary>
        <BombButton />
      </ErrorBoundary>
    );
    fireEvent.click(screen.getByRole('button', { name: /throw error/i }));
    expect(screen.getByText('There was a problem.')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /throw error/i })).not.toBeInTheDocument();
  });

  test('Validate reportError function call', () => {
    render(
      <ErrorBoundary reportError={reportError}>
        <BombButton />
      </ErrorBoundary>
    );
    fireEvent.click(screen.getByRole('button', { name: /throw error/i }));
    expect(reportError).toHaveBeenCalledTimes(1);
    expect(reportError).toHaveBeenCalledWith('Error in BombButton', expect.any(Error));
  });

  test('Proper console.error management', () => {
    render(
      <ErrorBoundary>
        <BombButton />
      </ErrorBoundary>
    );
    fireEvent.click(screen.getByRole('button', { name: /throw error/i }));
    expect(console.error).not.toHaveBeenCalled();
  });

  test('ErrorBoundary resets on prop changes', () => {
    const { rerender } = render(
      <ErrorBoundary key={1}>
        <BombButton />
      </ErrorBoundary>
    );
    fireEvent.click(screen.getByRole('button', { name: /throw error/i }));
    expect(screen.getByText('There was a problem.')).toBeInTheDocument();

    rerender(
      <ErrorBoundary key={2}>
        <BombButton />
      </ErrorBoundary>
    );
    expect(screen.getByRole('button', { name: /throw error/i })).toBeInTheDocument();
  });

  test('Multiple errors handling', () => {
    render(
      <ErrorBoundary>
        <BombButton />
        <BombButton />
      </ErrorBoundary>
    );
    fireEvent.click(screen.getAllByRole('button', { name: /throw error/i })[0]);
    fireEvent.click(screen.getAllByRole('button', { name: /throw error/i })[1]);
    expect(screen.getByText('There was a problem.')).toBeInTheDocument();
    expect(screen.queryAllByRole('button', { name: /throw error/i })).toHaveLength(0);
  });
});