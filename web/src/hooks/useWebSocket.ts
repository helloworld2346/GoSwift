import { useEffect, useRef, useState, useCallback } from "react";
import { useAuthStore } from "@/stores/auth";
import { useChatStore } from "@/stores/chat";
import type { WebSocketMessage, Message } from "@/types/chat";

interface MessageData {
  id?: string;
  content?: string;
  conversation_id?: string;
  message_type?: string;
  user_id?: string;
  is_online?: boolean;
}

interface ErrorData {
  error?: {
    message: string;
    code?: string;
  };
}

export const useWebSocket = (conversationId?: string) => {
  const { token, user } = useAuthStore();
  const { addMessage, setError, clearError, updateParticipantStatus } =
    useChatStore();
  const ws = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setWsError] = useState<string | null>(null);
  const heartbeatRef = useRef<NodeJS.Timeout | null>(null);

  const connect = useCallback(() => {
    if (!token) return;

    // Check if network is offline before attempting connection
    if (!navigator.onLine) {
      console.log("Network is offline, not attempting WebSocket connection");
      setIsConnected(false);
      setWsError("Network disconnected");
      return;
    }

    try {
      // Connect to WebSocket with authentication
      const wsUrl = `ws://localhost:8080/ws?token=${token}`;
      ws.current = new WebSocket(wsUrl);

      // Set connection timeout
      const connectionTimeout = setTimeout(() => {
        if (ws.current && ws.current.readyState === WebSocket.CONNECTING) {
          console.error("WebSocket connection timeout");
          setWsError("Connection timeout");
          setIsConnected(false);
          ws.current.close();
        }
      }, 10000); // 10 seconds timeout

      ws.current.onopen = () => {
        console.log("WebSocket connected");
        clearTimeout(connectionTimeout); // Clear timeout on successful connection
        setIsConnected(true);
        setWsError(null);
        clearError();

        // Send authentication message
        if (user) {
          const authMessage = {
            type: "auth",
            user_id: user.id,
            username: user.display_name,
          };
          console.log("Sending auth message:", authMessage);
          ws.current?.send(JSON.stringify(authMessage));
        }

        // Start heartbeat to detect network issues
        heartbeatRef.current = setInterval(() => {
          if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            try {
              ws.current.send(JSON.stringify({ type: "ping" }));
            } catch (error) {
              console.log("Heartbeat failed, connection lost");
              setIsConnected(false);
              setWsError("Connection lost");
            }
          }
        }, 30000); // Send ping every 30 seconds
      };

      ws.current.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);

          switch (message.type) {
            case "message":
              // Handle the backend message format
              if (message.data && typeof message.data === "object") {
                const messageData = message.data as MessageData;
                if (messageData.content && messageData.conversation_id) {
                  // Create a Message object from the WebSocket data
                  const newMessage: Message = {
                    id: messageData.id || `${Date.now()}-${Math.random()}`, // Use backend ID or generate unique
                    conversation_id: messageData.conversation_id,
                    content: messageData.content,
                    sender_id: message.user_id || "",
                    sender_name: message.username || "",
                    message_type:
                      (messageData.message_type as "text" | "image" | "file") ||
                      "text",
                    created_at: message.timestamp
                      ? new Date(message.timestamp * 1000).toISOString() // Use backend timestamp
                      : new Date().toISOString(), // Fallback to current time
                    is_read: false,
                  };

                  // Add message to chat store only if it belongs to the current conversation
                  addMessage(newMessage);
                }
              }
              break;
            case "user_status":
              // Handle user status updates (online/offline)
              if (message.data && typeof message.data === "object") {
                const statusData = message.data as MessageData;
                if (
                  statusData.user_id !== undefined &&
                  statusData.is_online !== undefined
                ) {
                  console.log(
                    "User status update:",
                    statusData.user_id,
                    "is",
                    statusData.is_online ? "online" : "offline"
                  );
                  console.log("Full status message:", message);
                  // Update participant status in chat store
                  updateParticipantStatus(
                    statusData.user_id,
                    statusData.is_online
                  );
                } else {
                  console.log("Invalid status data:", statusData);
                }
              } else {
                console.log("No data in user_status message:", message);
              }
              break;
            case "error":
              if (message.data && typeof message.data === "object") {
                const errorData = message.data as ErrorData;
                setWsError(errorData.error?.message || "WebSocket error");
                setError(errorData.error?.message || "WebSocket error");
              }
              break;
            case "auth_success":
              console.log("WebSocket authentication successful");
              break;
            default:
              console.log("Received message:", message);
          }
        } catch (err) {
          console.error("Error parsing WebSocket message:", err);
          setWsError("Failed to parse message");
        }
      };

      ws.current.onclose = () => {
        console.log("WebSocket disconnected");
        setIsConnected(false);
        setWsError("Connection lost - trying to reconnect...");

        // Clear heartbeat
        if (heartbeatRef.current) {
          clearInterval(heartbeatRef.current);
          heartbeatRef.current = null;
        }

        // Try to reconnect after a delay (only if network is online)
        setTimeout(() => {
          if (token && navigator.onLine) {
            console.log("Attempting to reconnect...");
            connect();
          } else if (!navigator.onLine) {
            console.log("Network is offline, not attempting reconnect");
            setIsConnected(false);
            setWsError("Network disconnected");
          }
        }, 3000); // Wait 3 seconds before reconnecting
      };

      ws.current.onerror = (error) => {
        // WebSocket error events can be triggered even on successful connections
        // Only treat as real error if connection fails completely
        console.warn("WebSocket error event:", error);

        // Only set error if not already connected
        if (!isConnected) {
          setWsError("Connection failed");
        }
      };
    } catch (err) {
      console.error("Error connecting to WebSocket:", err);
      setWsError("Failed to connect to WebSocket");
    }
  }, [token, addMessage, setError, clearError, updateParticipantStatus, user]);

  const disconnect = useCallback(() => {
    if (ws.current) {
      ws.current.close();
      ws.current = null;
    }
    if (heartbeatRef.current) {
      clearInterval(heartbeatRef.current);
      heartbeatRef.current = null;
    }
    setIsConnected(false);
  }, []);

  const sendMessage = useCallback(
    (content: string) => {
      if (!ws.current || !isConnected || !conversationId) {
        throw new Error("WebSocket not connected or no conversation selected");
      }

      const message = {
        type: "message",
        data: {
          conversation_id: conversationId,
          content,
          message_type: "text" as const,
        },
      };

      ws.current.send(JSON.stringify(message));
    },
    [isConnected, conversationId]
  );

  // Auto-reconnect when conversation changes or when token is available
  useEffect(() => {
    if (token) {
      connect();
    }
    return () => disconnect();
  }, [token, connect, disconnect]);

  // Listen for network status changes
  useEffect(() => {
    const handleOnline = () => {
      console.log("Network is online");
      if (token && !isConnected) {
        connect();
      }
    };

    const handleOffline = () => {
      console.log("Network is offline");
      setIsConnected(false);
      setWsError("Network disconnected");

      // Clear any existing connection
      if (ws.current) {
        ws.current.close();
        ws.current = null;
      }
      if (heartbeatRef.current) {
        clearInterval(heartbeatRef.current);
        heartbeatRef.current = null;
      }
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [token, isConnected, connect]);

  return {
    isConnected,
    sendMessage,
    error,
    connect,
    disconnect,
  };
};
