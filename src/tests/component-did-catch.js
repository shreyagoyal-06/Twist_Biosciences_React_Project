import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import BombButton from '../component-did-catch';

describe('BombButton', () => {
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

  test('renders without errors', () => {
    render(<BombButton />);
    const button = screen.getByRole('button', { name: /detonate/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveStyle('background-color: red');
  });

  test('simulates error and catches it', () => {
    render(<BombButton shouldError={true} />);
    expect(console.error).toHaveBeenCalled();
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
  });

  test('displays error message', () => {
    render(<BombButton shouldError={true} />);
    expect(screen.getByText(/oops! something went wrong/i)).toBeInTheDocument();
  });

  test('reports error to service', () => {
    const mockErrorService = jest.fn();
    render(<BombButton shouldError={true} errorService={mockErrorService} />);
    expect(mockErrorService).toHaveBeenCalledWith(expect.any(Error));
  });

  test('updates UI on error', () => {
    render(<BombButton shouldError={true} />);
    expect(screen.getByRole('button', { name: /detonate/i })).toBeDisabled();
    expect(screen.getByTestId('error-icon')).toBeInTheDocument();
  });

  test('recovers from error state', () => {
    const { rerender } = render(<BombButton shouldError={true} />);
    expect(screen.getByText(/oops! something went wrong/i)).toBeInTheDocument();
    
    rerender(<BombButton shouldError={false} />);
    expect(screen.queryByText(/oops! something went wrong/i)).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /detonate/i })).toBeEnabled();
  });

  test('handles multiple errors', () => {
    const { rerender } = render(<BombButton />);
    
    rerender(<BombButton shouldError={true} />);
    expect(screen.getByText(/oops! something went wrong/i)).toBeInTheDocument();
    
    rerender(<BombButton shouldError={false} />);
    expect(screen.queryByText(/oops! something went wrong/i)).not.toBeInTheDocument();
    
    rerender(<BombButton shouldError={true} />);
    expect(screen.getByText(/oops! something went wrong/i)).toBeInTheDocument();
  });

  test('measures performance impact of error handling', async () => {
    const start = performance.now();
    render(<BombButton />);
    const normalRenderTime = performance.now() - start;

    const errorStart = performance.now();
    render(<BombButton shouldError={true} />);
    const errorRenderTime = performance.now() - errorStart;

    expect(errorRenderTime).toBeLessThan(normalRenderTime * 2);
  });
});

