import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
    @ApiProperty({
        description: 'User email address',
        example: 'john@example.com',
    })
    email: string;

    @ApiProperty({
        description: 'User password',
        example: 'password123',
    })
    password: string;
}
