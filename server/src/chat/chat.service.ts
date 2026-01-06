import { Injectable } from '@nestjs/common';
import { ChatRepository } from './chat.repository';
import { ChatMessage, ChatSide } from './entities/chat-message.entity';
import type { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class ChatService {
    constructor(private readonly chatRepository: ChatRepository) {}

    async createMessage(userId: string, createMessageDto: CreateMessageDto, side: ChatSide): Promise<ChatMessage> {
        return this.chatRepository.create({
            userId,
            side,
            content: createMessageDto.content,
        });
    }

    async getChatHistory(userId: string): Promise<ChatMessage[]> {
        return this.chatRepository.findByUserId(userId);
    }
}
