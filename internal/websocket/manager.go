package websocket

import (
	"log"
	"sync"

	"github.com/gorilla/websocket"
)

// Client represents a WebSocket client
type Client struct {
	ID       string          `json:"id"`
	UserID   string          `json:"user_id"`
	Username string          `json:"username"`
	Conn     *websocket.Conn `json:"-"`
	Manager  *Manager        `json:"-"`
	mutex    sync.Mutex      // Protect concurrent writes to this client's connection
}

// Message represents a WebSocket message
type Message struct {
	Type      string      `json:"type"`
	Content   string      `json:"content"`
	UserID    string      `json:"user_id"`
	Username  string      `json:"username"`
	Timestamp int64       `json:"timestamp"`
	Data      interface{} `json:"data,omitempty"`
}

// Manager handles all WebSocket connections
type Manager struct {
	clients    map[string]*Client
	broadcast  chan *Message
	register   chan *Client
	unregister chan *Client
	mutex      sync.RWMutex
	
	// Connection limits
	maxConnections int
	connectionCount int
}

// NewManager creates a new WebSocket manager
func NewManager() *Manager {
	return &Manager{
		clients:         make(map[string]*Client),
		broadcast:       make(chan *Message),
		register:        make(chan *Client),
		unregister:      make(chan *Client),
		maxConnections:  1000, // Max 1000 connections
		connectionCount: 0,
	}
}

// Start starts the WebSocket manager
func (m *Manager) Start() {
	for {
		select {
		case client := <-m.register:
			m.mutex.Lock()
			
			// Check connection limit
			if m.connectionCount >= m.maxConnections {
				log.Printf("Rejected connection: limit reached (%d)", m.maxConnections)
				client.Conn.Close()
				m.mutex.Unlock()
				continue
			}
			
			m.clients[client.ID] = client
			m.connectionCount++
			m.mutex.Unlock()
			log.Printf("Client connected: %s (User: %s) - Total: %d", client.ID, client.Username, m.connectionCount)

		case client := <-m.unregister:
			m.mutex.Lock()
			if _, ok := m.clients[client.ID]; ok {
				delete(m.clients, client.ID)
				m.connectionCount--
				client.Conn.Close()
			}
			m.mutex.Unlock()
			log.Printf("Client disconnected: %s (User: %s) - Total: %d", client.ID, client.Username, m.connectionCount)

		case message := <-m.broadcast:
			m.mutex.RLock()
			for _, client := range m.clients {
				client.SendMessage(message)
			}
			m.mutex.RUnlock()
		}
	}
}

// Broadcast sends a message to all connected clients
func (m *Manager) Broadcast(message *Message) {
	m.broadcast <- message
}

// BroadcastToOthers sends a message to all clients except the sender
func (m *Manager) BroadcastToOthers(senderID string, message *Message) {
	m.mutex.RLock()
	defer m.mutex.RUnlock()

	for _, client := range m.clients {
		// Skip the sender
		if client.ID == senderID {
			continue
		}

		client.SendMessage(message)
	}
}

// BroadcastToParticipants sends a message only to clients who are participants in a conversation
func (m *Manager) BroadcastToParticipants(participantIDs map[string]bool, message *Message) {
	m.mutex.RLock()
	defer m.mutex.RUnlock()

	for _, client := range m.clients {
		// Only send to clients who are participants in this conversation
		if participantIDs[client.UserID] {
			client.SendMessage(message)
		}
	}
}

// SendToUser sends a message to a specific user
func (m *Manager) SendToUser(userID string, message *Message) {
	m.mutex.RLock()
	defer m.mutex.RUnlock()

	for _, client := range m.clients {
		if client.UserID == userID {
			client.SendMessage(message)
		}
	}
}

// SendMessage sends a message to this client (thread-safe)
func (c *Client) SendMessage(message *Message) {
	c.mutex.Lock()
	defer c.mutex.Unlock()
	
	err := c.Conn.WriteJSON(message)
	if err != nil {
		log.Printf("Error sending message to client %s: %v", c.ID, err)
	}
}

// GetConnectedUsers returns list of connected users
func (m *Manager) GetConnectedUsers() []string {
	m.mutex.RLock()
	defer m.mutex.RUnlock()

	users := make([]string, 0)
	seen := make(map[string]bool)

	for _, client := range m.clients {
		if !seen[client.UserID] {
			users = append(users, client.UserID)
			seen[client.UserID] = true
		}
	}

	return users
}
