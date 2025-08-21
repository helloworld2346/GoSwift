package models

import (
	"time"

	"github.com/google/uuid"
)

// Conversation represents a chat conversation
type Conversation struct {
	ID          uuid.UUID `json:"id" db:"id"`
	Name        string    `json:"name" db:"name"` // For group chats
	Type        string    `json:"type" db:"type"` // "direct" or "group"
	CreatedBy   uuid.UUID `json:"created_by" db:"created_by"`
	CreatedAt   time.Time `json:"created_at" db:"created_at"`
	UpdatedAt   time.Time `json:"updated_at" db:"updated_at"`
	LastMessage *Message  `json:"last_message,omitempty" db:"-"` // Virtual field
}

// Message represents a chat message
type Message struct {
	ID             uuid.UUID `json:"id" db:"id"`
	ConversationID uuid.UUID `json:"conversation_id" db:"conversation_id"`
	SenderID       uuid.UUID `json:"sender_id" db:"sender_id"`
	Content        string    `json:"content" db:"content"`
	MessageType    string    `json:"message_type" db:"message_type"` // "text", "image", "file"
	IsRead         bool      `json:"is_read" db:"is_read"`
	CreatedAt      time.Time `json:"created_at" db:"created_at"`
	UpdatedAt      time.Time `json:"updated_at" db:"updated_at"`

	// Virtual fields for joins
	SenderName string `json:"sender_name,omitempty" db:"-"`
	Sender     *User  `json:"sender,omitempty" db:"-"`
}

// ConversationParticipant represents a user in a conversation
type ConversationParticipant struct {
	ID             uuid.UUID `json:"id" db:"id"`
	ConversationID uuid.UUID `json:"conversation_id" db:"conversation_id"`
	UserID         uuid.UUID `json:"user_id" db:"user_id"`
	JoinedAt       time.Time `json:"joined_at" db:"joined_at"`
	IsAdmin        bool      `json:"is_admin" db:"is_admin"` // For group chats

	// Virtual fields for joins
	User *User `json:"user,omitempty" db:"-"`
}

// CreateConversationRequest represents the request to create a conversation
type CreateConversationRequest struct {
	Name      string      `json:"name" binding:"required,min=1,max=100"`
	Type      string      `json:"type" binding:"required,oneof=direct group"`
	UserIDs   []uuid.UUID `json:"user_ids" binding:"required,min=1"`
	CreatedBy uuid.UUID   `json:"created_by"`
}

// SendMessageRequest represents the request to send a message
type SendMessageRequest struct {
	ConversationID uuid.UUID `json:"conversation_id" binding:"required"`
	Content        string    `json:"content" binding:"required,min=1,max=1000"`
	MessageType    string    `json:"message_type" binding:"required,oneof=text image file"`
}

// ConversationResponse represents the conversation response
type ConversationResponse struct {
	ID           uuid.UUID `json:"id"`
	Name         string    `json:"name"`
	Type         string    `json:"type"`
	CreatedBy    uuid.UUID `json:"created_by"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
	LastMessage  *Message  `json:"last_message,omitempty"`
	Participants []User    `json:"participants,omitempty"`
}

// MessageResponse represents the message response
type MessageResponse struct {
	ID             uuid.UUID `json:"id"`
	ConversationID uuid.UUID `json:"conversation_id"`
	SenderID       uuid.UUID `json:"sender_id"`
	Content        string    `json:"content"`
	MessageType    string    `json:"message_type"`
	IsRead         bool      `json:"is_read"`
	CreatedAt      time.Time `json:"created_at"`
	UpdatedAt      time.Time `json:"updated_at"`
	SenderName     string    `json:"sender_name"`
}
