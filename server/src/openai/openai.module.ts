import { Module } from '@nestjs/common';
import { OpenAIService } from './openai.service';
import { OpenAIController } from './openai.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [AuthModule],
    controllers: [OpenAIController],
    providers: [OpenAIService],
    exports: [OpenAIService],
})
export class OpenAIModule {}
