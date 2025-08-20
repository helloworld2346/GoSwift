package utils

import "errors"

// Common errors
var (
	// Password errors
	ErrPasswordTooShort      = errors.New("password must be at least 6 characters long")
	ErrPasswordNoUppercase   = errors.New("password must contain at least one uppercase letter")
	ErrPasswordNoLowercase   = errors.New("password must contain at least one lowercase letter")
	ErrPasswordNoNumber      = errors.New("password must contain at least one number")
	ErrPasswordNoSpecialChar = errors.New("password must contain at least one special character")

	// Email errors
	ErrEmailRequired = errors.New("email is required")
	ErrInvalidEmail  = errors.New("invalid email format")

	// Display name errors
	ErrDisplayNameRequired     = errors.New("display name is required")
	ErrDisplayNameTooShort     = errors.New("display name must be at least 2 characters long")
	ErrDisplayNameTooLong      = errors.New("display name must be less than 100 characters")
	ErrDisplayNameInvalidChars = errors.New("display name contains invalid characters")

	// User errors
	ErrUserNotFound       = errors.New("user not found")
	ErrEmailExists        = errors.New("email already exists")
	ErrInvalidCredentials = errors.New("invalid email or password")
)
