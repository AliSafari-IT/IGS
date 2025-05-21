import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, RegisterData } from '../../../infrastructure/auth/AuthContext';
import './Auth.css';

const Register: React.FC = () => {
  const [formData, setFormData] = useState<RegisterData>({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phoneNumber: ''
  });
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.email || !formData.password || !formData.firstName || !formData.lastName) {
      setError('Alle verplichte velden moeten worden ingevuld');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Wachtwoorden komen niet overeen');
      return;
    }
    
    if (!agreeTerms) {
      setError('U moet akkoord gaan met de algemene voorwaarden');
      return;
    }
    
    setError(null);
    setIsSubmitting(true);
    
    // Debug: Log form data (without sensitive info)
    console.log('Submitting registration with data:', {
      ...formData,
      password: '[REDACTED]',
      confirmPassword: '[REDACTED]'
    });
    
    try {
      console.log('Calling register function...');
      const success = await register(formData);
      console.log('Register function returned:', success);
      
      if (success) {
        console.log('Registration successful, navigating to home');
        // Use a single window.location.href to navigate without calling reload()
        // This prevents the authentication state from being reset
        setTimeout(() => {
          // Using just window.location.href is sufficient to navigate
          window.location.href = '/';
        }, 300);
      } else {
        console.log('Registration failed with success=false');
        setError('Registratie mislukt. Probeer het opnieuw.');
      }
    } catch (err: any) {
      // Display error message from API if available
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Er is een fout opgetreden tijdens het registreren. Probeer het opnieuw.');
      }
      console.error('Registration error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card register-card">
        <div className="auth-header">
          <h2>Mijn account</h2>
          <div className="auth-tabs">
            <Link to="/login" className="auth-tab">Inloggen</Link>
            <div className="auth-tab active">Registreren</div>
          </div>
        </div>
        
        <div className="auth-content">
          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">Voornaam*</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="lastName">Achternaam*</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="email">E-mailadres*</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
                disabled={isSubmitting}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="phoneNumber">Telefoonnummer</label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="+31 6 12345678"
                disabled={isSubmitting}
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="password">Wachtwoord*</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="confirmPassword">Bevestig wachtwoord*</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  required
                />
              </div>
            </div>
            
            <div className="password-requirements">
              <p>Wachtwoord moet bevatten:</p>
              <ul>
                <li className={formData.password.length >= 8 ? 'valid' : ''}>
                  Minimaal 8 tekens
                </li>
                <li className={/[A-Z]/.test(formData.password) ? 'valid' : ''}>
                  Minimaal 1 hoofdletter
                </li>
                <li className={/[0-9]/.test(formData.password) ? 'valid' : ''}>
                  Minimaal 1 cijfer
                </li>
                <li className={/[!@#$%^&*]/.test(formData.password) ? 'valid' : ''}>
                  Minimaal 1 speciaal teken (!@#$%^&*)
                </li>
              </ul>
            </div>
            
            <div className="form-group checkbox-group">
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  disabled={isSubmitting}
                  required
                />
                <span className="checkbox-label">
                  Ik ga akkoord met de <Link to="/terms">algemene voorwaarden</Link> en het <Link to="/privacy">privacybeleid</Link>
                </span>
              </label>
            </div>
            
            <button 
              type="submit" 
              className="auth-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Account aanmaken...' : 'Account aanmaken'}
            </button>
          </form>
          
          <div className="auth-divider">
            <span>of</span>
          </div>
          
          <div className="social-login">
            <button className="social-button google">
              <i className="fab fa-google"></i>
              Registreren met Google
            </button>
            <button className="social-button facebook">
              <i className="fab fa-facebook-f"></i>
              Registreren met Facebook
            </button>
          </div>
          
          <div className="auth-footer">
            <p>Al een account? <Link to="/login">Log hier in</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
