import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../infrastructure/auth/AuthContext";
import { logger } from "../../../utils/logger";
import { isAxiosError } from "axios";
import "./Auth.css";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const { forgotPassword } = useAuth();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    logger.info("Forgot password form submitted");

    if (!email) {
      setError("Vul alstublieft uw e-mailadres in");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      logger.info(`Requesting password reset for email: ${email}`);
      await forgotPassword(email);
      logger.info("Password reset request successful");

      // Show success message
      setSuccess(true);
    } catch (err: unknown) {
      logger.error("Password reset error:", err);

      // For security reasons, we still show success even if there's an error
      // This prevents email enumeration attacks
      setSuccess(true);

      // Log the actual error for debugging
      if (isAxiosError(err) && err.response) {
        logger.error(
          `API Error: ${err.response.status} - ${JSON.stringify(
            err.response.data
          )}`
        );
      }
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
            <div className="success-message" data-testid="success-message">
              <h3>Controleer uw e-mail</h3>
              <p>
                We hebben een e-mail gestuurd naar <strong>{email}</strong> met
                instructies om uw wachtwoord opnieuw in te stellen.
              </p>
              <p>
                Als u de e-mail niet binnen enkele minuten ontvangt, controleer
                dan uw spam-map of probeer het opnieuw.
              </p>
              <div className="auth-footer">
                <button
                  onClick={() => {
                    setSuccess(false);
                    setEmail("");
                    setError(null);
                    navigate("/login");
                  }}
                  className="auth-button"
                  data-testid="back-to-login-button"
                >
                  Terug naar inloggen
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
                Voer uw e-mailadres in en we sturen u een link om uw wachtwoord
                opnieuw in te stellen.
              </p>

              <form onSubmit={handleSubmit} role="form">
                <div className="form-group">
                  <label htmlFor="email">E-mailadres</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={handleEmailChange}
                    placeholder="name@example.com"
                    disabled={isSubmitting}
                    required
                    data-testid="email-input"
                  />
                </div>

                <button
                  type="submit"
                  className="auth-button"
                  disabled={isSubmitting}
                  data-testid="submit-button"
                >
                  {isSubmitting
                    ? "Bezig met verzenden..."
                    : "Verstuur reset link"}
                </button>
              </form>

              <div className="auth-footer">
                <p>
                  Herinnert u zich uw wachtwoord?{" "}
                  <Link
                    to="/login"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate("/login");
                    }}
                    data-testid="login-link"
                  >
                    Log hier in
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

export default ForgotPassword;
