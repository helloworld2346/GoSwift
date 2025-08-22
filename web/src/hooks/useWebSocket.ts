import { useEffect, useRef, useState, useCallback } from "react";
import { useAuthStore } from "@/stores/auth";
import { useChatStore } from "@/stores/chat";
import type {
  WebSocketMessage,
  Message,
  WebSocketMessageData,
} from "@/types/chat";

interface MessageData {
  content?: string;
  conversation_id?: string;
  message_type?: string;
}

interface ErrorData {
  error?: {
    message: string;
    code?: string;
  };
}

export const useWebSocket = (conversationId?: string) => {
  const { token } = useAuthStore();
  const { addMessage, setError, clearError } = useChatStore();
  const ws = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setWsError] = useState<string | null>(null);

  const connect = useCallback(() => {
    if (!token) return;

    try {
      // Connect to WebSocket with authentication
      const wsUrl = `ws://localhost:8080/ws?token=${token}`;
      ws.current = new WebSocket(wsUrl);

      ws.current.onopen = () => {
        console.log("WebSocket connected");
        setIsConnected(true);
        setWsError(null);
        clearError();
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
                    id: Date.now().toString(), // Temporary ID
                    conversation_id: messageData.conversation_id,
                    content: messageData.content,
                    sender_id: message.user_id || "",
                    sender_name: message.username || "",
                    message_type:
                      (messageData.message_type as "text" | "image" | "file") ||
                      "text",
                    created_at: new Date(
                      (message.timestamp || Date.now() / 1000) * 1000
                    ).toISOString(),
                    is_read: false,
                  };

                  // Add message to chat store
                  addMessage(newMessage);
                }
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
        setWsError("Connection lost");
      };

      ws.current.onerror = (error) => {
        console.error("WebSocket error:", error);
        setWsError("WebSocket connection failed");
        setIsConnected(false);
      };
    } catch (err) {
      console.error("Error connecting to WebSocket:", err);
      setWsError("Failed to connect to WebSocket");
    }
  }, [token, addMessage, setError, clearError]);

  const disconnect = useCallback(() => {
    if (ws.current) {
      ws.current.close();
      ws.current = null;
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

  // Auto-reconnect when conversation changes
  useEffect(() => {
    if (conversationId && token) {
      connect();
    }
    return () => disconnect();
  }, [conversationId, token, connect, disconnect]);

  return {
    isConnected,
    sendMessage,
    error,
    connect,
    disconnect,
  };
};
