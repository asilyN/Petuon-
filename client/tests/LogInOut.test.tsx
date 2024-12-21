import { render, screen } from '@testing-library/react';
import LogInOut from '../src/pages/LoginPage'; // Adjust the path as needed
import '@testing-library/jest-dom'; // For the jest-dom matchers

describe('LogInOut Component', () => {
  it('renders the loading gif correctly', () => {
    render(<LogInOut />);
    const loadingGif = screen.getByAltText('Loading...');
    expect(loadingGif).toBeInTheDocument();
    expect(loadingGif).toHaveAttribute('src', expect.stringContaining('Petuon_loading_.gif'));
  });

  it('applies the correct class to the loading overlay', () => {
    render(<LogInOut />);
    const loadingOverlay = screen.getByRole('img'); // The img tag serves as the main element here
    expect(loadingOverlay).toHaveClass('loading-overlay');
  });

  it('applies the correct class to the loading gif', () => {
    render(<LogInOut />);
    const loadingGif = screen.getByAltText('Loading...');
    expect(loadingGif).toHaveClass('loading-gif');
  });

  it('does not render other components', () => {
    render(<LogInOut />);
    const loadingGif = screen.getByAltText('Loading...');
    expect(loadingGif).toBeInTheDocument();
    // Check that no other unexpected elements exist
    const otherElement = screen.queryByText('some text that should not be present');
    expect(otherElement).toBeNull();
  });

  it('does not have any text content other than the alt text for the image', () => {
    render(<LogInOut />);
    const loadingGif = screen.getByAltText('Loading...');
    expect(loadingGif.textContent).toBe('');
  });
});
