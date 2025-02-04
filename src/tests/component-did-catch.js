import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ComponentDidCatch from '../component-did-catch';

jest.mock('../api/getAllProcedures', () => ({
  getAllProcedures: jest.fn(),
}));

describe('ComponentDidCatch', () => {
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

  test('renders form list view', async () => {
    render(<ComponentDidCatch />);
    expect(screen.getByRole('list')).toBeInTheDocument();
  });

  test('adapts layout to different screen sizes', () => {
    const { container } = render(<ComponentDidCatch />);
    expect(container.firstChild).toHaveStyle('display: flex');
  });

  test('displays request form popup', () => {
    render(<ComponentDidCatch />);
    fireEvent.click(screen.getByText('REQUEST FORMS'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  test('verifies layout dimensions', () => {
    const { container } = render(<ComponentDidCatch />);
    expect(container.querySelector('header')).toHaveStyle('height: 64px');
    expect(container.querySelector('nav')).toHaveStyle('width: 72px');
  });

  test('fetches initial data on mount', async () => {
    render(<ComponentDidCatch />);
    await waitFor(() => expect(getAllProcedures).toHaveBeenCalled());
  });

  test('displays loading indicator during form submission', async () => {
    render(<ComponentDidCatch />);
    fireEvent.click(screen.getByText('Submit'));
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('handles API error', async () => {
    getAllProcedures.mockRejectedValueOnce(new Error('API Error'));
    render(<ComponentDidCatch />);
    await waitFor(() => expect(screen.getByText('Error: API Error')).toBeInTheDocument());
  });

  test('disables background scroll when popup is active', () => {
    render(<ComponentDidCatch />);
    fireEvent.click(screen.getByText('REQUEST FORMS'));
    expect(document.body).toHaveStyle('overflow: hidden');
  });

  test('restores background scroll when popup is closed', () => {
    render(<ComponentDidCatch />);
    fireEvent.click(screen.getByText('REQUEST FORMS'));
    fireEvent.click(screen.getByLabelText('Close'));
    expect(document.body).not.toHaveStyle('overflow: hidden');
  });

  test('checks accessibility features', () => {
    render(<ComponentDidCatch />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
  });
});