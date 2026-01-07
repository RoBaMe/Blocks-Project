import { Controller, Post, Get, Body, HttpCode, HttpStatus, UsePipes, UseGuards, Request, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { createMessageSchema } from './dto/create-message.dto';
import type { CreateMessageDto } from './dto/create-message.dto';
import { CreateMessageDto as CreateMessageDtoSwagger, MessageResponseDto, ChatHistoryResponseDto } from './dto/create-message.dto.swagger';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { Request as ExpressRequest, Response } from 'express';
import { OpenAIService } from 'src/openai/openai.service';

interface AuthenticatedRequest extends ExpressRequest {
    user: {
        sub: string;
        email: string;
    };
}

@ApiTags('chat')
@Controller('chat')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ChatController {
    constructor(private readonly chatService: ChatService, private readonly openaiService: OpenAIService) {}

    @Post('message')
    @UsePipes(new ZodValidationPipe(createMessageSchema))
    @ApiOperation({ summary: 'Add a message to chat and stream bot response' })
    @ApiBody({ type: CreateMessageDtoSwagger })
    @ApiResponse({
        status: 200,
        description: 'Streaming response',
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 400, description: 'Validation failed' })
    async createMessage(
        @Body() createMessageDto: CreateMessageDto,
        @Request() req: AuthenticatedRequest,
        @Res() res: Response,
    ): Promise<void> {
        await this.chatService.createMessage(req.user.sub, createMessageDto, 'user');

        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        try {
            const botResult = await this.openaiService.runTools(createMessageDto.content);
            const chunkSize = 10;
            let accumulatedContent = '';

            for (let index = 0; index < botResult.length; index += chunkSize) {
                const chunk = botResult.slice(index, index + chunkSize);
                accumulatedContent += chunk;

                res.write(`data: ${JSON.stringify({ type: 'chunk', content: chunk })}\n\n`);
                
                await new Promise((resolve) => setTimeout(resolve, 300));
            }

            const botMessage = await this.chatService.createMessage(req.user.sub, { content: botResult }, 'bot');
            res.write(`data: ${JSON.stringify({ type: 'complete', message: botMessage })}\n\n`);
            res.end();
        } catch (error) {
            res.write(`data: ${JSON.stringify({ type: 'error', message: error instanceof Error ? error.message : 'An error occurred' })}\n\n`);
            res.end();
        }
    }

    @Get('history')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Get all chat history for the current user' })
    @ApiResponse({
        status: 200,
        description: 'Chat history retrieved successfully',
        type: ChatHistoryResponseDto,
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async getChatHistory(@Request() req: AuthenticatedRequest): Promise<ChatHistoryResponseDto> {
        const messages = await this.chatService.getChatHistory(req.user.sub);
        return { messages };
    }
}
