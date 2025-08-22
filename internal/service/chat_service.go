package service

import (
	"errors"
	"fmt"

	"goswift/internal/models"
	"goswift/internal/repository"

	"github.com/google/uuid"
)

type ChatService struct {
	conversationRepo *repository.ConversationRepository
	messageRepo      *repository.MessageRepository
	participantRepo  *repository.ParticipantRepository
	userRepo         *repository.UserRepository
}

func NewChatService(
	conversationRepo *repository.ConversationRepository,
	messageRepo *repository.MessageRepository,
	participantRepo *repository.ParticipantRepository,
	userRepo *repository.UserRepository,
) *ChatService {
	return &ChatService{
		conversationRepo: conversationRepo,
		messageRepo:      messageRepo,
		participantRepo:  participantRepo,
		userRepo:         userRepo,
	}
}

// CreateConversation creates a new conversation
func (s *ChatService) CreateConversation(req *models.CreateConversationRequest) (*models.ConversationResponse, error) {
	// Validate that all users exist
	for _, userID := range req.UserIDs {
		_, err := s.userRepo.GetUserByID(userID)
		if err != nil {
			return nil, fmt.Errorf("user %s not found", userID)
		}
	}

	// Validate that creator exists
	_, err := s.userRepo.GetUserByID(req.CreatedBy)
	if err != nil {
		return nil, fmt.Errorf("creator %s not found", req.CreatedBy)
	}

	// Create conversation
	conversation := &models.Conversation{
		Name:      req.Name,
		Type:      req.Type,
		CreatedBy: req.CreatedBy,
	}

	err = s.conversationRepo.CreateConversation(conversation)
	if err != nil {
		return nil, fmt.Errorf("failed to create conversation: %w", err)
	}

	// Add creator as participant first
	creatorParticipant := &models.ConversationParticipant{
		ConversationID: conversation.ID,
		UserID:         req.CreatedBy,
		IsAdmin:        true, // Creator is admin
	}

	err = s.participantRepo.AddParticipant(creatorParticipant)
	if err != nil {
		return nil, fmt.Errorf("failed to add creator as participant: %w", err)
	}

	// Add other participants
	for _, userID := range req.UserIDs {
		// Skip if user is already added (creator)
		if userID == req.CreatedBy {
			continue
		}

		participant := &models.ConversationParticipant{
			ConversationID: conversation.ID,
			UserID:         userID,
			IsAdmin:        false, // Other users are not admin
		}

		err := s.participantRepo.AddParticipant(participant)
		if err != nil {
			return nil, fmt.Errorf("failed to add participant %s: %w", userID, err)
		}
	}

	// Get participants for response
	participants, err := s.participantRepo.GetParticipantsByConversationID(conversation.ID)
	if err != nil {
		return nil, fmt.Errorf("failed to get participants: %w", err)
	}

	// Convert to response format
	users := make([]models.User, 0, len(participants))
	for _, p := range participants {
		if p.User != nil {
			users = append(users, *p.User)
		}
	}

	response := &models.ConversationResponse{
		ID:           conversation.ID,
		Name:         conversation.Name,
		Type:         conversation.Type,
		CreatedBy:    conversation.CreatedBy,
		CreatedAt:    conversation.CreatedAt,
		UpdatedAt:    conversation.UpdatedAt,
		Participants: users,
	}

	return response, nil
}

// GetConversationsByUserID gets all conversations for a user
func (s *ChatService) GetConversationsByUserID(userID uuid.UUID) ([]*models.ConversationResponse, error) {
	conversations, err := s.conversationRepo.GetConversationsByUserID(userID)
	if err != nil {
		return nil, fmt.Errorf("failed to get conversations: %w", err)
	}

	responses := make([]*models.ConversationResponse, 0, len(conversations))
	for _, conv := range conversations {
		// Get last message
		lastMessage, _ := s.messageRepo.GetLastMessageByConversationID(conv.ID)

		// Get participants
		participants, _ := s.participantRepo.GetParticipantsByConversationID(conv.ID)
		users := make([]models.User, 0, len(participants))
		for _, p := range participants {
			if p.User != nil {
				users = append(users, *p.User)
			}
		}

		response := &models.ConversationResponse{
			ID:           conv.ID,
			Name:         conv.Name,
			Type:         conv.Type,
			CreatedBy:    conv.CreatedBy,
			CreatedAt:    conv.CreatedAt,
			UpdatedAt:    conv.UpdatedAt,
			LastMessage:  lastMessage,
			Participants: users,
		}

		responses = append(responses, response)
	}

	return responses, nil
}

