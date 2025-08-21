package websocket

import (
	"net/http"

	"github.com/gorilla/websocket"
)

// Upgrader configuration
var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		// In development, allow all origins
		// In production, you should check specific origins
		return true
	},
}

// UpgradeConnection upgrades HTTP connection to WebSocket
func UpgradeConnection(w http.ResponseWriter, r *http.Request) (*websocket.Conn, error) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		return nil, err
	}
	return conn, nil
}
