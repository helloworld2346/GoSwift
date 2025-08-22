package router

import (
	"goswift/internal/handlers"

	"github.com/gin-gonic/gin"
)

// SetupUserRoutes sets up user routes
func SetupUserRoutes(router *gin.Engine, userHandler *handlers.UserHandler, authMiddleware gin.HandlerFunc) {
	// User routes group
	userRoutes := router.Group("/api/v1/users")
	userRoutes.Use(authMiddleware) // Require authentication

	{
		// User search and discovery
		userRoutes.GET("/search", userHandler.SearchUsers)     // Search users
		userRoutes.GET("/online", userHandler.GetOnlineUsers)  // Get online users
		userRoutes.GET("/:id", userHandler.GetUserProfile)     // Get user profile
	}
}
