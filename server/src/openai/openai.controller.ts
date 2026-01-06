import { Controller, Post, Body, HttpCode, HttpStatus, UsePipes, UseGuards, Request, HttpException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { OpenAIService } from './openai.service';
import { chatRequestSchema } from './dto/chat.dto';
import type { ChatRequest } from './dto/chat.dto';
import { testRequestSchema } from './dto/test.dto';
import type { TestRequest } from './dto/test.dto';
import { ChatRequestDto, ChatResponseDto, TestRequestDto, TestResponseDto } from './dto/chat.dto.swagger';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { Request as ExpressRequest } from 'express';

interface AuthenticatedRequest extends ExpressRequest {
    user: {
        sub: string;
        email: string;
    };
}

@ApiTags('openai')
@Controller('openai')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class OpenAIController {
    constructor(private readonly openaiService: OpenAIService) {}

    @Post('test')
    @HttpCode(HttpStatus.OK)
    @UsePipes(new ZodValidationPipe(testRequestSchema))
    @ApiOperation({ summary: 'Test OpenAI connection' })
    @ApiBody({ type: TestRequestDto })
    @ApiResponse({
        status: 200,
        description: 'Test completed',
        type: TestResponseDto,
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 400, description: 'Validation failed' })
    async test(@Body() testRequest: TestRequest, @Request() req: AuthenticatedRequest): Promise<TestResponseDto> {
        try {
            const result = await this.openaiService.runTools(testRequest.input);
            return { result };
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
