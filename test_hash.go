package main

import (
	"fmt"
	"goswift/pkg/utils"
)

func main() {
	fmt.Println("Testing Input Validation...")
	fmt.Println("===========================")
	
	// Test cases
	testCases := []struct {
		email       string
		password    string
		displayName string
		description string
	}{
		{
			email:       "test@example.com",
			password:    "GoodPassword123!",
			displayName: "John Doe",
			description: "Valid input",
		},
		{
			email:       "invalid-email",
			password:    "GoodPassword123!",
			displayName: "John Doe",
			description: "Invalid email",
		},
		{
			email:       "test@example.com",
			password:    "weak",
			displayName: "John Doe",
			description: "Weak password",
		},
		{
			email:       "test@example.com",
			password:    "GoodPassword123!",
			displayName: "J",
			description: "Display name too short",
		},
		{
			email:       "test@example.com",
			password:    "GoodPassword123!",
			displayName: "John<script>alert('xss')</script>",
			description: "Display name with HTML",
		},
	}
	
	for i, testCase := range testCases {
		fmt.Printf("\nTest %d: %s\n", i+1, testCase.description)
		fmt.Printf("Email: %s\n", testCase.email)
		fmt.Printf("Password: %s\n", testCase.password)
		fmt.Printf("Display Name: %s\n", testCase.displayName)
		
		err := utils.ValidateUserInput(testCase.email, testCase.password, testCase.displayName)
		if err != nil {
			fmt.Printf("❌ Error: %v\n", err)
		} else {
			fmt.Printf("✅ Valid input\n")
		}
	}
	
	// Test sanitization
	fmt.Println("\nTesting Input Sanitization...")
	fmt.Println("=============================")
	
	dirtyInput := "  <script>alert('xss')</script>John Doe  "
	cleanInput := utils.SanitizeInput(dirtyInput)
	fmt.Printf("Dirty input: '%s'\n", dirtyInput)
	fmt.Printf("Clean input: '%s'\n", cleanInput)
}