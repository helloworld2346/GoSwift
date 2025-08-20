package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"

	"goswift/internal/database"
	"goswift/internal/models"
	"goswift/internal/router"
	"goswift/pkg/utils"

)

func main() {
	fmt.Println("Testing Auth Endpoints...")
	fmt.Println("=========================")

	// Load config
	config := utils.LoadConfig()

	// Connect to database
	db, err := database.NewConnection(config)
	if err != nil {
		fmt.Printf("❌ Database connection failed: %v\n", err)
		return
	}
	defer db.Close()

	// Setup router
	r := router.SetupRouter(config, db)

	// Test 1: Register endpoint
	fmt.Println("\nTest 1: Register endpoint")
	registerData := models.CreateUserRequest{
		Email:       "test@example.com",
		Password:    "TestPassword123!",
		DisplayName: "Test User",
	}
	
	jsonData, _ := json.Marshal(registerData)
	req, _ := http.NewRequest("POST", "/api/v1/auth/register", bytes.NewBuffer(jsonData))
	req.Header.Set("Content-Type", "application/json")
	
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)
	
	fmt.Printf("Status: %d\n", w.Code)
	fmt.Printf("Response: %s\n", w.Body.String())

	// Test 2: Login endpoint
	fmt.Println("\nTest 2: Login endpoint")
	loginData := models.LoginRequest{
		Email:    "test@example.com",
		Password: "TestPassword123!",
	}
	
	jsonData, _ = json.Marshal(loginData)
	req, _ = http.NewRequest("POST", "/api/v1/auth/login", bytes.NewBuffer(jsonData))
	req.Header.Set("Content-Type", "application/json")
	
	w = httptest.NewRecorder()
	r.ServeHTTP(w, req)
	
	fmt.Printf("Status: %d\n", w.Code)
	fmt.Printf("Response: %s\n", w.Body.String())

	// Test 3: Protected endpoint without token
	fmt.Println("\nTest 3: Protected endpoint without token")
	req, _ = http.NewRequest("GET", "/api/v1/auth/profile", nil)
	
	w = httptest.NewRecorder()
	r.ServeHTTP(w, req)
	
	fmt.Printf("Status: %d\n", w.Code)
	fmt.Printf("Response: %s\n", w.Body.String())
}