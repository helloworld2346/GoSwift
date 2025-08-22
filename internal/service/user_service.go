package service

import (
	"goswift/internal/models"
	"goswift/internal/repository"
)

// UserService handles user-related business logic
type UserService struct {
	userRepo *repository.UserRepository
}

// NewUserService creates a new user service
func NewUserService(userRepo *repository.UserRepository) *UserService {
	return &UserService{
		userRepo: userRepo,
	}
}

// SearchUsers searches for users by display name or email
// Excludes the current user from search results
func (s *UserService) SearchUsers(query, currentUserID string) ([]models.User, error) {
	users, err := s.userRepo.SearchUsers(query, currentUserID)
	if err != nil {
		return nil, err
	}

	// Remove sensitive information
	for i := range users {
		users[i].PasswordHash = ""
	}

	return users, nil
}

// GetOnlineUsers returns list of online users
// Excludes the current user from results
func (s *UserService) GetOnlineUsers(currentUserID string) ([]models.User, error) {
	users, err := s.userRepo.GetOnlineUsers(currentUserID)
	if err != nil {
		return nil, err
	}

	// Remove sensitive information
	for i := range users {
		users[i].PasswordHash = ""
	}

	return users, nil
}

// GetUserByID returns user by ID
func (s *UserService) GetUserByID(userID string) (*models.User, error) {
	user, err := s.userRepo.GetByID(userID)
	if err != nil {
		return nil, err
	}

	// Remove sensitive information
	user.PasswordHash = ""

	return user, nil
}
