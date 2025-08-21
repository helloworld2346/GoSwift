package repository

import (
	"database/sql"
	"time"

	"goswift/internal/models"

	"github.com/google/uuid"
)

type ConversationRepository struct {
	db *sql.DB
}

func NewConversationRepository(db *sql.DB) *ConversationRepository {
	return &ConversationRepository{db: db}
}

// CreateConversation creates a new conversation
func (r *ConversationRepository) CreateConversation(conversation *models.Conversation) error {
	query := `
		INSERT INTO conversations (id, name, type, created_by, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6)
	`

	conversation.ID = uuid.New()
	conversation.CreatedAt = time.Now()
	conversation.UpdatedAt = time.Now()

	_, err := r.db.Exec(query,
		conversation.ID,
		conversation.Name,
		conversation.Type,
		conversation.CreatedBy,
		conversation.CreatedAt,
		conversation.UpdatedAt,
	)

	return err
}

// GetConversationByID gets a conversation by ID
func (r *ConversationRepository) GetConversationByID(id uuid.UUID) (*models.Conversation, error) {
	query := `
		SELECT id, name, type, created_by, created_at, updated_at
		FROM conversations
		WHERE id = $1
	`

	conversation := &models.Conversation{}
	err := r.db.QueryRow(query, id).Scan(
		&conversation.ID,
		&conversation.Name,
		&conversation.Type,
		&conversation.CreatedBy,
		&conversation.CreatedAt,
		&conversation.UpdatedAt,
	)

	if err != nil {
		return nil, err
	}

	return conversation, nil
}

// GetConversationsByUserID gets all conversations for a user
func (r *ConversationRepository) GetConversationsByUserID(userID uuid.UUID) ([]*models.Conversation, error) {
	query := `
		SELECT DISTINCT c.id, c.name, c.type, c.created_by, c.created_at, c.updated_at
		FROM conversations c
		JOIN conversation_participants cp ON c.id = cp.conversation_id
		WHERE cp.user_id = $1
		ORDER BY c.updated_at DESC
	`

	rows, err := r.db.Query(query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var conversations []*models.Conversation
	for rows.Next() {
		conversation := &models.Conversation{}
		err := rows.Scan(
			&conversation.ID,
			&conversation.Name,
			&conversation.Type,
			&conversation.CreatedBy,
			&conversation.CreatedAt,
			&conversation.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		conversations = append(conversations, conversation)
	}

	return conversations, nil
}

// UpdateConversation updates a conversation
func (r *ConversationRepository) UpdateConversation(conversation *models.Conversation) error {
	query := `
		UPDATE conversations
		SET name = $2, type = $3, updated_at = $4
		WHERE id = $1
	`

	conversation.UpdatedAt = time.Now()
	_, err := r.db.Exec(query,
		conversation.ID,
		conversation.Name,
		conversation.Type,
		conversation.UpdatedAt,
	)

	return err
}

// DeleteConversation deletes a conversation
func (r *ConversationRepository) DeleteConversation(id uuid.UUID) error {
	query := `DELETE FROM conversations WHERE id = $1`
	_, err := r.db.Exec(query, id)
	return err
}