// GetConversationByID gets a conversation by ID
func (s *ChatService) GetConversationByID(conversationID, userID uuid.UUID) (*models.ConversationResponse, error) {
	// Check if user is participant
	isParticipant, err := s.participantRepo.IsParticipant(conversationID, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to check participant status: %w", err)
	}

	if !isParticipant {
		return nil, errors.New("user is not a participant in this conversation")
	}

	conversation, err := s.conversationRepo.GetConversationByID(conversationID)
	if err != nil {
		return nil, fmt.Errorf("failed to get conversation: %w", err)
	}

	// Get participants
	participants, err := s.participantRepo.GetParticipantsByConversationID(conversationID)
	if err != nil {
		return nil, fmt.Errorf("failed to get participants: %w", err)
	}

	// Get last message
	lastMessage, _ := s.messageRepo.GetLastMessageByConversationID(conversationID)

	// Convert to response format
	users := make([]models.User, 0, len(participants))
	for _, p := range participants {
		if p.User != nil {
			users = append(users, *p.User)
		}
	}

	response := &models.ConversationResponse{
		ID:           conversation.ID,
		Name:         conversation.Name,
		Type:         conversation.Type,
		CreatedBy:    conversation.CreatedBy,
		CreatedAt:    conversation.CreatedAt,
		UpdatedAt:    conversation.UpdatedAt,
		LastMessage:  lastMessage,
		Participants: users,
	}

	return response, nil
}

// SendMessage sends a message to a conversation
func (s *ChatService) SendMessage(req *models.SendMessageRequest, senderID uuid.UUID) (*models.MessageResponse, error) {
	// Check if user is participant
	isParticipant, err := s.participantRepo.IsParticipant(req.ConversationID, senderID)
	if err != nil {
		return nil, fmt.Errorf("failed to check participant status: %w", err)
	}

	if !isParticipant {
		return nil, errors.New("user is not a participant in this conversation")
	}

	// Create message
	message := &models.Message{
		ConversationID: req.ConversationID,
		SenderID:       senderID,
		Content:        req.Content,
		MessageType:    req.MessageType,
		IsRead:         false,
	}

	err = s.messageRepo.CreateMessage(message)
	if err != nil {
		return nil, fmt.Errorf("failed to create message: %w", err)
	}

	// Get sender info
	sender, err := s.userRepo.GetUserByID(senderID)
	if err != nil {
		return nil, fmt.Errorf("failed to get sender info: %w", err)
	}

	response := &models.MessageResponse{
		ID:             message.ID,
		ConversationID: message.ConversationID,
		SenderID:       message.SenderID,
		Content:        message.Content,
		MessageType:    message.MessageType,
		IsRead:         message.IsRead,
		CreatedAt:      message.CreatedAt,
		UpdatedAt:      message.UpdatedAt,
		SenderName:     sender.DisplayName,
	}

	return response, nil
}

// GetMessagesByConversationID gets messages for a conversation
func (s *ChatService) GetMessagesByConversationID(conversationID, userID uuid.UUID, limit, offset int) ([]*models.MessageResponse, error) {
	// Check if user is participant
	isParticipant, err := s.participantRepo.IsParticipant(conversationID, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to check participant status: %w", err)
	}

	if !isParticipant {
		return nil, errors.New("user is not a participant in this conversation")
	}

	messages, err := s.messageRepo.GetMessagesByConversationID(conversationID, limit, offset)
	if err != nil {
		return nil, fmt.Errorf("failed to get messages: %w", err)
	}

	responses := make([]*models.MessageResponse, 0, len(messages))
	for _, msg := range messages {
		response := &models.MessageResponse{
			ID:             msg.ID,
			ConversationID: msg.ConversationID,
			SenderID:       msg.SenderID,
			Content:        msg.Content,
			MessageType:    msg.MessageType,
			IsRead:         msg.IsRead,
			CreatedAt:      msg.CreatedAt,
			UpdatedAt:      msg.UpdatedAt,
			SenderName:     msg.SenderName,
		}

		responses = append(responses, response)
	}

	return responses, nil
}

// MarkMessageAsRead marks a message as read
func (s *ChatService) MarkMessageAsRead(messageID, userID uuid.UUID) error {
	message, err := s.messageRepo.GetMessageByID(messageID)
	if err != nil {
		return fmt.Errorf("failed to get message: %w", err)
	}

	// Check if user is participant in the conversation
	isParticipant, err := s.participantRepo.IsParticipant(message.ConversationID, userID)
	if err != nil {
		return fmt.Errorf("failed to check participant status: %w", err)
	}

	if !isParticipant {
		return errors.New("user is not a participant in this conversation")
	}

	err = s.messageRepo.MarkMessageAsRead(messageID)
	if err != nil {
		return fmt.Errorf("failed to mark message as read: %w", err)
	}

	return nil
}
