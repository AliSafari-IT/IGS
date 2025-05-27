import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../infrastructure/auth/AuthContext";
import { logger } from "../../../utils/logger";
import { isAxiosError } from "axios";
import { validatePassword, getPasswordValidationMessage } from "../../../utils/passwordValidation";
import PasswordRequirements from "./PasswordRequirements";
import "./Auth.css";

const ResetPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { resetPassword } = useAuth();

  useEffect(() => {
    logger.info("ResetPassword component mounted");
    
    // Extract token and email from URL query parameters
    const queryParams = new URLSearchParams(location.search);
    const tokenParam = queryParams.get("token");
    const emailParam = queryParams.get("email");

    if (tokenParam) {
      setToken(tokenParam);
    } else {
      setError("Geen reset token gevonden in de URL. Vraag een nieuwe wachtwoord reset link aan.");
    }
    
    if (emailParam) {
      setEmail(emailParam);
    } else {
      setError("Geen e-mailadres gevonden in de URL. Vraag een nieuwe wachtwoord reset link aan.");
    }
  }, [location]);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setShowPasswordRequirements(true);
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    logger.info("Reset password form submitted");

    if (!email || !token) {
      setError("Ongeldige reset link. Vraag een nieuwe wachtwoord reset link aan.");
      return;
    }

    if (!password || !confirmPassword) {
      setError("Wachtwoord en bevestiging zijn verplicht");
      return;
    }

    if (password !== confirmPassword) {
      setError("Wachtwoorden komen niet overeen");
      return;
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      setError(getPasswordValidationMessage(passwordValidation));
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      logger.info(`Resetting password for email: ${email}`);
      const success = await resetPassword(token, email, password, confirmPassword);
      
      if (success) {
        logger.info("Password reset successful");
        
        // Show success message
        setSuccess(true);
        
        // Clear the form
        setPassword("");
        setConfirmPassword("");
        
        // Redirect to login page after 3 seconds
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        setError("Er is een fout opgetreden bij het resetten van uw wachtwoord. Controleer uw gegevens en probeer het opnieuw.");
      }
    } catch (err: unknown) {
      logger.error("Password reset error:", err);
      
      if (isAxiosError(err) && err.response) {
        const { status, data } = err.response;
        logger.error(`API Error: ${status} - ${JSON.stringify(data)}`);
        
        if (status === 400) {
          setError(data?.message || "Ongeldige reset token of e-mailadres.");
        } else if (status === 401) {
          setError("De reset link is verlopen. Vraag een nieuwe wachtwoord reset link aan.");
        } else {
          setError("Er is een fout opgetreden bij het resetten van uw wachtwoord. Probeer het later opnieuw.");
        }
      } else {
        setError("Er is een onverwachte fout opgetreden. Probeer het later opnieuw.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Wachtwoord opnieuw instellen</h2>
        </div>

        <div className="auth-content">
          {success ? (
            <div className="success-message" data-testid="success-message">
              <h3>Wachtwoord succesvol gewijzigd</h3>
              <p>
                Uw wachtwoord is succesvol gewijzigd. U wordt doorgestuurd naar de inlogpagina.
              </p>
              <div className="auth-footer">
                <button
                  onClick={() => navigate("/login")}
                  className="auth-button"
                  data-testid="back-to-login-button"
                >
                  Ga naar inloggen
                </button>
              </div>
            </div>
          ) : (
            <>
              {error && (
                <div className="auth-error" data-testid="error-message">
                  {error}
                </div>
              )}

              <p className="auth-description">
                Voer uw nieuwe wachtwoord in om uw account te beveiligen.
              </p>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="email">E-mailadres</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={true}
                    data-testid="email-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password">Nieuw wachtwoord</label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={handlePasswordChange}
                    onFocus={() => setShowPasswordRequirements(true)}
                    disabled={isSubmitting}
                    required
                    data-testid="password-input"
                  />
                </div>

                {showPasswordRequirements && (
                  <PasswordRequirements password={password} />
                )}

                <div className="form-group">
                  <label htmlFor="confirm-password">Bevestig nieuw wachtwoord</label>
                  <input
                    type="password"
                    id="confirm-password"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    disabled={isSubmitting}
                    required
                    data-testid="confirm-password-input"
                  />
                </div>

                <button
                  type="submit"
                  className="auth-button"
                  disabled={isSubmitting}
                  data-testid="reset-password-button"
                >
                  {isSubmitting
                    ? "Bezig met wijzigen..."
                    : "Wachtwoord wijzigen"}
                </button>
              </form>

              <div className="auth-footer">
                <p>
                  Terug naar{" "}
                  <Link
                    to="/login"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate("/login");
                    }}
                    data-testid="login-link"
                  >
                    inloggen
                  </Link>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
