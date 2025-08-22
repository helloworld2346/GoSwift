export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  message_type: "text" | "image" | "file";
  created_at: string;
  sender_name: string;
  is_read: boolean;
}

export interface Conversation {
  id: string;
  name: string;
  type: "direct" | "group";
  created_by: string;
  created_at: string;
  updated_at: string;
  last_message?: Message;
  participants: Array<{
    id: string;
    display_name: string;
    is_online: boolean;
  }>;
}

// WebSocket message types
export interface WebSocketMessageData {
  message?: Message;
  conversation?: Conversation;
  user_status?: {
    user_id: string;
    is_online: boolean;
    last_seen: string;
  };
  error?: {
    message: string;
    code: string;
  };
}

export interface WebSocketMessage {
  type: "message" | "conversation" | "user_status" | "error";
  data: WebSocketMessageData;
}

export interface SendMessageRequest {
  conversation_id: string;
  content: string;
  message_type: "text" | "image" | "file";
}

// Additional types for better type safety
export interface CreateConversationRequest {
  name: string;
  type: "direct" | "group";
  user_ids: string[];
}

export interface ConversationResponse {
  id: string;
  name: string;
  type: "direct" | "group";
  created_by: string;
  created_at: string;
  updated_at: string;
  last_message?: Message;
  participants: Array<{
    id: string;
    display_name: string;
    is_online: boolean;
  }>;
}

export interface MessageResponse {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  message_type: "text" | "image" | "file";
  created_at: string;
  updated_at: string;
  sender_name: string;
  is_read: boolean;
}
