package router

import (
	"goswift/internal/handlers"
	"goswift/internal/middleware"
	"goswift/pkg/jwt"

	"github.com/gin-gonic/gin"
)

// SetupAuthRoutes sets up authentication routes
func SetupAuthRoutes(router *gin.Engine, authHandler *handlers.AuthHandler, jwtManager *jwt.JWTManager) {
	// API v1 group
	apiV1 := router.Group("/api/v1")

	// Auth routes (public)
	auth := apiV1.Group("/auth")
	{
		auth.POST("/register", authHandler.Register)
		auth.POST("/login", authHandler.Login)
	}

	// Protected auth routes
	protectedAuth := apiV1.Group("/auth")
	protectedAuth.Use(middleware.AuthMiddleware(jwtManager))
	{
		protectedAuth.GET("/profile", authHandler.GetProfile)
		protectedAuth.POST("/logout", authHandler.Logout)
		protectedAuth.POST("/refresh", authHandler.RefreshToken)
	}
}
