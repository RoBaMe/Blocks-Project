import {
    Controller,
    Post,
    Body,
    HttpCode,
    HttpStatus,
    UsePipes,
    Res,
    Get,
    UseGuards,
    Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import type { Response } from 'express';
import { AuthService, AuthResponse } from './auth.service';
import { User } from '../users/entities/user.entity';
import { signUpSchema } from './dto/signup.dto';
import { loginSchema } from './dto/login.dto';
import type { SignUpDto } from './dto/signup.dto';
import type { LoginDto } from './dto/login.dto';
import { SignUpDto as SignUpDtoSwagger } from './dto/signup.dto.swagger';
import { LoginDto as LoginDtoSwagger } from './dto/login.dto.swagger';
import { AuthResponseDto } from './dto/auth-response.dto';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('signup')
    @HttpCode(HttpStatus.CREATED)
    @UsePipes(new ZodValidationPipe(signUpSchema))
    @ApiOperation({ summary: 'Register a new user' })
    @ApiBody({ type: SignUpDtoSwagger })
    @ApiResponse({
        status: 201,
        description: 'User successfully created',
        type: AuthResponseDto,
    })
    @ApiResponse({ status: 409, description: 'User with this email already exists' })
    @ApiResponse({ status: 400, description: 'Validation failed' })
    async signUp(@Body() signUpDto: SignUpDto): Promise<AuthResponse> {
        return this.authService.signUp(signUpDto);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @UsePipes(new ZodValidationPipe(loginSchema))
    @ApiOperation({ summary: 'Login user' })
    @ApiBody({ type: LoginDtoSwagger })
    @ApiResponse({
        status: 200,
        description: 'Login successful',
        type: AuthResponseDto,
    })
    @ApiResponse({ status: 401, description: 'Invalid email or password' })
    @ApiResponse({ status: 400, description: 'Validation failed' })
    async login(
        @Body() loginDto: LoginDto,
        @Res({ passthrough: true }) res: Response,
    ): Promise<AuthResponse> {
        const result = await this.authService.login(loginDto);
        const { token, ...responseWithoutToken } = result;

        res.cookie('auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: TWENTY_FOUR_HOURS,
        });

        return responseWithoutToken;
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Get current user' })
    @ApiResponse({
        status: 200,
        description: 'Current user information',
        type: AuthResponseDto,
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async getCurrentUser(@Request() req: any): Promise<{ user: Omit<User, 'password'> }> {
        const user = await this.authService.validateUser(req.user.sub);
        if (!user) {
            throw new Error('User not found');
        }
        return { user };
    }

    @Post('logout')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Logout user' })
    @ApiResponse({
        status: 200,
        description: 'Logout successful',
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async logout(@Res({ passthrough: true }) res: Response): Promise<{ message: string }> {
        res.clearCookie('auth_token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
        });
        return { message: 'Logout successful' };
    }
}
