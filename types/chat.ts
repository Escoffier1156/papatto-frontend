import { UserProfile } from './user';

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: number; // 発行時のエポックミリ秒
  expiresAt: number; // timestamp + 12時間
}

export interface ChatRoom {
  partner: UserProfile;
  messages: ChatMessage[];
  lastMessage?: string;
  lastMessageTime?: number;
  unreadCount: number;
}
