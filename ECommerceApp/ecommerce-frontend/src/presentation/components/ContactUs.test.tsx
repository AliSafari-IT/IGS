import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ContactUs from './ContactUs';
import { sendContactMessage } from './api';
import { BrowserRouter } from 'react-router-dom';

// Mock the API module
jest.mock('./api', () => ({
  sendContactMessage: jest.fn(),
}));

// Wrap component in BrowserRouter for any potential Link components
const renderWithRouter = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('ContactUs Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    renderWithRouter(<ContactUs />);
  });

  it('renders the page title and tagline', () => {
    expect(screen.getByText('Contact Us')).toBeInTheDocument();
    expect(screen.getByText("We're here to help with all your health and wellness needs")).toBeInTheDocument();
  });

  it('displays contact information sections', () => {
    // Check address section
    expect(screen.getByText('Address')).toBeInTheDocument();
    expect(screen.getByText('IGS PHARMA (Pharmacie Laaroussi)')).toBeInTheDocument();
    expect(screen.getByText('Rue de Bosnie 104')).toBeInTheDocument();
    expect(screen.getByText('1060 Sint-Gillis')).toBeInTheDocument();
    expect(screen.getByText('Belgium')).toBeInTheDocument();

    // Check hours section
    expect(screen.getByText('Hours')).toBeInTheDocument();
    expect(screen.getByText('Monday–Friday:')).toBeInTheDocument();
    expect(screen.getByText('9:00AM–12:30PM — 2:00PM – 7:00PM')).toBeInTheDocument();
    expect(screen.getByText('Saturday:')).toBeInTheDocument();
    expect(screen.getByText('9:00AM–12:30PM')).toBeInTheDocument();
    expect(screen.getByText('Sunday:')).toBeInTheDocument();
    expect(screen.getByText('Closed')).toBeInTheDocument();

    // Check contact methods
    expect(screen.getByText('Get in Touch')).toBeInTheDocument();
    expect(screen.getByText('Phone & WhatsApp:')).toBeInTheDocument();
    expect(screen.getByText('+32 2 537 27 40')).toBeInTheDocument();
    expect(screen.getByText('Email:')).toBeInTheDocument();
    expect(screen.getByText('contact@igs-pharma.com')).toBeInTheDocument();
    expect(screen.getByText('Website:')).toBeInTheDocument();
    
    // Check for the website link
    const websiteLink = screen.getByText('igs-pharma.com');
    expect(websiteLink).toBeInTheDocument();
    expect(websiteLink.closest('a')).toHaveAttribute('href', 'https://igs-pharma.com');
    expect(websiteLink.closest('a')).toHaveAttribute('target', '_blank');
    expect(websiteLink.closest('a')).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders the contact form with all fields', () => {
    expect(screen.getByText('Send Us a Message')).toBeInTheDocument();
    
    // Check for form fields
    expect(screen.getByLabelText('Your Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
    expect(screen.getByLabelText('Subject')).toBeInTheDocument();
    expect(screen.getByLabelText('Your Message')).toBeInTheDocument();
    expect(screen.getByLabelText(/I agree to the processing of my personal data/)).toBeInTheDocument();
    
    // Check for submit button
    expect(screen.getByRole('button', { name: 'Send Message' })).toBeInTheDocument();
  });

  it('renders the map section', () => {
    expect(screen.getByText('Find Us')).toBeInTheDocument();
    const mapIframe = screen.getByTitle('IGS Pharma Location');
    expect(mapIframe).toBeInTheDocument();
    expect(mapIframe).toHaveAttribute('src', 'https://www.google.com/maps?q=Rue+de+Bosnie+104,+1060+Sint-Gillis,+Belgium&output=embed');
  });

  it('validates form inputs', async () => {
    const submitButton = screen.getByRole('button', { name: 'Send Message' });
    
    // Try to submit the empty form
    fireEvent.click(submitButton);
    
    // Form should not be submitted due to HTML5 validation
    expect(sendContactMessage).not.toHaveBeenCalled();
  });

  it('submits the form with valid data', async () => {
    // Mock successful API response
    (sendContactMessage as jest.Mock).mockResolvedValueOnce({});
    
    // Fill out the form
    await userEvent.type(screen.getByLabelText('Your Name'), 'Test User');
    await userEvent.type(screen.getByLabelText('Email Address'), 'test@example.com');
    
    // Select an option from the dropdown
    await userEvent.selectOptions(
      screen.getByLabelText('Subject'),
      'General Inquiry'
    );
    
    await userEvent.type(screen.getByLabelText('Your Message'), 'This is a test message');
    
    // Check the privacy policy checkbox
    const checkbox = screen.getByLabelText(/I agree to the processing of my personal data/);
    await userEvent.click(checkbox);
    
    // Submit the form
    const submitButton = screen.getByRole('button', { name: 'Send Message' });
    fireEvent.click(submitButton);
    
    // Use waitFor to properly handle the async state updates
    await waitFor(() => {
      // Check if API was called with correct data
      expect(sendContactMessage).toHaveBeenCalledWith({
        name: 'Test User',
        email: 'test@example.com',
        subject: 'General Inquiry',
        message: 'This is a test message'
      });
    });
    
    // Check for success message
    await waitFor(() => {
      expect(screen.getByText('Thank you for your message!')).toBeInTheDocument();
      expect(screen.getByText("We'll get back to you as soon as possible.")).toBeInTheDocument();
    });
  });

  it('shows error message when form submission fails', async () => {
    // Mock failed API response
    const errorMessage = 'Server error';
    (sendContactMessage as jest.Mock).mockRejectedValueOnce({
      response: { data: { message: errorMessage } }
    });
    
    // Fill out the form
    await userEvent.type(screen.getByLabelText('Your Name'), 'Test User');
    await userEvent.type(screen.getByLabelText('Email Address'), 'test@example.com');
    await userEvent.selectOptions(screen.getByLabelText('Subject'), 'General Inquiry');
    await userEvent.type(screen.getByLabelText('Your Message'), 'This is a test message');
    
    // Check the privacy policy checkbox
    const checkbox = screen.getByLabelText(/I agree to the processing of my personal data/);
    await userEvent.click(checkbox);
    
    // Submit the form using fireEvent instead of userEvent for better control
    const submitButton = screen.getByRole('button', { name: 'Send Message' });
    fireEvent.click(submitButton);
    
    // Check for error message with waitFor to handle async updates
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('renders all required images with correct alt text', () => {
    expect(screen.getByAltText('Phone')).toBeInTheDocument();
    expect(screen.getByAltText('WhatsApp')).toBeInTheDocument();
    expect(screen.getByAltText('Email')).toBeInTheDocument();
    expect(screen.getByAltText('Website')).toBeInTheDocument();
  });

  it('changes button text to "Sending..." during form submission', async () => {
    // Mock a delayed API response to test loading state
    (sendContactMessage as jest.Mock).mockImplementationOnce(() => {
      return new Promise(resolve => setTimeout(resolve, 100));
    });
    
    // Fill out the form
    await userEvent.type(screen.getByLabelText('Your Name'), 'Test User');
    await userEvent.type(screen.getByLabelText('Email Address'), 'test@example.com');
    await userEvent.selectOptions(screen.getByLabelText('Subject'), 'General Inquiry');
    await userEvent.type(screen.getByLabelText('Your Message'), 'This is a test message');
    
    // Check the privacy policy checkbox
    const checkbox = screen.getByLabelText(/I agree to the processing of my personal data/);
    await userEvent.click(checkbox);
    
    // Submit the form using fireEvent instead of userEvent
    const submitButton = screen.getByRole('button', { name: 'Send Message' });
    fireEvent.click(submitButton);
    
    // Use waitFor to properly handle the async state updates
    await waitFor(() => {
      // Check if button text changes to "Sending..."
      expect(screen.getByRole('button', { name: 'Sending...' })).toBeInTheDocument();
    });
  });
});