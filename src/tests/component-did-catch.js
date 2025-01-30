
// src/__tests__/BombButton.test.js

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BombButton } from '../component-did-catch';
import { reportError } from '../utils';

jest.mock('../utils', () => ({
  reportError: jest.fn(),
}));

describe('BombButton', () => {
  let consoleErrorSpy;

  beforeAll(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders correctly', () => {
    render(<BombButton />);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('💣');
  });

  test('clicking the button throws an error and displays fallback UI', async () => {
    render(<BombButton />);
    const button = screen.getByRole('button');
    
    fireEvent.click(button);

    const errorMessage = await screen.findByText('There was a problem');
    expect(errorMessage).toBeInTheDocument();
    expect(button).not.toBeInTheDocument();
  });

  test('error is reported when bomb explodes', async () => {
    render(<BombButton />);
    const button = screen.getByRole('button');
    
    fireEvent.click(button);

    await screen.findByText('There was a problem');
    expect(reportError).toHaveBeenCalledTimes(1);
    expect(reportError.mock.calls[0][0]).toBeInstanceOf(Error);
    expect(reportError.mock.calls[0][1]).toHaveProperty('componentStack');
  });

  test('error boundary resets when children change', () => {
    const { rerender } = render(<BombButton />);
    const button = screen.getByRole('button');
    
    fireEvent.click(button);

    const errorMessage = screen.getByText('There was a problem');
    expect(errorMessage).toBeInTheDocument();

    rerender(<BombButton key="new" />);
    const newButton = screen.getByRole('button');
    expect(newButton).toBeInTheDocument();
    expect(errorMessage).not.toBeInTheDocument();
  });
});
