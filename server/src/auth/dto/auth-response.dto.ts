import { ApiProperty } from '@nestjs/swagger';

class UserDto {
    @ApiProperty({ example: '1234567890' })
    id: string;

    @ApiProperty({ example: 'John Doe' })
    name: string;

    @ApiProperty({ example: 'john@example.com' })
    email: string;

    @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
    createdAt: Date;
}

export class AuthResponseDto {
    @ApiProperty({ type: UserDto })
    user: UserDto;

    @ApiProperty({ example: 'User created successfully' })
    message: string;
}
