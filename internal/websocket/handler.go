package websocket

import (
	"encoding/json"
	"log"
	"net/http"
	"time"

	"goswift/internal/service"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// Handler handles WebSocket connections
type Handler struct {
	manager     *Manager
	chatService *service.ChatService
}

// NewHandler creates a new WebSocket handler
func NewHandler(manager *Manager, chatService *service.ChatService) *Handler {
	return &Handler{
		manager:     manager,
		chatService: chatService,
	}
}

// HandleWebSocket handles incoming WebSocket connections
func (h *Handler) HandleWebSocket(c *gin.Context) {
	// Upgrade HTTP connection to WebSocket
	conn, err := UpgradeConnection(c.Writer, c.Request)
	if err != nil {
		log.Printf("Error upgrading connection: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to upgrade connection"})
		return
	}

	// Create new client
	client := &Client{
		ID:   uuid.New().String(),
		Conn: conn,
	}

	// Register client
	h.manager.register <- client

	// Start reading messages from client
	go h.readMessages(client)
}

// readMessages reads messages from a client
func (h *Handler) readMessages(client *Client) {
	defer func() {
		// Set user offline when disconnecting
		if h.chatService != nil && client.UserID != "" {
			if userID, err := uuid.Parse(client.UserID); err == nil {
				// Set user as offline
				h.chatService.UpdateUserOnlineStatus(userID, false)
				
				// Broadcast offline status to other users
				statusMessage := &Message{
					Type:      "user_status",
					UserID:    client.UserID,
					Username:  client.Username,
					Timestamp: time.Now().Unix(),
					Data: map[string]interface{}{
						"user_id":   client.UserID,
						"is_online": false,
					},
				}
				log.Printf("Broadcasting offline status for user %s: %+v", client.UserID, statusMessage)
				h.manager.Broadcast(statusMessage)
			}
		}
		
		h.manager.unregister <- client
	}()

	for {
		// Read message from client
		_, messageBytes, err := client.Conn.ReadMessage()
		if err != nil {
			log.Printf("Error reading message from client %s: %v", client.ID, err)
			break
		}

		// Parse message
		var message Message
		if err := json.Unmarshal(messageBytes, &message); err != nil {
			log.Printf("Error parsing message from client %s: %v", client.ID, err)
			continue
		}

		// Handle message based on type
		h.handleMessage(client, &message)
	}
}

// handleMessage handles different types of messages
func (h *Handler) handleMessage(client *Client, message *Message) {
	switch message.Type {
	case "auth":
		// Handle authentication
		h.handleAuth(client, message)
	case "message":
		// Handle chat message
		h.handleChatMessage(client, message)
	case "user_status":
		// Handle user status updates (online/offline)
		h.handleUserStatus(client, message)
	case "ping":
		// Handle ping
		h.handlePing(client)
	default:
		log.Printf("Unknown message type: %s", message.Type)
	}
}

// handleAuth handles authentication messages
func (h *Handler) handleAuth(client *Client, message *Message) {
	// For now, we'll accept any auth message
	// Later we'll add proper JWT validation
	client.UserID = message.UserID
	client.Username = message.Username

	// Update user online status in database
	if h.chatService != nil && client.UserID != "" {
		if userID, err := uuid.Parse(client.UserID); err == nil {
			// Set user as online
			h.chatService.UpdateUserOnlineStatus(userID, true)
			
			// Broadcast online status to other users
			statusMessage := &Message{
				Type:      "user_status",
				UserID:    client.UserID,
				Username:  client.Username,
				Timestamp: time.Now().Unix(),
				Data: map[string]interface{}{
					"user_id":   client.UserID,
					"is_online": true,
				},
			}
			log.Printf("Broadcasting online status for user %s: %+v", client.UserID, statusMessage)
			h.manager.BroadcastToOthers(client.ID, statusMessage)
		}
	}

	// Send auth success response
	response := &Message{
		Type:      "auth_success",
		Content:   "Authentication successful",
		Timestamp: time.Now().Unix(),
	}

	client.Conn.WriteJSON(response)
	log.Printf("Client %s authenticated as user %s", client.ID, client.Username)
}

// handleChatMessage handles chat messages
func (h *Handler) handleChatMessage(client *Client, message *Message) {
	// Add timestamp if not provided
	if message.Timestamp == 0 {
		message.Timestamp = time.Now().Unix()
	}

	// Set user info from client
	message.UserID = client.UserID
	message.Username = client.Username

	// Note: Messages are saved via API, WebSocket only handles real-time broadcasting
	// This prevents duplicate database entries

	// Broadcast message to all clients EXCEPT the sender to prevent echo
	h.manager.BroadcastToOthers(client.ID, message)
	log.Printf("Broadcasting message from %s: %s", client.Username, message.Content)
}

// BroadcastMessage broadcasts a saved message to all clients
func (h *Handler) BroadcastMessage(message *Message) {
	h.manager.Broadcast(message)
	log.Printf("Broadcasting saved message: %s", message.Content)
}

// handleUserStatus handles user status updates
func (h *Handler) handleUserStatus(client *Client, message *Message) {
	// Just log the status update for now
	// In a real app, you might want to update UI or store status
	if data, ok := message.Data.(map[string]interface{}); ok {
		status := data["status"]
		log.Printf("User status update: %s is %v", message.Username, status)
	}
}

// handlePing handles ping messages
func (h *Handler) handlePing(client *Client) {
	response := &Message{
		Type:      "pong",
		Timestamp: time.Now().Unix(),
	}

	client.Conn.WriteJSON(response)
}
