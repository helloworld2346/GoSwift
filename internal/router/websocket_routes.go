package router

import (
	"goswift/internal/websocket"

	"github.com/gin-gonic/gin"
)

// SetupWebSocketRoutes sets up WebSocket routes
func SetupWebSocketRoutes(router *gin.Engine, wsHandler *websocket.Handler) {
	// WebSocket endpoint
	router.GET("/ws", wsHandler.HandleWebSocket)
}
