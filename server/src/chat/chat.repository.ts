import { Injectable, OnModuleInit } from '@nestjs/common';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { ChatMessage } from './entities/chat-message.entity';

interface DatabaseData {
    chats: Record<string, ChatMessage[]>;
}

@Injectable()
export class ChatRepository implements OnModuleInit {
    private readonly dataFilePath = join(process.cwd(), 'data', 'chat.json');
    private db: Low<DatabaseData>;

    async onModuleInit() {
        await this.initializeDatabase();
    }

    private async initializeDatabase(): Promise<void> {
        const adapter = new JSONFile<DatabaseData>(this.dataFilePath);
        this.db = new Low<DatabaseData>(adapter, { chats: {} });

        await this.db.read();

        if (!this.db.data) {
            this.db.data = { chats: {} };
            await this.db.write();
        }
    }

    private get chats(): Record<string, ChatMessage[]> {
        return this.db.data?.chats || {};
    }

    async create(message: Omit<ChatMessage, 'id' | 'timestamp'>): Promise<ChatMessage> {
        const newMessage: ChatMessage = {
            ...message,
            id: uuidv4(),
            timestamp: new Date().toISOString(),
        };

        if (!this.db.data.chats[message.userId]) {
            this.db.data.chats[message.userId] = [];
        }

        this.db.data.chats[message.userId].push(newMessage);
        await this.db.write();
        return newMessage;
    }

    async findByUserId(userId: string): Promise<ChatMessage[]> {
        return this.chats[userId] || [];
    }

    async findAll(): Promise<ChatMessage[]> {
        const allMessages: ChatMessage[] = [];
        for (const messages of Object.values(this.chats)) {
            allMessages.push(...messages);
        }
        return allMessages;
    }
}
