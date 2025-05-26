import React from "react";
import { validatePassword } from "../../../utils/passwordValidation";
import "./Auth.css";

interface PasswordRequirementsProps {
  password: string;
}

const PasswordRequirements: React.FC<PasswordRequirementsProps> = ({ password }) => {
  const validation = validatePassword(password);
  
  return (
    <div className="password-requirements" data-testid="password-requirements">
      <p className="requirements-title">Wachtwoord moet bevatten:</p>
      <ul>
        <li className={validation.hasMinLength ? "requirement-met" : "requirement-not-met"}>
          <span className="requirement-icon" style={{ color: validation.hasMinLength ? '#2e8b57' : '#e74c3c' }}>
            {validation.hasMinLength ? "✓" : "✗"}
          </span>
          <span>Minimaal 8 tekens</span>
        </li>
        <li className={validation.hasUpperCase ? "requirement-met" : "requirement-not-met"}>
          <span className="requirement-icon" style={{ color: validation.hasUpperCase ? '#2e8b57' : '#e74c3c' }}>
            {validation.hasUpperCase ? "✓" : "✗"}
          </span>
          <span>Ten minste één hoofdletter (A-Z)</span>
        </li>
        <li className={validation.hasLowerCase ? "requirement-met" : "requirement-not-met"}>
          <span className="requirement-icon" style={{ color: validation.hasLowerCase ? '#2e8b57' : '#e74c3c' }}>
            {validation.hasLowerCase ? "✓" : "✗"}
          </span>
          <span>Ten minste één kleine letter (a-z)</span>
        </li>
        <li className={validation.hasNumber ? "requirement-met" : "requirement-not-met"}>
          <span className="requirement-icon" style={{ color: validation.hasNumber ? '#2e8b57' : '#e74c3c' }}>
            {validation.hasNumber ? "✓" : "✗"}
          </span>
          <span>Ten minste één cijfer (0-9)</span>
        </li>
        <li className={validation.hasSpecialChar ? "requirement-met" : "requirement-not-met"}>
          <span className="requirement-icon" style={{ color: validation.hasSpecialChar ? '#2e8b57' : '#e74c3c' }}>
            {validation.hasSpecialChar ? "✓" : "✗"}
          </span>
          <span>Ten minste één speciaal teken (!@#$%^&*)</span>
        </li>
      </ul>
    </div>
  );
};

export default PasswordRequirements;
