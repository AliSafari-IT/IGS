import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../infrastructure/auth/AuthContext';
import './Auth.css';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { forgotPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    
    setError(null);
    setIsSubmitting(true);
    
    try {
      // Call the forgotPassword API endpoint
      const result = await forgotPassword(email);
      
      // Always show success for security reasons
      setSuccess(true);
    } catch (err: any) {
      // For security reasons, we still show success even if there's an error
      // This prevents email enumeration attacks
      setSuccess(true);
      
      // But we log the error for debugging
      console.error('Password reset error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Wachtwoord vergeten</h2>
        </div>
        
        <div className="auth-content">
          {success ? (
            <div className="success-message">
              <h3>Controleer uw e-mail</h3>
              <p>We hebben een e-mail gestuurd naar <strong>{email}</strong> met instructies om uw wachtwoord opnieuw in te stellen.</p>
              <p>Als u de e-mail niet binnen enkele minuten ontvangt, controleer dan uw spam-map of probeer het opnieuw.</p>
              <div className="auth-footer">
                <Link to="/login" className="auth-button">Terug naar inloggen</Link>
              </div>
            </div>
          ) : (
            <>
              {error && (
                <div className="auth-error">
                  {error}
                </div>
              )}
              
              <p className="auth-description">
                Voer uw e-mailadres in en we sturen u een link om uw wachtwoord opnieuw in te stellen.
              </p>
              
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
                
                <button 
                  type="submit" 
                  className="auth-button"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Bezig met verzenden...' : 'Verstuur reset link'}
                </button>
              </form>
              
              <div className="auth-footer">
                <p>Herinnert u zich uw wachtwoord? <Link to="/login">Log hier in</Link></p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
