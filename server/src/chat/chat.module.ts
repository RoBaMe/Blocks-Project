import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ChatRepository } from './chat.repository';
import { AuthModule } from '../auth/auth.module';
import { OpenAIService } from 'src/openai/openai.service';

@Module({
    imports: [AuthModule],
    controllers: [ChatController],
    providers: [ChatService, ChatRepository, OpenAIService],
    exports: [ChatService],
})
export class ChatModule {}
