package utils

import (
	"regexp"
	"strings"
)

// Email validation regex
var emailRegex = regexp.MustCompile(`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`)

// ValidateEmail validates email format
func ValidateEmail(email string) error {
	email = strings.TrimSpace(email)

	if email == "" {
		return ErrEmailRequired
	}

	if !emailRegex.MatchString(email) {
		return ErrInvalidEmail
	}

	return nil
}

// ValidateDisplayName validates display name
func ValidateDisplayName(displayName string) error {
	displayName = strings.TrimSpace(displayName)

	if displayName == "" {
		return ErrDisplayNameRequired
	}

	if len(displayName) < 2 {
		return ErrDisplayNameTooShort
	}

	if len(displayName) > 100 {
		return ErrDisplayNameTooLong
	}

	// Check for valid characters (letters, numbers, spaces, hyphens, underscores)
	if !regexp.MustCompile(`^[a-zA-Z0-9\s\-_]+$`).MatchString(displayName) {
		return ErrDisplayNameInvalidChars
	}

	return nil
}

// ValidatePasswordStrength validates password strength
func ValidatePasswordStrength(password string) error {
	if len(password) < 6 {
		return ErrPasswordTooShort
	}

	// Check for at least one uppercase letter
	if !regexp.MustCompile(`[A-Z]`).MatchString(password) {
		return ErrPasswordNoUppercase
	}

	// Check for at least one lowercase letter
	if !regexp.MustCompile(`[a-z]`).MatchString(password) {
		return ErrPasswordNoLowercase
	}

	// Check for at least one number
	if !regexp.MustCompile(`[0-9]`).MatchString(password) {
		return ErrPasswordNoNumber
	}

	// Check for at least one special character
	if !regexp.MustCompile(`[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]`).MatchString(password) {
		return ErrPasswordNoSpecialChar
	}

	return nil
}

// ValidateUserInput validates all user input for registration
func ValidateUserInput(email, password, displayName string) error {
	// Validate email
	if err := ValidateEmail(email); err != nil {
		return err
	}

	// Validate password
	if err := ValidatePasswordStrength(password); err != nil {
		return err
	}

	// Validate display name
	if err := ValidateDisplayName(displayName); err != nil {
		return err
	}

	return nil
}

// SanitizeInput removes potentially dangerous characters
func SanitizeInput(input string) string {
	// Remove HTML tags
	htmlRegex := regexp.MustCompile(`<[^>]*>`)
	input = htmlRegex.ReplaceAllString(input, "")

	// Trim whitespace
	input = strings.TrimSpace(input)

	return input
}
