package handlers

import (
	"net/http"
	"strings"

	"goswift/internal/service"

	"github.com/gin-gonic/gin"
)

// UserHandler handles user-related HTTP requests
type UserHandler struct {
	userService *service.UserService
}

// NewUserHandler creates a new user handler
func NewUserHandler(userService *service.UserService) *UserHandler {
	return &UserHandler{
		userService: userService,
	}
}

// SearchUsers searches for users by display name or email
// @Summary Search users
// @Description Search users by display name or email
// @Tags users
// @Accept json
// @Produce json
// @Param q query string true "Search query"
// @Success 200 {array} models.User
// @Failure 400 {object} map[string]interface{}
// @Failure 401 {object} map[string]interface{}
// @Failure 500 {object} map[string]interface{}
// @Router /users/search [get]
func (h *UserHandler) SearchUsers(c *gin.Context) {
	query := strings.TrimSpace(c.Query("q"))
	if query == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Search query is required",
		})
		return
	}

	// Get current user ID from context
	currentUserID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "User not authenticated",
		})
		return
	}

	users, err := h.userService.SearchUsers(query, currentUserID.(string))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to search users",
		})
		return
	}

	c.JSON(http.StatusOK, users)
}

// GetOnlineUsers returns list of online users
// @Summary Get online users
// @Description Get list of currently online users
// @Tags users
// @Accept json
// @Produce json
// @Success 200 {array} models.User
// @Failure 401 {object} map[string]interface{}
// @Failure 500 {object} map[string]interface{}
// @Router /users/online [get]
func (h *UserHandler) GetOnlineUsers(c *gin.Context) {
	// Get current user ID from context
	currentUserID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "User not authenticated",
		})
		return
	}

	users, err := h.userService.GetOnlineUsers(currentUserID.(string))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to get online users",
		})
		return
	}

	c.JSON(http.StatusOK, users)
}

// GetUserProfile returns user profile by ID
// @Summary Get user profile
// @Description Get user profile by ID
// @Tags users
// @Accept json
// @Produce json
// @Param id path string true "User ID"
// @Success 200 {object} models.User
// @Failure 400 {object} map[string]interface{}
// @Failure 401 {object} map[string]interface{}
// @Failure 404 {object} map[string]interface{}
// @Failure 500 {object} map[string]interface{}
// @Router /users/{id} [get]
func (h *UserHandler) GetUserProfile(c *gin.Context) {
	userID := c.Param("id")
	if userID == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "User ID is required",
		})
		return
	}

	user, err := h.userService.GetUserByID(userID)
	if err != nil {
		if err.Error() == "user not found" {
			c.JSON(http.StatusNotFound, gin.H{
				"error": "User not found",
			})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to get user profile",
		})
		return
	}

	c.JSON(http.StatusOK, user)
}
