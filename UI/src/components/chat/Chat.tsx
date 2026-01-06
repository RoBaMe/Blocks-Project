import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Chat.css';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

function Chat() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
    }, [user, navigate]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input.trim(),
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        // TODO: Replace with actual AI API call
        // Simulating AI response for now
        setTimeout(() => {
            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: `I received your message: "${userMessage.content}". This is a placeholder response. Connect to your AI service to get real responses.`,
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, aiMessage]);
            setIsLoading(false);
        }, 1000);
    };

    if (!user) {
        return null;
    }

    return (
        <div className="chat-container">
            <div className="chat-header">
                <h1>AI Chat</h1>
                <p className="chat-user-info">Welcome, {user.name}!</p>
            </div>

            <div className="chat-messages">
                {messages.length === 0 && (
                    <div className="chat-empty">
                        <p>Start a conversation with AI</p>
                        <p className="chat-hint">Ask me anything!</p>
                    </div>
                )}
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`chat-message ${message.role === 'user' ? 'user-message' : 'ai-message'}`}
                    >
                        <div className="message-content">
                            <div className="message-role">{message.role === 'user' ? 'You' : 'AI'}</div>
                            <div className="message-text">{message.content}</div>
                            <div className="message-time">{message.timestamp.toLocaleTimeString()}</div>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="chat-message ai-message">
                        <div className="message-content">
                            <div className="message-role">AI</div>
                            <div className="message-text typing-indicator">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="chat-input-form">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    className="chat-input"
                    disabled={isLoading}
                />
                <button type="submit" className="chat-send-button" disabled={isLoading || !input.trim()}>
                    Send
                </button>
            </form>
        </div>
    );
}

export default Chat;
