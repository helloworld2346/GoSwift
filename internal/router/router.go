package router

import (
	"time"

	"goswift/internal/cache"
	"goswift/internal/database"
	"goswift/internal/handlers"
	"goswift/internal/middleware"
	"goswift/internal/repository"
	"goswift/internal/service"
	"goswift/internal/websocket"
	"goswift/pkg/jwt"
	"goswift/pkg/utils"

	"github.com/gin-gonic/gin"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

func SetupRouter(config *utils.Config, db *database.DB, redisClient *cache.RedisClient) *gin.Engine {
	// Set Gin mode
	if config.Env == "production" {
		gin.SetMode(gin.ReleaseMode)
	}

	r := gin.Default()

	// Add security headers
	r.Use(middleware.SecurityHeaders())

	// Add rate limiting
	rateLimiter := middleware.NewRateLimiter(100, time.Minute)
	r.Use(rateLimiter.RateLimitMiddleware())

	// Add CORS middleware
	r.Use(corsMiddleware(config))

	// Initialize repositories
	userRepo := repository.NewUserRepository(db)
	conversationRepo := repository.NewConversationRepository(db)
	messageRepo := repository.NewMessageRepository(db)
	participantRepo := repository.NewParticipantRepository(db)

	// Initialize JWT manager with Redis
	jwtManager := jwt.NewJWTManager(config.JWTSecret, config.JWTTokenDuration, redisClient)

	// Initialize services
	authService := service.NewAuthService(userRepo, jwtManager)
	chatService := service.NewChatService(conversationRepo, messageRepo, participantRepo, userRepo)
	userService := service.NewUserService(userRepo)

	// Initialize WebSocket manager
	wsManager := websocket.NewManager()
	go wsManager.Start() // Start WebSocket manager in goroutine

	// Initialize handlers
	healthHandler := handlers.NewHealthHandler(db, redisClient, config)
	authHandler := handlers.NewAuthHandler(authService)
	wsHandler := websocket.NewHandler(wsManager, chatService)
	chatHandler := handlers.NewChatHandler(chatService, wsHandler)
	userHandler := handlers.NewUserHandler(userService)

	// Health check endpoint (root level)
	r.GET("/health", healthHandler.HealthCheck)

	// Setup WebSocket routes
	SetupWebSocketRoutes(r, wsHandler)

	// API v1 routes
	apiV1 := r.Group("/api/v1")
	{
		// Health check endpoint (API level)
		apiV1.GET("/health", healthHandler.HealthCheck)
	}

	// Setup auth routes
	SetupAuthRoutes(r, authHandler, jwtManager)

	// Setup chat routes
	SetupChatRoutes(r, chatHandler, middleware.AuthMiddleware(jwtManager))

	// Setup user routes
	SetupUserRoutes(r, userHandler, middleware.AuthMiddleware(jwtManager))

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
