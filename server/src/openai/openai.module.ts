import { Module } from '@nestjs/common';
import { OpenAIService } from './openai.service';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [AuthModule],
    providers: [OpenAIService],
    exports: [OpenAIService],
})
export class OpenAIModule {}
