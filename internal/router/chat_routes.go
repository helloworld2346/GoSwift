package router

import (
	"goswift/internal/handlers"

	"github.com/gin-gonic/gin"
)

// SetupChatRoutes sets up chat routes
func SetupChatRoutes(router *gin.Engine, chatHandler *handlers.ChatHandler, authMiddleware gin.HandlerFunc) {
	// Chat routes group
	chatRoutes := router.Group("/api/v1/conversations")
	chatRoutes.Use(authMiddleware) // Require authentication

	{
		// Conversation management
		chatRoutes.POST("", chatHandler.CreateConversation) // Create conversation
		chatRoutes.GET("", chatHandler.GetConversations)    // Get user conversations
		chatRoutes.GET("/:id", chatHandler.GetConversation) // Get specific conversation

		// Message management
		chatRoutes.POST("/:id/messages", chatHandler.SendMessage)                        // Send message
		chatRoutes.GET("/:id/messages", chatHandler.GetMessages)                         // Get messages
		chatRoutes.POST("/:id/messages/:message_id/read", chatHandler.MarkMessageAsRead) // Mark as read
	}
}
