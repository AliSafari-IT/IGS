import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../infrastructure/auth/AuthContext';
import './Auth.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the redirect path from sessionStorage or default to home
  const [redirectPath, setRedirectPath] = useState('/');
  
  // Check for redirect path on component mount
  useEffect(() => {
    const storedPath = sessionStorage.getItem('redirectPath');
    if (storedPath) {
      setRedirectPath(storedPath);
      // Clear it after retrieving
      sessionStorage.removeItem('redirectPath');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    setError(null);
    setIsSubmitting(true);
    
    try {
      // Pass rememberMe parameter to login function
      const success = await login(email, password, rememberMe);
      
      if (success) {
        console.log('Login successful, redirecting to:', redirectPath || '/');
        // Use a single window.location.href to navigate without calling reload()
        // This prevents the authentication state from being reset
        setTimeout(() => {
          // Using just window.location.href is sufficient to navigate
          // and will maintain the authentication state
          window.location.href = redirectPath || '/';
        }, 300);
      } else {
        setError('Invalid email or password');
      }
    } catch (err: any) {
      // Display error message from API if available
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('An error occurred during login. Please try again.');
      }
      console.error('Login error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check for remembered email on component mount
  React.useEffect(() => {
    const rememberedEmail = localStorage.getItem('igs_remembered_email');
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Mijn account</h2>
          <div className="auth-tabs">
            <div className="auth-tab active">Inloggen</div>
            <Link to="/register" className="auth-tab">Registreren</Link>
          </div>
        </div>
        
        <div className="auth-content">
          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">E-mailadres</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                disabled={isSubmitting}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Wachtwoord</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
                required
              />
            </div>
            
            <div className="form-group checkbox-group">
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={isSubmitting}
                />
                <span className="checkbox-label">Onthoud mij</span>
              </label>
              <Link to="/forgot-password" className="forgot-password">
                Wachtwoord vergeten?
              </Link>
            </div>
            
            <button 
              type="submit" 
              className="auth-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Inloggen...' : 'Inloggen'}
            </button>
          </form>
          
          <div className="auth-divider">
            <span>of</span>
          </div>
          
          <div className="social-login">
            <button className="social-button google">
              <i className="fab fa-google"></i>
              Inloggen met Google
            </button>
            <button className="social-button facebook">
              <i className="fab fa-facebook-f"></i>
              Inloggen met Facebook
            </button>
          </div>
          
          <div className="auth-footer">
            <p>Nog geen account? <Link to="/register">Registreer nu</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
