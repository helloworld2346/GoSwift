export interface User {
  id: string;
  email: string;
  display_name: string;
  avatar_url: string;
  is_online: boolean;
  last_seen: string;
  created_at: string;
}

export interface Conversation {
  id: string;
  name: string;
  type: "direct" | "group";
  created_by: string;
  created_at: string;
  updated_at: string;
  last_message?: Message;
  participants: User[];
}

export interface Message {
  id: string;
  conversation_id: string;
  content: string;
  sender_id: string;
  sender_name: string;
  message_type: "text" | "image" | "file";
  is_read: boolean;
  created_at: string;
}

export interface WebSocketMessageData {
  message?: Message;
  conversation?: Conversation;
  error?: {
    message: string;
    code?: string;
  };
  content?: string;
  conversation_id?: string;
  message_type?: string;
}

export interface WebSocketMessage {
  type: "message" | "error" | "conversation" | "user_status" | "auth_success";
  content?: string;
  user_id?: string;
  username?: string;
  timestamp?: number;
  data?: WebSocketMessageData;
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
