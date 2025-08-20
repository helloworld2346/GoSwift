package router

import (
	"goswift/internal/database"
	"goswift/internal/handlers"
	"goswift/pkg/utils"

	"github.com/gin-gonic/gin"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

func SetupRouter(config *utils.Config, db *database.DB) *gin.Engine {
	// Set Gin mode
	if config.Env == "production" {
		gin.SetMode(gin.ReleaseMode)
	}

	r := gin.Default()

	// Add CORS middleware
	r.Use(corsMiddleware())

	// Initialize handlers
	healthHandler := handlers.NewHealthHandler(db, config)

	// Health check endpoint (root level)
	r.GET("/health", healthHandler.HealthCheck)

	// API v1 routes
	apiV1 := r.Group("/api/v1")
	{
		// Health check endpoint (API level)
		apiV1.GET("/health", healthHandler.HealthCheck)

		// Auth routes (will be added in Phase 2)
		// auth := apiV1.Group("/auth")
		// {
		//     auth.POST("/register", authHandler.Register)
		//     auth.POST("/login", authHandler.Login)
		// }

		// Protected routes (will be added in Phase 3)
		// protected := apiV1.Group("/")
		// protected.Use(authMiddleware())
		// {
		//     protected.GET("/conversations", chatHandler.GetConversations)
		//     protected.POST("/messages", chatHandler.SendMessage)
		// }
	}

	// Swagger documentation
	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	return r
}

func corsMiddleware() gin.HandlerFunc {
	return gin.HandlerFunc(func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Origin, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	})
}
