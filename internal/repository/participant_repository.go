package repository

import (
	"time"

	"goswift/internal/database"
	"goswift/internal/models"

	"github.com/google/uuid"
)

type ParticipantRepository struct {
	db *database.DB
}

func NewParticipantRepository(db *database.DB) *ParticipantRepository {
	return &ParticipantRepository{db: db}
}

// AddParticipant adds a user to a conversation
func (r *ParticipantRepository) AddParticipant(participant *models.ConversationParticipant) error {
	query := `
		INSERT INTO conversation_participants (id, conversation_id, user_id, joined_at, is_admin)
		VALUES ($1, $2, $3, $4, $5)
	`

	participant.ID = uuid.New()
	participant.JoinedAt = time.Now()

	_, err := r.db.Exec(query,
		participant.ID,
		participant.ConversationID,
		participant.UserID,
		participant.JoinedAt,
		participant.IsAdmin,
	)

	return err
}

// GetParticipantsByConversationID gets all participants for a conversation
func (r *ParticipantRepository) GetParticipantsByConversationID(conversationID uuid.UUID) ([]*models.ConversationParticipant, error) {
	query := `
		SELECT cp.id, cp.conversation_id, cp.user_id, cp.joined_at, cp.is_admin,
		       u.id, u.email, u.display_name, u.avatar_url, u.is_online, u.last_seen, u.created_at, u.updated_at
		FROM conversation_participants cp
		JOIN users u ON cp.user_id = u.id
		WHERE cp.conversation_id = $1
		ORDER BY cp.joined_at ASC
	`

	rows, err := r.db.Query(query, conversationID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var participants []*models.ConversationParticipant
	for rows.Next() {
		participant := &models.ConversationParticipant{}
		user := &models.User{}

		err := rows.Scan(
			&participant.ID,
			&participant.ConversationID,
			&participant.UserID,
			&participant.JoinedAt,
			&participant.IsAdmin,
			&user.ID,
			&user.Email,
			&user.DisplayName,
			&user.AvatarURL,
			&user.IsOnline,
			&user.LastSeen,
			&user.CreatedAt,
			&user.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}

		participant.User = user
		participants = append(participants, participant)
	}

	return participants, nil
}

// RemoveParticipant removes a user from a conversation
func (r *ParticipantRepository) RemoveParticipant(conversationID, userID uuid.UUID) error {
	query := `DELETE FROM conversation_participants WHERE conversation_id = $1 AND user_id = $2`
	_, err := r.db.Exec(query, conversationID, userID)
	return err
}

// IsParticipant checks if a user is a participant in a conversation
func (r *ParticipantRepository) IsParticipant(conversationID, userID uuid.UUID) (bool, error) {
	query := `SELECT EXISTS(SELECT 1 FROM conversation_participants WHERE conversation_id = $1 AND user_id = $2)`

	var exists bool
	err := r.db.QueryRow(query, conversationID, userID).Scan(&exists)
	return exists, err
}
