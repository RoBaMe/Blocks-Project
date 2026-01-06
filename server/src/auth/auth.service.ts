import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersRepository } from '../users/users.repository';
import { User } from '../users/entities/user.entity';
import type { SignUpDto } from './dto/signup.dto';
import type { LoginDto } from './dto/login.dto';

export interface AuthResponse {
    user: Omit<User, 'password'>;
    message: string;
    token?: string;
}

@Injectable()
export class AuthService {
    constructor(
        private readonly usersRepository: UsersRepository,
        private readonly jwtService: JwtService,
    ) {}

    async signUp(signUpDto: SignUpDto): Promise<AuthResponse> {
        const { name, email, password } = signUpDto;

        // Check if user already exists
        const existingUser = await this.usersRepository.findByEmail(email);
        if (existingUser) {
            throw new ConflictException('User with this email already exists');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await this.usersRepository.create({
            name,
            email,
            password: hashedPassword,
        });

        // Return user without password
        const { password: _, ...userWithoutPassword } = user;

        return {
            user: userWithoutPassword,
            message: 'User created successfully',
        };
    }

    async login(loginDto: LoginDto): Promise<AuthResponse> {
        const { email, password } = loginDto;

        // Find user by email
        const user = await this.usersRepository.findByEmail(email);
        if (!user) {
            throw new UnauthorizedException('Invalid email or password');
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid email or password');
        }

        // Generate JWT token
        const payload = { sub: user.id, email: user.email };
        const token = this.jwtService.sign(payload);

        // Return user without password
        const { password: _, ...userWithoutPassword } = user;

        return {
            user: userWithoutPassword,
            message: 'Login successful',
            token,
        };
    }

    async validateUser(userId: string): Promise<Omit<User, 'password'> | null> {
        const user = await this.usersRepository.findById(userId);
        if (!user) {
            return null;
        }
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
}
