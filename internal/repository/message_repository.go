package repository

import (
	"database/sql"
	"time"

	"goswift/internal/models"

	"github.com/google/uuid"
)

type MessageRepository struct {
	db *sql.DB
}

func NewMessageRepository(db *sql.DB) *MessageRepository {
	return &MessageRepository{db: db}
}

// CreateMessage creates a new message
func (r *MessageRepository) CreateMessage(message *models.Message) error {
	query := `
		INSERT INTO messages (id, conversation_id, sender_id, content, message_type, is_read, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
	`
	
	message.ID = uuid.New()
	message.CreatedAt = time.Now()
	message.UpdatedAt = time.Now()
	
	_, err := r.db.Exec(query,
		message.ID,
		message.ConversationID,
		message.SenderID,
		message.Content,
		message.MessageType,
		message.IsRead,
		message.CreatedAt,
		message.UpdatedAt,
	)
	
	return err
}

// GetMessagesByConversationID gets messages for a conversation
func (r *MessageRepository) GetMessagesByConversationID(conversationID uuid.UUID, limit, offset int) ([]*models.Message, error) {
	query := `
		SELECT m.id, m.conversation_id, m.sender_id, m.content, m.message_type, m.is_read, m.created_at, m.updated_at,
		       u.display_name as sender_name
		FROM messages m
		JOIN users u ON m.sender_id = u.id
		WHERE m.conversation_id = $1
		ORDER BY m.created_at DESC
		LIMIT $2 OFFSET $3
	`
	
	rows, err := r.db.Query(query, conversationID, limit, offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	
	var messages []*models.Message
	for rows.Next() {
		message := &models.Message{}
		err := rows.Scan(
			&message.ID,
			&message.ConversationID,
			&message.SenderID,
			&message.Content,
			&message.MessageType,
			&message.IsRead,
			&message.CreatedAt,
			&message.UpdatedAt,
			&message.SenderName,
		)
		if err != nil {
			return nil, err
		}
		messages = append(messages, message)
	}
	
	return messages, nil
}

// GetMessageByID gets a message by ID
func (r *MessageRepository) GetMessageByID(id uuid.UUID) (*models.Message, error) {
	query := `
		SELECT m.id, m.conversation_id, m.sender_id, m.content, m.message_type, m.is_read, m.created_at, m.updated_at,
		       u.display_name as sender_name
		FROM messages m
		JOIN users u ON m.sender_id = u.id
		WHERE m.id = $1
	`
	
	message := &models.Message{}
	err := r.db.QueryRow(query, id).Scan(
		&message.ID,
		&message.ConversationID,
		&message.SenderID,
		&message.Content,
		&message.MessageType,
		&message.IsRead,
		&message.CreatedAt,
		&message.UpdatedAt,
		&message.SenderName,
	)
	
	if err != nil {
		return nil, err
	}
	
	return message, nil
}

// MarkMessageAsRead marks a message as read
func (r *MessageRepository) MarkMessageAsRead(id uuid.UUID) error {
	query := `UPDATE messages SET is_read = true, updated_at = $2 WHERE id = $1`
	_, err := r.db.Exec(query, id, time.Now())
	return err
}

// GetLastMessageByConversationID gets the last message for a conversation
func (r *MessageRepository) GetLastMessageByConversationID(conversationID uuid.UUID) (*models.Message, error) {
	query := `
		SELECT m.id, m.conversation_id, m.sender_id, m.content, m.message_type, m.is_read, m.created_at, m.updated_at,
		       u.display_name as sender_name
		FROM messages m
		JOIN users u ON m.sender_id = u.id
		WHERE m.conversation_id = $1
		ORDER BY m.created_at DESC
		LIMIT 1
	`
	
	message := &models.Message{}
	err := r.db.QueryRow(query, conversationID).Scan(
		&message.ID,
		&message.ConversationID,
		&message.SenderID,
		&message.Content,
		&message.MessageType,
		&message.IsRead,
		&message.CreatedAt,
		&message.UpdatedAt,
		&message.SenderName,
	)
	
	if err != nil {
		return nil, err
	}
	
	return message, nil
}
