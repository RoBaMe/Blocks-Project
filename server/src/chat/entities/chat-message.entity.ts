export type ChatSide = 'user' | 'bot';

export interface ChatMessage {
    id: string;
    userId: string;
    side: ChatSide;
    content: string;
    timestamp: string;
}
