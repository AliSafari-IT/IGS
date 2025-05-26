export interface PasswordValidationResult {
  isValid: boolean;
  hasMinLength: boolean;
  hasUpperCase: boolean;
  hasLowerCase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
}

export const validatePassword = (password: string): PasswordValidationResult => {
  const minLength = 8;
  
  return {
    isValid:
      password.length >= minLength &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /[0-9]/.test(password) &&
      /[^A-Za-z0-9]/.test(password),
    hasMinLength: password.length >= minLength,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[^A-Za-z0-9]/.test(password),
  };
};

export const getPasswordValidationMessage = (
  validation: PasswordValidationResult
): string => {
  if (validation.isValid) return "";

  const issues: string[] = [];

  if (!validation.hasMinLength) {
    issues.push("minimaal 8 tekens");
  }
  if (!validation.hasUpperCase) {
    issues.push("een hoofdletter");
  }
  if (!validation.hasLowerCase) {
    issues.push("een kleine letter");
  }
  if (!validation.hasNumber) {
    issues.push("een cijfer");
  }
  if (!validation.hasSpecialChar) {
    issues.push("een speciaal teken");
  }

  return `Wachtwoord moet bevatten: ${issues.join(", ")}.`;
};
