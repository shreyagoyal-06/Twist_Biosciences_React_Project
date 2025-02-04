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

  test('renders children when no error occurs', () => {
    render(
      <ErrorBoundary>
        <div>Test Content</div>
      </ErrorBoundary>
    );
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  test('renders fallback UI when error is caught', () => {
    render(
      <ErrorBoundary>
        <BombButton />
      </ErrorBoundary>
    );
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('There was an error:')).toBeInTheDocument();
  });

  test('supports customizable error messages', () => {
    render(
      <ErrorBoundary fallback={<div>Custom Error Message</div>}>
        <BombButton />
      </ErrorBoundary>
    );
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Custom Error Message')).toBeInTheDocument();
  });

  test('catches different types of errors', () => {
    const ThrowError = ({ type }) => {
      if (type === 'syntax') {
        throw new SyntaxError('Syntax Error');
      } else {
        throw new Error('Runtime Error');
      }
    };

    render(
      <ErrorBoundary>
        <ThrowError type="syntax" />
      </ErrorBoundary>
    );
    expect(screen.getByText('There was an error:')).toBeInTheDocument();

    render(
      <ErrorBoundary>
        <ThrowError type="runtime" />
      </ErrorBoundary>
    );
    expect(screen.getByText('There was an error:')).toBeInTheDocument();
  });
});

describe('BombButton', () => {
  test('renders correctly', () => {
    render(<BombButton />);
    expect(screen.getByRole('button', { name: 'Bomb' })).toBeInTheDocument();
  });

  test('triggers an error when clicked', () => {
    render(
      <ErrorBoundary>
        <BombButton />
      </ErrorBoundary>
    );
    fireEvent.click(screen.getByRole('button', { name: 'Bomb' }));
    expect(screen.getByText('There was an error:')).toBeInTheDocument();
  });

  test('error is caught by ErrorBoundary', () => {
    render(
      <ErrorBoundary>
        <BombButton />
      </ErrorBoundary>
    );
    fireEvent.click(screen.getByRole('button', { name: 'Bomb' }));
    expect(screen.queryByRole('button', { name: 'Bomb' })).not.toBeInTheDocument();
    expect(screen.getByText('There was an error:')).toBeInTheDocument();
  });
});

describe('reportError', () => {
  test('is called when an error occurs', () => {
    render(
      <ErrorBoundary>
        <BombButton />
      </ErrorBoundary>
    );
    fireEvent.click(screen.getByRole('button', { name: 'Bomb' }));
    expect(reportError).toHaveBeenCalled();
  });

  test('logs the correct error object', () => {
    render(
      <ErrorBoundary>
        <BombButton />
      </ErrorBoundary>
    );
    fireEvent.click(screen.getByRole('button', { name: 'Bomb' }));
    expect(reportError).toHaveBeenCalledWith(expect.any(Error));
  });

  test('logs additional metadata', () => {
    render(
      <ErrorBoundary>
        <BombButton />
      </ErrorBoundary>
    );
    fireEvent.click(screen.getByRole('button', { name: 'Bomb' }));
    expect(reportError).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({
        timestamp: expect.any(Number),
        componentStack: expect.any(String),
      })
    );
  });
});