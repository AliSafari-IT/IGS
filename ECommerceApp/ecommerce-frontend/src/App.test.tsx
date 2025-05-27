import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  describe('Navbar', () => {
    it('renders logo with correct attributes', () => {
      render(<App />);
      const logo = screen.getByAltText('IGS-Pharma Logo');
      expect(logo).toBeInTheDocument();
      expect(logo).toHaveAttribute('src', '/images/logo.webp');
    });

    it('contains all main navigation links', () => {
      render(<App />);
      
      const navLinks = [
        { name: /home/i, href: '/' },
        { name: /categories/i, href: '/categories' },
        { name: /medications/i, href: '/medications' },
        { name: /prescriptions/i, href: '/prescriptions' },
        { name: /health advice/i, href: '/health-advice' },
        { name: /about/i, href: '/about-us' },
        { name: /contact/i, href: '/contact-us' }
      ];

      // Get all navigation links from the main-nav section
      const mainNav = document.querySelector('.main-nav');
      expect(mainNav).toBeInTheDocument();
      
      navLinks.forEach(link => {
        // Find links within the main navigation area
        const navElement = mainNav?.querySelector(`a[href="${link.href}"]`);
        expect(navElement).toBeInTheDocument();
        expect(navElement).toHaveAttribute('href', link.href);
        expect(navElement).toHaveAttribute('data-discover', 'true');
      });
    });

    it('displays header action buttons', () => {
      render(<App />);
      
      // Check for buttons by class name instead of role and name
      expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
      expect(document.querySelector('.cart-button')).toBeInTheDocument();
      expect(screen.getByTitle('View Changelog')).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /login/i })).toHaveAttribute('href', '/login');
    });
  });
  it("renders the App component", () => {
    render(<App />);
    expect(screen.getByText(/Medical Supplies/)).toBeInTheDocument();
  });
});
describe("Navbar", () => {
  it("renders the logo image", () => {
    render(<App />);
    const logo = screen.getByAltText("IGS-Pharma Logo");
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute("src", "/images/logo.webp");
  });
});

describe("logos", () => {
  it("should render a IGS logo", () => {
    render(<App />);
    const img = screen.getByAltText("IGS-Pharma Logo");
    expect(img).toBeInTheDocument();
  });

  it("should render a IGS link", () => {
    const { container } = render(<App />);
    const viteLogo = container.querySelector("a[href='/categories']");
    expect(viteLogo).toBeInTheDocument();
  });
});


