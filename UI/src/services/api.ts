const API_BASE_URL = 'http://localhost:3000';

export interface SignUpRequest {
    name: string;
    email: string;
    password: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    createdAt: string;
}

export interface AuthResponse {
    user: User;
    message: string;
}

export interface ApiError {
    message: string;
    errors?: Array<{
        path: string;
        message: string;
    }>;
}

async function handleResponse<T>(response: Response): Promise<T> {
    const data = await response.json();

    if (!response.ok) {
        const error: ApiError = {
            message: data.message || 'An error occurred',
            errors: data.errors,
        };
        throw error;
    }

    return data;
}

export const authApi = {
    async signUp(data: SignUpRequest): Promise<AuthResponse> {
        const response = await fetch(`${API_BASE_URL}/auth/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(data),
        });

        return handleResponse<AuthResponse>(response);
    },

    async login(data: LoginRequest): Promise<AuthResponse> {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(data),
        });

        return handleResponse<AuthResponse>(response);
    },

    async getCurrentUser(): Promise<{ user: User }> {
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
            method: 'GET',
            credentials: 'include',
        });

        return handleResponse<{ user: User }>(response);
    },
};
