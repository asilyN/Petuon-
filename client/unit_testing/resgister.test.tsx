import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, vi, expect, it } from 'vitest';
import RegisterPage from '../src/pages/RegisterPage'
import axios from 'axios';

// Mock dependencies
vi.mock('axios');

describe('RegisterPage', () => {
  const mockApiUrl = 'http://localhost:3000/register/registerUser';

  it('renders the registration form correctly', () => {
    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    );

    // Check if the form elements are rendered
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByText(/Create your account/i)).toBeInTheDocument();
  });

  it('displays required field validation messages', async () => {
    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    );

    // Submit the form without filling in the fields
    fireEvent.click(screen.getByText(/Sign Up/i));

    // Check if the required field validation messages are displayed
    expect(await screen.findByText('Email is required')).toBeInTheDocument();
    expect(await screen.findByText('Username is required')).toBeInTheDocument();
    expect(await screen.findByText('Password is required')).toBeInTheDocument();
  });

  it('displays email format validation message', async () => {
    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    );

    // Fill in the form fields with invalid email
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'invalid-email' } });
    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });

    // Submit the form
    fireEvent.click(screen.getByText(/Sign Up/i));

    // Check if the email format validation message is displayed
    expect(await screen.findByText('Invalid email')).toBeInTheDocument();
  });

  it('displays password length validation message', async () => {
    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    );

    // Fill in the form fields with a short password
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'short' } });

    // Submit the form
    fireEvent.click(screen.getByText(/Sign Up/i));

    // Check if the password length validation message is displayed
    expect(await screen.findByText('Password must be at least 8 characters')).toBeInTheDocument();
  });

  it('handles form submission correctly', async () => {
    const mockedAxiosPost = vi.fn().mockResolvedValue({ data: { message: 'Success' } });
    vi.mocked(axios.post).mockImplementation(mockedAxiosPost);

    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    );

    // Fill in the form fields
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });

    // Submit the form
    fireEvent.click(screen.getByText(/Sign Up/i));

    // Wait for the success message to appear
    await waitFor(() => screen.findByText('Registration successful! Please check your email to confirm.'));

    // Check if the axios POST request was made with the correct data
    expect(mockedAxiosPost).toHaveBeenCalledWith(
      mockApiUrl,
      expect.objectContaining({
        user_email: 'test@example.com',
        user_name: 'testuser',
        user_password: 'password123',
      })
    );
  });

  it('shows an error message on form submission failure', async () => {
    const mockedAxiosPost = vi.fn().mockRejectedValue(new Error('Network error'));
    vi.mocked(axios.post).mockImplementation(mockedAxiosPost);

    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    );

    // Fill in the form fields
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });

    // Submit the form
    fireEvent.click(screen.getByText(/Sign Up/i));

    // Wait for the error message to appear
    await waitFor(() => screen.findByText('An error occurred while registering. Please try again later.'));

    // Check if the axios POST request was made with the correct data
    expect(mockedAxiosPost).toHaveBeenCalledWith(
      mockApiUrl,
      expect.objectContaining({
        user_email: 'test@example.com',
        user_name: 'testuser',
        user_password: 'password123',
      })
    );
  });
});
