import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ComponentDidCatch from '../component-did-catch';
import { getAllProcedures } from '../api/procedures';

jest.mock('../api/procedures');

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

  test('renders form list correctly', async () => {
    getAllProcedures.mockResolvedValue([{ id: 1, name: 'Form 1' }]);
    render(<ComponentDidCatch />);
    await waitFor(() => {
      expect(screen.getByText('Form 1')).toBeInTheDocument();
    });
  });

  test('adapts layout to different screen sizes', () => {
    render(<ComponentDidCatch />);
    const mainContent = screen.getByRole('main');
    expect(mainContent).toHaveStyle('flex: 1');
  });

  test('displays request form popup', () => {
    render(<ComponentDidCatch />);
    fireEvent.click(screen.getByText('REQUEST FORMS'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  test('verifies layout dimensions', () => {
    render(<ComponentDidCatch />);
    const header = screen.getByRole('banner');
    const sidebar = screen.getByRole('complementary');
    expect(header).toHaveStyle('height: 64px');
    expect(sidebar).toHaveStyle('width: 72px');
  });

  test('handles API error', async () => {
    getAllProcedures.mockRejectedValue(new Error('API Error'));
    render(<ComponentDidCatch />);
    await waitFor(() => {
      expect(screen.getByText('Error: API Error')).toBeInTheDocument();
    });
  });

  test('displays loading indicator during form submission', async () => {
    render(<ComponentDidCatch />);
    fireEvent.click(screen.getByText('Submit'));
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('fetches data on component mount', async () => {
    render(<ComponentDidCatch />);
    expect(getAllProcedures).toHaveBeenCalledTimes(1);
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
    expect(screen.getByRole('button', { name: 'REQUEST FORMS' })).toHaveAttribute('aria-haspopup', 'dialog');
  });
});

         
