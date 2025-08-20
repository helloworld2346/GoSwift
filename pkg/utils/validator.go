package utils

import (
	"regexp"
	"strings"

	"github.com/google/uuid"
)

// ValidateEmail validates email format
func ValidateEmail(email string) error {
	if email == "" {
		return ErrEmailRequired
	}

	// Simple email regex
	emailRegex := regexp.MustCompile(`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`)
	if !emailRegex.MatchString(email) {
		return ErrInvalidEmail
	}

	return nil
}

// ValidateDisplayName validates display name
func ValidateDisplayName(displayName string) error {
	if displayName == "" {
		return ErrDisplayNameRequired
	}

	if len(displayName) < 2 {
		return ErrDisplayNameTooShort
	}

	if len(displayName) > 100 {
		return ErrDisplayNameTooLong
	}

	// Check for invalid characters
	invalidCharsRegex := regexp.MustCompile(`[<>\"'&]`)
	if invalidCharsRegex.MatchString(displayName) {
		return ErrDisplayNameInvalidChars
	}

	return nil
}

// ValidatePasswordStrength validates password strength
func ValidatePasswordStrength(password string) error {
	if len(password) < 6 {
		return ErrPasswordTooShort
	}

	// Check for uppercase letter
	if !regexp.MustCompile(`[A-Z]`).MatchString(password) {
		return ErrPasswordNoUppercase
	}

	// Check for lowercase letter
	if !regexp.MustCompile(`[a-z]`).MatchString(password) {
		return ErrPasswordNoLowercase
	}

	// Check for number
	if !regexp.MustCompile(`[0-9]`).MatchString(password) {
		return ErrPasswordNoNumber
	}

	// Check for special character
	if !regexp.MustCompile(`[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]`).MatchString(password) {
		return ErrPasswordNoSpecialChar
	}

	return nil
}

// ValidateUserInput validates all user input fields
func ValidateUserInput(email, password, displayName string) error {
	if err := ValidateEmail(email); err != nil {
		return err
	}

	if err := ValidatePasswordStrength(password); err != nil {
		return err
	}

	if err := ValidateDisplayName(displayName); err != nil {
		return err
	}

	return nil
}

// ValidateUUID validates if a string is a valid UUID
func ValidateUUID(id string) error {
	if id == "" {
		return ErrInvalidUUID
	}

	// Parse UUID to check if it's valid
	_, err := uuid.Parse(id)
	if err != nil {
		return ErrInvalidUUID
	}

	return nil
}

// ValidateUUIDFromString validates UUID from string and returns parsed UUID
func ValidateUUIDFromString(id string) (uuid.UUID, error) {
	if err := ValidateUUID(id); err != nil {
		return uuid.Nil, err
	}

	parsedUUID, err := uuid.Parse(id)
	if err != nil {
		return uuid.Nil, ErrInvalidUUID
	}

	return parsedUUID, nil
}

// SanitizeInput sanitizes user input
func SanitizeInput(input string) string {
	// Remove leading and trailing whitespace
	input = strings.TrimSpace(input)

	// Convert to lowercase for email
	return input
}
