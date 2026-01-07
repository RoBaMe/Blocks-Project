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

export interface ChatMessage {
    id: string;
    userId: string;
    side: 'user' | 'bot';
    content: string;
    timestamp: string;
}

export interface CreateMessageRequest {
    content: string;
}

export interface CreateMessageResponse extends ChatMessage {}

export interface ChatHistoryResponse {
    messages: ChatMessage[];
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

    async logout(): Promise<{ message: string }> {
        const response = await fetch(`${API_BASE_URL}/auth/logout`, {
            method: 'POST',
            credentials: 'include',
        });

        return handleResponse<{ message: string }>(response);
    },
};

export const chatApi = {
    async sendMessage(
        data: CreateMessageRequest,
        onChunk?: (chunk: string) => void,
        onComplete?: (message: CreateMessageResponse) => void,
        onError?: (error: string) => void,
    ): Promise<CreateMessageResponse> {
        const response = await fetch(`${API_BASE_URL}/chat/message`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json();
            const error: ApiError = {
                message: errorData.message || 'An error occurred',
                errors: errorData.errors,
            };
            throw error;
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let completeMessage: CreateMessageResponse | null = null;

        if (!reader) {
            throw new Error('Response body is not readable');
        }

        while (true) {
            const { done, value } = await reader.read();

            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    try {
                        const data = JSON.parse(line.slice(6));

                        if (data.type === 'chunk' && onChunk) {
                            onChunk(data.content);
                        } else if (data.type === 'complete') {
                            completeMessage = data.message;
                            if (onComplete) {
                                onComplete(data.message);
                            }
                        } else if (data.type === 'error' && onError) {
                            onError(data.message);
                        }
                    } catch (e) {
                        console.error('Error parsing SSE data:', e);
                    }
                }
            }
        }

        if (!completeMessage) {
            throw new Error('No complete message received');
        }

        return completeMessage;
    },

    async getChatHistory(): Promise<ChatHistoryResponse> {
        const response = await fetch(`${API_BASE_URL}/chat/history`, {
            method: 'GET',
            credentials: 'include',
        });

        return handleResponse<ChatHistoryResponse>(response);
    },
};
