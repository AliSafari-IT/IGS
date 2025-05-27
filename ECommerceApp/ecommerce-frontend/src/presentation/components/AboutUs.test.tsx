import React from 'react';
import { render, screen } from '@testing-library/react';
import AboutUs from './AboutUs';
import { BrowserRouter } from 'react-router-dom';

// Wrap component in BrowserRouter for any potential Link components
const renderWithRouter = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('AboutUs Component', () => {
  beforeEach(() => {
    renderWithRouter(<AboutUs />);
  });

  it('renders the page title and tagline', () => {
    expect(screen.getByText('About IGS Pharma')).toBeInTheDocument();
    expect(screen.getByText('Your trusted partner in health and wellness since 2010')).toBeInTheDocument();
  });

  it('displays the mission section', () => {
    expect(screen.getByText('Our Mission')).toBeInTheDocument();
    expect(screen.getByText(/At IGS Pharma, our mission is to provide personalized pharmaceutical care/)).toBeInTheDocument();
  });

  it('displays the team section with all team members', () => {
    expect(screen.getByText('Meet Our Team')).toBeInTheDocument();
    
    // Check for team members
    const teamMembers = [
      { name: 'Dr. Ikram Laarussi', role: 'Head Pharmacist' },
      { name: 'Mr. Mohammed Djavad Salehi', role: 'Chief Executive Officer' },
      { name: 'PhD. Ali Safari', role: 'Chief Technology Officer' }
    ];
    
    teamMembers.forEach(member => {
      expect(screen.getByText(member.name)).toBeInTheDocument();
      expect(screen.getByText(member.role)).toBeInTheDocument();
    });
  });

  it('displays the services section with all services', () => {
    expect(screen.getByText('Our Services')).toBeInTheDocument();
    
    // Check for services
    const services = [
      'Prescription Filling',
      'Medication Reviews',
      'Vaccinations',
      'Health Consultations'
    ];
    
    services.forEach(service => {
      expect(screen.getByText(service)).toBeInTheDocument();
    });
  });

  it('displays the values section with all core values', () => {
    expect(screen.getByText('Our Values')).toBeInTheDocument();
    
    // Check for values
    const values = ['Excellence', 'Integrity', 'Compassion', 'Innovation'];
    
    values.forEach(value => {
      expect(screen.getByText(value)).toBeInTheDocument();
    });
  });

  it('displays the contact information section', () => {
    expect(screen.getByText('Visit Us')).toBeInTheDocument();
    expect(screen.getByText('Address')).toBeInTheDocument();
    expect(screen.getByText('Rue de Bosnie 104')).toBeInTheDocument();
    expect(screen.getByText('1060 Sint-Gillis')).toBeInTheDocument();
    expect(screen.getByText('Belgium')).toBeInTheDocument();
  });

  it('displays contact methods correctly', () => {
    expect(screen.getByText(/Phone & WhatsApp:/)).toBeInTheDocument();
    expect(screen.getByText(/Email:/)).toBeInTheDocument();
    expect(screen.getByText(/Website:/)).toBeInTheDocument();
    
    // Check for the website link
    const websiteLink = screen.getByText('igs-pharma.com');
    expect(websiteLink).toBeInTheDocument();
    expect(websiteLink.closest('a')).toHaveAttribute('href', 'https://igs-pharma.com');
    expect(websiteLink.closest('a')).toHaveAttribute('target', '_blank');
    expect(websiteLink.closest('a')).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('displays opening hours correctly', () => {
    expect(screen.getByText('Opening Hours')).toBeInTheDocument();
    expect(screen.getByText('Monday - Friday:')).toBeInTheDocument();
    expect(screen.getByText('8:30 AM - 7:00 PM')).toBeInTheDocument();
    expect(screen.getByText('Saturday:')).toBeInTheDocument();
    expect(screen.getByText('9:00 AM - 5:00 PM')).toBeInTheDocument();
    expect(screen.getByText('Sunday:')).toBeInTheDocument();
    expect(screen.getByText('Closed')).toBeInTheDocument();
  });

  it('renders all required images with correct alt text', () => {
    expect(screen.getByAltText('Address')).toBeInTheDocument();
    expect(screen.getByAltText('Phone')).toBeInTheDocument();
    expect(screen.getByAltText('WhatsApp')).toBeInTheDocument();
    expect(screen.getByAltText('Email')).toBeInTheDocument();
    expect(screen.getByAltText('Website')).toBeInTheDocument();
  });
});