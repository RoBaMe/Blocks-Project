import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { chatApi, type ChatMessage } from '../../services/api';
import './Chat.css';
import toast from 'react-hot-toast';

function Chat() {
    const { user, logout } = useAuth();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchMessages = async () => {
            const response = await chatApi.getChatHistory();
            setMessages(response.messages);
        };
        fetchMessages();
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const generateTempMessage = (side: 'user' | 'bot', content: string = ''): ChatMessage => {
        return {
            id: `temp-${side}-${Date.now()}`,
            userId: user?.id || '',
            side,
            content,
            timestamp: new Date().toISOString(),
        };
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const messageContent = input.trim();
        setInput('');
        setIsLoading(true);

        try {
            const tempUserMessage = generateTempMessage('user', messageContent);
            setMessages((prev) => [...prev, tempUserMessage]);

            const tempBotMessage = generateTempMessage('bot');
            setMessages((prev) => [...prev, tempBotMessage]);

            await chatApi.sendMessage(
                { content: messageContent },
                (chunk: string) => {
                    setMessages((prev) =>
                        prev.map((msg) =>
                            msg.id === tempBotMessage.id ? { ...msg, content: msg.content + chunk } : msg
                        )
                    );
                },
                (completeMessage: ChatMessage) => {
                    setMessages((prev) => prev.map((msg) => (msg.id === tempBotMessage.id ? completeMessage : msg)));
                },
                (error: string) => {
                    throw error;
                }
            );
        } catch (error) {
            toast.error(`Failed to send message: ${error}`);
            setMessages((prev) => prev.filter((msg) => !msg.id.startsWith('temp-bot')));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="chat-wrapper">
            <div className="chat-container">
                <div className="chat-header">
                <div className="chat-header-content">
                    <div>
                        <h1>Math AI Chat</h1>
                        <p className="chat-user-info">Welcome, {user?.name}!</p>
                    </div>
                    <button onClick={logout} className="logout-button">
                        Logout
                    </button>
                </div>
            </div>

            <div className="chat-messages">
                {messages.length === 0 && (
                    <div className="chat-empty">
                        <p>Start a conversation with AI</p>
                        <p className="chat-hint">Try asking me to sum or find the max of a list of numbers!</p>
                    </div>
                )}
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`chat-message ${message.side === 'user' ? 'user-message' : 'ai-message'}`}
                    >
                        <div className="message-content">
                            <div className="message-role">{message.side === 'user' ? 'You' : 'Bot'}</div>
                            {isLoading && !message.content ? (
                                <div className="message-text typing-indicator">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            ) : (
                                <div className="message-text">{message.content}</div>
                            )}
                            <div className="message-time">{new Date(message.timestamp).toLocaleTimeString()}</div>
                        </div>
                    </div>
                ))}
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
            <div className="chat-banner">
                <div className="banner-content">
                    <h3>Try These Awesome Commands!</h3>
                    <div className="banner-examples">
                        <div className="banner-example">
                            <strong>Sum numbers:</strong>
                            <p>"Sum 1, 2, 3, 4, 5"</p>
                        </div>
                        <div className="banner-example">
                            <strong>Find maximum:</strong>
                            <p>"Max 10, 25, 5, 30"</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Chat;
