package router

import (
	"time"

	"goswift/internal/database"
	"goswift/internal/handlers"
	"goswift/internal/middleware"
	"goswift/internal/repository"
	"goswift/internal/service"
	"goswift/pkg/jwt"
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

	// Add rate limiting
	rateLimiter := middleware.NewRateLimiter(100, time.Minute) // 100 requests/minute
	r.Use(rateLimiter.RateLimitMiddleware())

	// Add CORS middleware
	r.Use(corsMiddleware(config))

	// Initialize repositories
	userRepo := repository.NewUserRepository(db)

	// Initialize JWT manager
	jwtManager := jwt.NewJWTManager(config.JWTSecret, config.JWTTokenDuration)

	// Initialize services
	authService := service.NewAuthService(userRepo, jwtManager)

	// Initialize handlers
	healthHandler := handlers.NewHealthHandler(db, config)
	authHandler := handlers.NewAuthHandler(authService)

	// Health check endpoint (root level)
	r.GET("/health", healthHandler.HealthCheck)

	// API v1 routes
	apiV1 := r.Group("/api/v1")
	{
		// Health check endpoint (API level)
		apiV1.GET("/health", healthHandler.HealthCheck)
	}

	// Setup auth routes
	SetupAuthRoutes(r, authHandler, jwtManager)

	// Swagger documentation
	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	return r
}

func corsMiddleware(config *utils.Config) gin.HandlerFunc {
	return gin.HandlerFunc(func(c *gin.Context) {
		// Allow all origins in development, restrict in production
		origin := c.Request.Header.Get("Origin")
		if config.Env == "production" {
			allowedOrigins := []string{"https://yourdomain.com"}
			allowed := false
			for _, allowedOrigin := range allowedOrigins {
				if origin == allowedOrigin {
					allowed = true
					break
				}
			}
			if !allowed {
				c.Header("Access-Control-Allow-Origin", "")
			} else {
				c.Header("Access-Control-Allow-Origin", origin)
			}
		} else {
			c.Header("Access-Control-Allow-Origin", "*")
		}

		c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Origin, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")
		c.Header("Access-Control-Allow-Credentials", "true")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	})
}
