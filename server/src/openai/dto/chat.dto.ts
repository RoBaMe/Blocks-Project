import { z } from 'zod';

export const chatMessageSchema = z.object({
    role: z.enum(['user', 'assistant', 'system']),
    content: z.string(),
});

export const chatRequestSchema = z.object({
    message: z.string().min(1, 'Message cannot be empty'),
    conversationHistory: z.array(chatMessageSchema).optional().default([]),
});

export type ChatMessage = z.infer<typeof chatMessageSchema>;
export type ChatRequest = z.infer<typeof chatRequestSchema>;
