import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BombButton } from '../component-did-catch';
 
// Mock reportError function
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
    console.error.mockClear();
  });
 
  test('renders bomb button initially', () => {
    render(<BombButton />);
    const button = screen.getByRole('button', { name: /bomb/i });
    expect(button).toBeInTheDocument();
  });
 
  test('renders error message when bomb is clicked', async () => {
    render(<BombButton />);
    const button = screen.getByRole('button', { name: /bomb/i });
    button.click();
 
    const errorMessage = await screen.findByText('There was a problem');
    expect(errorMessage).toBeInTheDocument();
  });
 
  test('calls reportError when an error occurs', async () => {
    const { reportError } = require('../utils');
    render(<BombButton />);
    const button = screen.getByRole('button', { name: /bomb/i });
    button.click();
 
    await screen.findByText('There was a problem');
    expect(reportError).toHaveBeenCalled();
  });
});

