package main

import (
	"log"
	"net/http"

	"goswift/internal/database"
	"goswift/pkg/utils"

	"github.com/gin-gonic/gin"
)

func main() {
	// Load configuration
	config := utils.LoadConfig()

	// Set Gin mode
	if config.Env == "production" {
		gin.SetMode(gin.ReleaseMode)
	}

	// Connect to database
	db, err := database.NewConnection(config)
	if err != nil {
		log.Fatal("❌ Failed to connect to database:", err)
	}
	defer db.Close()

	// Tạo Gin router
	r := gin.Default()

	// Health check endpoint
	r.GET("/health", func(c *gin.Context) {
		// Check database health
		dbStatus := "ok"
		if err := db.HealthCheck(); err != nil {
			dbStatus = "error"
		}

		c.JSON(http.StatusOK, gin.H{
			"status":   "ok",
			"message":  "GoSwift server is running!",
			"version":  "1.0.0",
			"env":      config.Env,
			"database": dbStatus,
		})
	})

	// API routes group
	api := r.Group("/api/v1")
	{
		api.GET("/ping", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{
				"message": "pong",
			})
		})
	}

	// Start server
	addr := ":" + config.ServerPort
	log.Printf("🚀 Starting GoSwift server on %s", addr)
	log.Printf("🌍 Environment: %s", config.Env)

	if err := r.Run(addr); err != nil {
		log.Fatal("❌ Failed to start server:", err)
	}
}
