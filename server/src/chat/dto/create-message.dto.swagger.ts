import { ApiProperty } from '@nestjs/swagger';

export class CreateMessageDto {
    @ApiProperty({ example: 'Hello, how are you?', description: 'The message content' })
    content: string;
}

export class MessageResponseDto {
    @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
    id: string;

    @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
    userId: string;

    @ApiProperty({ enum: ['user', 'bot'], example: 'user' })
    side: 'user' | 'bot';

    @ApiProperty({ example: 'Hello, how are you?' })
    content: string;

    @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
    timestamp: string;
}

export class ChatHistoryResponseDto {
    @ApiProperty({ type: [MessageResponseDto] })
    messages: MessageResponseDto[];
}
