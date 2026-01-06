import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { OpenAIModule } from './openai/openai.module';
import { ChatModule } from './chat/chat.module';

@Module({
    controllers: [AppController],
    imports: [AuthModule, OpenAIModule, ChatModule],
})
export class AppModule {}
