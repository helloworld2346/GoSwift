package service

import (
	"time"

	"goswift/internal/models"
	"goswift/internal/repository"
	"goswift/pkg/jwt"
	"goswift/pkg/utils"

	"github.com/google/uuid"
)

type AuthService struct {
	userRepo   *repository.UserRepository
	jwtManager *jwt.JWTManager
}

func NewAuthService(userRepo *repository.UserRepository, jwtManager *jwt.JWTManager) *AuthService {
	return &AuthService{
		userRepo:   userRepo,
		jwtManager: jwtManager,
	}
}

// Register registers a new user
func (s *AuthService) Register(req *models.CreateUserRequest) (*models.UserResponse, error) {
	// Validate input
	if err := utils.ValidateUserInput(req.Email, req.Password, req.DisplayName); err != nil {
		return nil, err
	}

	// Check if email already exists
	exists, err := s.userRepo.CheckEmailExists(req.Email)
	if err != nil {
		return nil, err
	}
	if exists {
		return nil, utils.ErrEmailExists
	}

	// Hash password
	hashedPassword, err := utils.HashPassword(req.Password)
	if err != nil {
		return nil, err
	}

	// Create user (let database generate UUID)
	now := time.Now()
	user := &models.User{
		Email:        req.Email,
		PasswordHash: hashedPassword,
		DisplayName:  req.DisplayName,
		AvatarURL:    "", // Default empty
		IsOnline:     false,
		LastSeen:     now,
		CreatedAt:    now,
		UpdatedAt:    now,
	}

	if err := s.userRepo.CreateUser(user); err != nil {
		return nil, err
	}

	// Return user response (without password)
	return &models.UserResponse{
		ID:          user.ID,
		Email:       user.Email,
		DisplayName: user.DisplayName,
		AvatarURL:   user.AvatarURL,
		IsOnline:    user.IsOnline,
		LastSeen:    user.LastSeen,
		CreatedAt:   user.CreatedAt,
	}, nil
}

// Login authenticates a user and returns tokens
func (s *AuthService) Login(req *models.LoginRequest) (*models.UserResponse, string, error) {
	// Get user by email
	user, err := s.userRepo.GetUserByEmail(req.Email)
	if err != nil {
		return nil, "", utils.ErrInvalidCredentials
	}

	// Check password
	if !utils.CheckPasswordHash(req.Password, user.PasswordHash) {
		return nil, "", utils.ErrInvalidCredentials
	}

	// Generate JWT token
	token, err := s.jwtManager.GenerateToken(user)
	if err != nil {
		return nil, "", err
	}

	// Update last seen
	if err := s.userRepo.UpdateUserLastSeen(user.ID); err != nil {
		return nil, "", err
	}

	// Return user response and token
	return &models.UserResponse{
		ID:          user.ID,
		Email:       user.Email,
		DisplayName: user.DisplayName,
		AvatarURL:   user.AvatarURL,
		IsOnline:    user.IsOnline,
		LastSeen:    user.LastSeen,
		CreatedAt:   user.CreatedAt,
	}, token, nil
}

// GetUserByID gets user by ID
func (s *AuthService) GetUserByID(userID uuid.UUID) (*models.UserResponse, error) {
	user, err := s.userRepo.GetUserByID(userID)
	if err != nil {
		return nil, err
	}

	return &models.UserResponse{
		ID:          user.ID,
		Email:       user.Email,
		DisplayName: user.DisplayName,
		AvatarURL:   user.AvatarURL,
		IsOnline:    user.IsOnline,
		LastSeen:    user.LastSeen,
		CreatedAt:   user.CreatedAt,
	}, nil
}
