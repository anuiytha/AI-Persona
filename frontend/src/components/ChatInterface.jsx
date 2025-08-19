// Import React hooks and components for building the chat interface
import React, { useState, useRef, useEffect } from 'react';  // React core with hooks for state, refs, and side effects
import { Send, Bot, User, FileText } from 'lucide-react';   // Icon components for UI elements
import { chat } from '../services/api.js';                   // API service for chat functionality
import ReactMarkdown from 'react-markdown';                   // Component to render markdown text
import remarkGfm from 'remark-gfm';                          // GitHub Flavored Markdown support

// Main ChatInterface component that handles all chat interactions
const ChatInterface = ({ persona }) => {
    // ===== STATE MANAGEMENT =====
    // messages: Array to store all chat messages (both user and AI)
    const [messages, setMessages] = useState([]);
    // inputMessage: Current text in the input field
    const [inputMessage, setInputMessage] = useState('');
    // isLoading: Boolean to show loading state during API calls
    const [isLoading, setIsLoading] = useState(false);

    // ===== REFS =====
    // Reference to the bottom of the messages container for auto-scrolling
    const messagesEndRef = useRef(null);

    // ===== AUTO-SCROLL FUNCTION =====
    // Function to scroll to the bottom of the chat when new messages arrive
    const scrollToBottom = () => {
        // Use optional chaining to safely access the ref
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // ===== SIDE EFFECTS =====
    // useEffect hook to auto-scroll whenever messages change
    useEffect(() => {
        scrollToBottom();
    }, [messages]); // Dependency array: run effect when messages array changes

    // ===== MESSAGE HANDLING =====
    // Main function to handle sending messages and getting AI responses
    const handleSendMessage = async () => {
        // Early return if input is empty or already processing
        if (!inputMessage.trim() || isLoading) return;

        // ===== CREATE USER MESSAGE =====
        // Create a message object for the user's input
        const userMessage = {
            id: Date.now().toString(),           // Unique ID using timestamp
            content: inputMessage,               // The actual message text
            type: 'user',                        // Message type for styling
            timestamp: new Date().toISOString()  // When message was sent
        };

        // ===== UPDATE UI IMMEDIATELY =====
        // Add user message to the messages array and clear input
        setMessages(prev => [...prev, userMessage]);  // Spread previous messages and add new one
        setInputMessage('');                          // Clear the input field
        setIsLoading(true);                           // Show loading state

        try {
            // ===== API CALL =====
            // Send message to backend and get AI response
            const response = await chat(inputMessage);

            // ===== CREATE AI RESPONSE MESSAGE =====
            // Create a message object for the AI's response
            const assistantMessage = {
                id: (Date.now() + 1).toString(),      // Unique ID (different from user message)
                content: response.response,            // AI-generated response text
                type: 'assistant',                     // Message type for styling
                timestamp: new Date().toISOString(),   // When response was received
                sources: response.sources              // Source documents used for response
            };

            // ===== ADD AI RESPONSE TO CHAT =====
            // Add the AI response to the messages array
            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            // ===== ERROR HANDLING =====
            console.error('Chat error:', error);

            // Create an error message to show user
            const errorMessage = {
                id: (Date.now() + 1).toString(),      // Unique ID for error message
                content: 'Sorry, I encountered an error. Please try again.', // User-friendly error
                type: 'assistant',                     // Treat as assistant message
                timestamp: new Date().toISOString()    // When error occurred
            };

            // Add error message to chat
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            // ===== CLEANUP =====
            // Always hide loading state, regardless of success or failure
            setIsLoading(false);
        }
    };

    // ===== KEYBOARD EVENT HANDLING =====
    // Handle Enter key press to send messages
    const handleKeyPress = (e) => {
        // Send message on Enter (but not Shift+Enter for new lines)
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();           // Prevent default Enter behavior
            handleSendMessage();          // Call the send message function
        }
    };

    // ===== MESSAGE RENDERING =====
    // Function to render individual chat messages
    const renderMessage = (message) => (
        <div key={message.id} className={`message ${message.type}`}>
            {/* ===== MESSAGE AVATAR ===== */}
            <div className="message-avatar">
                {/* Show different icons for user vs AI messages */}
                {message.type === 'user' ? <User size={20} /> : <Bot size={20} />}
            </div>

            {/* ===== MESSAGE CONTENT ===== */}
            <div className="message-content">
                {/* ===== MESSAGE TEXT ===== */}
                <div className="message-text">
                    {/* Render markdown content for rich text display */}
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {message.content}
                    </ReactMarkdown>
                </div>

                {/* ===== SOURCE DOCUMENTS ===== */}
                {/* Only show sources if they exist and are available */}
                {message.sources && message.sources.length > 0 && (
                    <div className="message-sources">
                        <h4>Sources from {persona.name}'s Knowledge Base:</h4>
                        {/* Map through each source document */}
                        {message.sources.map((source, index) => (
                            <div key={index} className="source-item">
                                <FileText size={16} />
                                <div className="source-content">
                                    {/* Show first 200 characters of source content */}
                                    <p>{source.content.substring(0, 200)}...</p>
                                    {/* Display source metadata if available */}
                                    {source.metadata.source && (
                                        <small>Source: {source.metadata.source}</small>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* ===== TIMESTAMP ===== */}
                <div className="message-timestamp">
                    {/* Format timestamp for user-friendly display */}
                    {new Date(message.timestamp).toLocaleTimeString()}
                </div>
            </div>
        </div>
    );

    // ===== MAIN COMPONENT RENDER =====
    return (
        <div className="chat-interface">
            {/* ===== CHAT HEADER ===== */}
            <div className="chat-header">
                <h2>Chat with {persona.name}</h2>                    {/* Persona name */}
                <p>{persona.role}</p>                                {/* Persona role */}
                <p className="chat-description">
                    Ask questions and get responses as if you're talking directly to {persona.name}.
                    The AI will respond based on {persona.name}'s interviews, articles, videos, and professional documents.
                </p>
            </div>

            {/* ===== CHAT MESSAGES CONTAINER ===== */}
            <div className="chat-messages">
                {/* ===== WELCOME MESSAGE ===== */}
                {/* Show welcome message when no messages exist */}
                {messages.length === 0 ? (
                    <div className="welcome-message">
                        <User size={48} />
                        <h3>Welcome! You're chatting with {persona.name}</h3>
                        <p>
                            This AI chatbot has been trained on {persona.name}'s knowledge base including interviews,
                            articles, videos, and professional documents. All documents are pre-loaded and ready to use.
                        </p>

                        {/* ===== EXAMPLE QUESTIONS ===== */}
                        <div className="persona-example">
                            <h4>Start chatting right away! Example questions:</h4>
                            <ul>
                                <li>"What's your experience with machine learning?"</li>
                                <li>"Tell me about your approach to AI development"</li>
                                <li>"What advice would you give to aspiring engineers?"</li>
                                <li>"What are your thoughts on technology leadership?"</li>
                            </ul>
                        </div>
                    </div>
                ) : (
                    // ===== RENDER EXISTING MESSAGES =====
                    // Map through all messages and render each one
                    messages.map(renderMessage)
                )}

                {/* ===== LOADING INDICATOR ===== */}
                {/* Show typing indicator when waiting for AI response */}
                {isLoading && (
                    <div className="message assistant">
                        <div className="message-avatar">
                            <Bot size={20} />
                        </div>
                        <div className="message-content">
                            <div className="typing-indicator">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                    </div>
                )}

                {/* ===== SCROLL TARGET ===== */}
                {/* Invisible element at bottom for auto-scrolling */}
                <div ref={messagesEndRef} />
            </div>

            {/* ===== CHAT INPUT AREA ===== */}
            <div className="chat-input">
                {/* ===== TEXT INPUT ===== */}
                <textarea
                    value={inputMessage}                              // Controlled input value
                    onChange={(e) => setInputMessage(e.target.value)} // Update state on input change
                    onKeyPress={handleKeyPress}                       // Handle Enter key press
                    placeholder={`Ask ${persona.name} a question...`}  // Dynamic placeholder
                    disabled={isLoading}                              // Disable during API calls
                    rows={1}                                          // Single line input
                />

                {/* ===== SEND BUTTON ===== */}
                <button
                    onClick={handleSendMessage}                       // Send message on click
                    disabled={!inputMessage.trim() || isLoading}      // Disable if empty or loading
                    className="send-button"
                >
                    <Send size={20} />
                </button>
            </div>
        </div>
    );
};

// Export the component for use in other parts of the application
export default ChatInterface;
