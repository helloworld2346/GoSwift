package websocket

import (
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// Handler handles WebSocket connections
type Handler struct {
	manager *Manager
}

// NewHandler creates a new WebSocket handler
func NewHandler(manager *Manager) *Handler {
	return &Handler{
		manager: manager,
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

	// Broadcast message to all clients
	h.manager.Broadcast(message)
	log.Printf("Broadcasting message from %s: %s", client.Username, message.Content)
}

// handlePing handles ping messages
func (h *Handler) handlePing(client *Client) {
	response := &Message{
		Type:      "pong",
		Timestamp: time.Now().Unix(),
	}

	client.Conn.WriteJSON(response)
}
