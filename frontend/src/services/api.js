// Import axios for making HTTP requests to the backend API
import axios from 'axios';

// Base URL for all API calls - this will be proxied to the backend server
const API_BASE_URL = '/api';

// ===== AXIOS INSTANCE CONFIGURATION =====
// Create a configured axios instance with default settings
const api = axios.create({
    baseURL: API_BASE_URL,                    // Base URL for all requests
    headers: {
        'Content-Type': 'application/json',   // Set content type to JSON for all requests
    },
});

// ===== RAG (RETRIEVAL-AUGMENTED GENERATION) API ENDPOINTS =====
// Functions for interacting with the RAG system (document upload, chat, queries)
export const ragApi = {
    // ===== DOCUMENT UPLOAD =====
    // Upload a document to the knowledge base for RAG processing
    uploadDocument: async (content, metadata = {}) => {
        // Send POST request to upload endpoint with document content and metadata
        const response = await api.post('/rag/upload', { content, metadata });
        return response.data;  // Return the response data from the server
    },

    // ===== CHAT WITH RAG =====
    // Send a chat message and get AI response based on knowledge base
    chat: async (message, sessionId) => {
        // Send POST request to chat endpoint with message and optional session ID
        const response = await api.post('/rag/chat', { message, sessionId });
        return response.data;  // Return the AI response and source documents
    },

    // ===== DIRECT QUERY =====
    // Query the knowledge base directly without chat context
    query: async (query) => {
        // Send POST request to query endpoint with the search query
        const response = await api.post('/rag/query', { query });
        return response.data;  // Return query results and sources
    },

    // ===== GET STATISTICS =====
    // Retrieve system statistics about the knowledge base
    getStats: async () => {
        // Send GET request to stats endpoint
        const response = await api.get('/rag/stats');
        return response.data;  // Return statistics like document count, system status
    },

    // ===== HEALTH CHECK =====
    // Check if the RAG system is functioning properly
    healthCheck: async () => {
        // Send GET request to health endpoint
        const response = await api.get('/rag/health');
        return response.data;  // Return system health information
    }
};

// ===== CHAT API ENDPOINTS =====
// Functions for managing chat sessions and conversations
export const chatApi = {
    // ===== START NEW SESSION =====
    // Begin a new chat session with optional metadata
    startSession: async (metadata = {}) => {
        // Send POST request to start a new chat session
        const response = await api.post('/chat/start', { metadata });
        return response.data;  // Return session information and ID
    },

    // ===== SEND MESSAGE =====
    // Send a message within an existing chat session
    sendMessage: async (sessionId, message, type = 'user') => {
        // Send POST request with session ID, message content, and message type
        const response = await api.post('/chat/message', { sessionId, message, type });
        return response.data;  // Return the message response
    },

    // ===== GET SESSION =====
    // Retrieve information about a specific chat session
    getSession: async (sessionId) => {
        // Send GET request to retrieve session details
        const response = await api.get(`/chat/session/${sessionId}`);
        return response.data;  // Return session information and message history
    },

    // ===== END SESSION =====
    // Terminate a chat session
    endSession: async (sessionId) => {
        // Send DELETE request to end the session
        const response = await api.delete(`/chat/session/${sessionId}`);
        return response.data;  // Return confirmation of session termination
    },

    // ===== GET ALL SESSIONS =====
    // Retrieve list of all available chat sessions
    getSessions: async () => {
        // Send GET request to retrieve all sessions
        const response = await api.get('/chat/sessions');
        return response.data;  // Return array of all sessions
    }
};

// ===== HEALTH API ENDPOINTS =====
// Functions for monitoring system health and status
export const healthApi = {
    // ===== BASIC HEALTH CHECK =====
    // Simple endpoint to verify the server is running
    check: async () => {
        // Send GET request to basic health endpoint
        const response = await api.get('/health');
        return response.data;  // Return basic health status
    },

    // ===== DETAILED HEALTH CHECK =====
    // Comprehensive system health information
    detailed: async () => {
        // Send GET request to detailed health endpoint
        const response = await api.get('/health/detailed');
        return response.data;  // Return detailed system status and metrics
    },

    // ===== READINESS CHECK =====
    // Check if the system is ready to handle requests
    ready: async () => {
        // Send GET request to readiness endpoint
        const response = await api.get('/health/ready');
        return response.data;  // Return readiness status
    }
};

// ===== CONVENIENCE EXPORTS =====
// Export commonly used functions directly for easier access
export const getStats = ragApi.getStats;           // Quick access to get statistics
export const uploadDocument = ragApi.uploadDocument; // Quick access to upload documents
export const chat = ragApi.chat;                   // Quick access to chat functionality
export const query = ragApi.query;                 // Quick access to direct queries

// ===== DEFAULT EXPORT =====
// Export the configured axios instance as default
// This allows other modules to use the same configured instance
export default api;



