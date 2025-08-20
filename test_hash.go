package main

import (
	"fmt"
	"time"

	"goswift/internal/models"
	"goswift/pkg/jwt"

	"github.com/google/uuid"
)

func main() {
	// Create JWT manager
	jwtManager := jwt.NewJWTManager("test-secret-key", time.Hour*24)

	// Create test user
	user := &models.User{
		ID:          uuid.New(),
		Email:       "test@example.com",
		DisplayName: "Test User",
	}

	fmt.Println("Testing JWT Token Generation...")
	fmt.Println("=================================")

	// Generate token
	token, err := jwtManager.GenerateToken(user)
	if err != nil {
		fmt.Printf("❌ Error generating token: %v\n", err)
		return
	}

	fmt.Printf("✅ Token generated: %s\n", token[:50] + "...")

	// Validate token
	claims, err := jwtManager.ValidateToken(token)
	if err != nil {
		fmt.Printf("❌ Error validating token: %v\n", err)
		return
	}

	fmt.Printf("✅ Token validated successfully!\n")
	fmt.Printf("   User ID: %s\n", claims.UserID)
	fmt.Printf("   Email: %s\n", claims.Email)
	fmt.Printf("   Username: %s\n", claims.Username)
	fmt.Printf("   Expires At: %s\n", claims.ExpiresAt.Time.Format(time.RFC3339))

	// Test invalid token
	fmt.Println("\nTesting Invalid Token...")
	fmt.Println("========================")
	
	invalidToken := "invalid.token.here"
	_, err = jwtManager.ValidateToken(invalidToken)
	if err != nil {
		fmt.Printf("✅ Invalid token correctly rejected: %v\n", err)
	} else {
		fmt.Printf("❌ Invalid token should have been rejected\n")
	}
}