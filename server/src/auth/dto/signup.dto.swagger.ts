import { ApiProperty } from '@nestjs/swagger';

export class SignUpDto {
    @ApiProperty({
        description: 'User name',
        example: 'John Doe',
        minLength: 2,
        maxLength: 50,
    })
    name: string;

    @ApiProperty({
        description: 'User email address',
        example: 'john@example.com',
    })
    email: string;

    @ApiProperty({
        description: 'User password',
        example: 'password123',
        minLength: 6,
        maxLength: 100,
    })
    password: string;
}
