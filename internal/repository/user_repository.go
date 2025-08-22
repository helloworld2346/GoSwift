package repository

import (
	"database/sql"
	"fmt"
	"time"

	"goswift/internal/database"
	"goswift/internal/models"

	"github.com/google/uuid"
)

type UserRepository struct {
	db *database.DB
}

func NewUserRepository(db *database.DB) *UserRepository {
	return &UserRepository{db: db}
}

// CreateUser creates a new user in the database
func (r *UserRepository) CreateUser(user *models.User) error {
	query := `
		INSERT INTO users (email, password_hash, display_name, avatar_url, is_online, last_seen, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
		RETURNING id
	`

	now := time.Now()
	err := r.db.QueryRow(query,
		user.Email,
		user.PasswordHash,
		user.DisplayName,
		user.AvatarURL,
		user.IsOnline,
		user.LastSeen,
		now,
		now,
	).Scan(&user.ID)

	if err != nil {
		return fmt.Errorf("failed to create user: %w", err)
	}

	return nil
}

// GetUserByEmail retrieves a user by email
func (r *UserRepository) GetUserByEmail(email string) (*models.User, error) {
	query := `
		SELECT id, email, password_hash, display_name, avatar_url, is_online, last_seen, created_at, updated_at
		FROM users
		WHERE email = $1
	`

	user := &models.User{}
	err := r.db.QueryRow(query, email).Scan(
		&user.ID,
		&user.Email,
		&user.PasswordHash,
		&user.DisplayName,
		&user.AvatarURL,
		&user.IsOnline,
		&user.LastSeen,
		&user.CreatedAt,
		&user.UpdatedAt,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("user not found")
		}
		return nil, fmt.Errorf("failed to get user by email: %w", err)
	}

	return user, nil
}

// GetUserByID retrieves a user by ID
func (r *UserRepository) GetUserByID(id uuid.UUID) (*models.User, error) {
	query := `
		SELECT id, email, password_hash, display_name, avatar_url, is_online, last_seen, created_at, updated_at
		FROM users
		WHERE id = $1
	`

	user := &models.User{}
	err := r.db.QueryRow(query, id).Scan(
		&user.ID,
		&user.Email,
		&user.PasswordHash,
		&user.DisplayName,
		&user.AvatarURL,
		&user.IsOnline,
		&user.LastSeen,
		&user.CreatedAt,
		&user.UpdatedAt,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("user not found")
		}
		return nil, fmt.Errorf("failed to get user by ID: %w", err)
	}

	return user, nil
}

// UpdateUserLastSeen updates the user's last seen timestamp
func (r *UserRepository) UpdateUserLastSeen(id uuid.UUID) error {
	query := `
		UPDATE users 
		SET last_seen = $1, updated_at = $1
		WHERE id = $2
	`

	_, err := r.db.Exec(query, time.Now(), id)
	if err != nil {
		return fmt.Errorf("failed to update user last seen: %w", err)
	}

	return nil
}

// UpdateUserOnlineStatus updates the user's online status
func (r *UserRepository) UpdateUserOnlineStatus(id uuid.UUID, isOnline bool) error {
	query := `
		UPDATE users 
		SET is_online = $1, updated_at = $2
		WHERE id = $3
	`

	_, err := r.db.Exec(query, isOnline, time.Now(), id)
	if err != nil {
		return fmt.Errorf("failed to update user online status: %w", err)
	}

	return nil
}

// CheckEmailExists checks if an email already exists
func (r *UserRepository) CheckEmailExists(email string) (bool, error) {
	query := `SELECT EXISTS(SELECT 1 FROM users WHERE email = $1)`

	var exists bool
	err := r.db.QueryRow(query, email).Scan(&exists)
	if err != nil {
		return false, fmt.Errorf("failed to check email exists: %w", err)
	}

	return exists, nil
}

// SearchUsers searches for users by display name or email
// Excludes the current user from search results
func (r *UserRepository) SearchUsers(query, currentUserID string) ([]models.User, error) {
	searchQuery := `
		SELECT id, email, password_hash, display_name, avatar_url, is_online, last_seen, created_at, updated_at
		FROM users
		WHERE (LOWER(display_name) LIKE LOWER($1) OR LOWER(email) LIKE LOWER($1))
		AND id != $2
		ORDER BY 
			CASE WHEN LOWER(display_name) = LOWER($1) THEN 1
				 WHEN LOWER(display_name) LIKE LOWER($1 || '%') THEN 2
				 WHEN LOWER(email) = LOWER($1) THEN 3
				 ELSE 4
			END,
			display_name
		LIMIT 20
	`

	searchTerm := "%" + query + "%"
	rows, err := r.db.Query(searchQuery, searchTerm, currentUserID)
	if err != nil {
		return nil, fmt.Errorf("failed to search users: %w", err)
	}
	defer rows.Close()

	var users []models.User
	for rows.Next() {
		var user models.User
		err := rows.Scan(
			&user.ID,
			&user.Email,
			&user.PasswordHash,
			&user.DisplayName,
			&user.AvatarURL,
			&user.IsOnline,
			&user.LastSeen,
			&user.CreatedAt,
			&user.UpdatedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan user: %w", err)
		}
		users = append(users, user)
	}

	if err = rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating users: %w", err)
	}

	return users, nil
}

// GetOnlineUsers returns list of online users
// Excludes the current user from results
func (r *UserRepository) GetOnlineUsers(currentUserID string) ([]models.User, error) {
	query := `
		SELECT id, email, password_hash, display_name, avatar_url, is_online, last_seen, created_at, updated_at
		FROM users
		WHERE is_online = true AND id != $1
		ORDER BY last_seen DESC
		LIMIT 50
	`

	rows, err := r.db.Query(query, currentUserID)
	if err != nil {
		return nil, fmt.Errorf("failed to get online users: %w", err)
	}
	defer rows.Close()

	var users []models.User
	for rows.Next() {
		var user models.User
		err := rows.Scan(
			&user.ID,
			&user.Email,
			&user.PasswordHash,
			&user.DisplayName,
			&user.AvatarURL,
			&user.IsOnline,
			&user.LastSeen,
			&user.CreatedAt,
			&user.UpdatedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan user: %w", err)
		}
		users = append(users, user)
	}

	if err = rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating users: %w", err)
	}

	return users, nil
}

// GetByID retrieves a user by ID (string version for service layer)
func (r *UserRepository) GetByID(userID string) (*models.User, error) {
	id, err := uuid.Parse(userID)
	if err != nil {
		return nil, fmt.Errorf("invalid user ID format: %w", err)
	}

	return r.GetUserByID(id)
}

// UpdateOnlineStatus updates user's online status
func (r *UserRepository) UpdateOnlineStatus(userID uuid.UUID, isOnline bool) error {
	query := `
		UPDATE users 
		SET is_online = $1, last_seen = NOW()
		WHERE id = $2
	`
	
	_, err := r.db.Exec(query, isOnline, userID)
	if err != nil {
		return fmt.Errorf("failed to update user online status: %w", err)
	}
	
	return nil
}
