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
    expect(container.querySelector('.navbar')).toHaveStyle('height: 64px');
    expect(container.querySelector('.sidebar')).toHaveStyle('width: 72px');
  });

  test('manages core states correctly', async () => {
    render(<ComponentDidCatch />);
    await waitFor(() => {
      expect(screen.getByRole('list')).not.toBeEmpty();
    });
  });

  test('displays loading indicator during form submission', async () => {
    render(<ComponentDidCatch />);
    fireEvent.click(screen.getByText('Submit'));
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('handles API integration', async () => {
    const mockGetAllProcedures = require('../api/getAllProcedures').getAllProcedures;
    mockGetAllProcedures.mockResolvedValue([{ id: 1, name: 'Test Form' }]);
    render(<ComponentDidCatch />);
    await waitFor(() => {
      expect(screen.getByText('Test Form')).toBeInTheDocument();
    });
  });

  test('handles API errors', async () => {
    const mockGetAllProcedures = require('../api/getAllProcedures').getAllProcedures;
    mockGetAllProcedures.mockRejectedValue(new Error('API Error'));
    render(<ComponentDidCatch />);
    await waitFor(() => {
      expect(screen.getByText('Error loading forms')).toBeInTheDocument();
    });
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

  test('verifies accessibility features', () => {
    render(<ComponentDidCatch />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'REQUEST FORMS' })).toHaveAttribute('aria-haspopup', 'dialog');
  });
});