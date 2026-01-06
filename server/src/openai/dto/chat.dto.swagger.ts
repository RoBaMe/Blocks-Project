import { ApiProperty } from '@nestjs/swagger';

export class ChatMessageDto {
    @ApiProperty({ enum: ['user', 'assistant', 'system'], example: 'user' })
    role: 'user' | 'assistant' | 'system';

    @ApiProperty({ example: 'Hello, how are you?' })
    content: string;
}

export class ChatRequestDto {
    @ApiProperty({ example: 'What is the capital of France?' })
    message: string;

    @ApiProperty({ type: [ChatMessageDto], required: false, default: [] })
    conversationHistory?: ChatMessageDto[];
}

export class ChatResponseDto {
    @ApiProperty({ example: 'The capital of France is Paris.' })
    response: string;
}

export class TestRequestDto {
    @ApiProperty({ example: 'Test input message', description: 'Input string to test OpenAI connection' })
    input: string;
}

export class TestResponseDto {
    @ApiProperty({ example: 'hhh', description: 'Test result from OpenAI' })
    result: string;
}
