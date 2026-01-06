import { Controller, Post, Get, Body, HttpCode, HttpStatus, UsePipes, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { createMessageSchema } from './dto/create-message.dto';
import type { CreateMessageDto } from './dto/create-message.dto';
import { CreateMessageDto as CreateMessageDtoSwagger, MessageResponseDto, ChatHistoryResponseDto } from './dto/create-message.dto.swagger';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { Request as ExpressRequest } from 'express';
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
    @HttpCode(HttpStatus.CREATED)
    @UsePipes(new ZodValidationPipe(createMessageSchema))
    @ApiOperation({ summary: 'Add a message to chat' })
    @ApiBody({ type: CreateMessageDtoSwagger })
    @ApiResponse({
        status: 201,
        description: 'Message created successfully',
        type: MessageResponseDto,
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 400, description: 'Validation failed' })
    async createMessage(
        @Body() createMessageDto: CreateMessageDto,
        @Request() req: AuthenticatedRequest,
    ): Promise<MessageResponseDto> {
        await this.chatService.createMessage(req.user.sub, createMessageDto, 'user');
        const botResult = await this.openaiService.runTools(createMessageDto.content);
        const botMessage = await this.chatService.createMessage(req.user.sub, { content: botResult }, 'bot');
        return botMessage;
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
