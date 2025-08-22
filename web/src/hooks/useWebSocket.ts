import { useEffect, useRef, useState, useCallback } from "react";
import { useAuthStore } from "@/stores/auth";
import type { WebSocketMessage, Message } from "@/types/chat";

export const useWebSocket = (conversationId?: string) => {
  const { token } = useAuthStore();
  const ws = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);

  const connect = useCallback(() => {
    if (!token) return;

    try {
      // Connect to WebSocket with authentication
      const wsUrl = `ws://localhost:8080/ws?token=${token}`;
      ws.current = new WebSocket(wsUrl);

      ws.current.onopen = () => {
        console.log("WebSocket connected");
        setIsConnected(true);
        setError(null);
      };

      ws.current.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);

          switch (message.type) {
            case "message":
              if (
                message.data.message &&
                message.data.message.conversation_id === conversationId
              ) {
                setMessages((prev) => [...prev, message.data.message!]);
              }
              break;
            case "error":
              if (message.data.error) {
                setError(message.data.error.message);
              }
              break;
            default:
              console.log("Received message:", message);
          }
        } catch (err) {
          console.error("Error parsing WebSocket message:", err);
        }
      };

      ws.current.onclose = () => {
        console.log("WebSocket disconnected");
        setIsConnected(false);
      };

      ws.current.onerror = (error) => {
        console.error("WebSocket error:", error);
        setError("WebSocket connection failed");
        setIsConnected(false);
      };
    } catch (err) {
      console.error("Error connecting to WebSocket:", err);
      setError("Failed to connect to WebSocket");
    }
  }, [token, conversationId]);

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

  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  return {
    isConnected,
    messages,
    error,
    sendMessage,
    connect,
    disconnect,
  };
};
