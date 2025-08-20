package handlers

import (
	"net/http"

	"goswift/internal/database"
	"goswift/pkg/utils"

	"github.com/gin-gonic/gin"
)

type HealthHandler struct {
	db     *database.DB
	config *utils.Config
}

func NewHealthHandler(db *database.DB, config *utils.Config) *HealthHandler {
	return &HealthHandler{
		db:     db,
		config: config,
	}
}

// @Summary Health check
// @Description Get server health status
// @Tags health
// @Accept json
// @Produce json
// @Success 200 {object} HealthResponse
// @Router /health [get]
func (h *HealthHandler) HealthCheck(c *gin.Context) {
	// Check database health
	dbStatus := "ok"
	if err := h.db.HealthCheck(); err != nil {
		dbStatus = "error"
	}

	response := HealthResponse{
		Status:   "ok",
		Message:  "GoSwift server is running!",
		Version:  "1.0.0",
		Env:      h.config.Env,
		Database: dbStatus,
	}

	c.JSON(http.StatusOK, response)
}

type HealthResponse struct {
	Status   string `json:"status"`
	Message  string `json:"message"`
	Version  string `json:"version"`
	Env      string `json:"env"`
	Database string `json:"database"`
}
