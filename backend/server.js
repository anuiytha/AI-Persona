// Import required Node.js modules and external packages
const express = require('express');        // Web framework for building APIs
const cors = require('cors');              // Middleware to handle Cross-Origin Resource Sharing
const helmet = require('helmet');          // Security middleware to set various HTTP headers
const morgan = require('express-rate-limit'); // Rate limiting middleware (note: this import is incorrect)
const rateLimit = require('express-rate-limit'); // Correct rate limiting middleware
require('dotenv').config();                // Load environment variables from .env file

// Create Express application instance
const app = express();
// Set server port from environment variable or default to 5000
const PORT = process.env.PORT || 5000;

// Trust proxy setting for rate limiting when behind a reverse proxy
// This is important for getting the correct client IP address
app.set('trust proxy', 1);

// ===== MIDDLEWARE SETUP =====
// Apply security headers using Helmet
app.use(helmet());

// Configure CORS (Cross-Origin Resource Sharing)
// This allows the frontend (localhost:3000) to communicate with the backend (localhost:5000)
app.use(cors({
    origin: process.env.NODE_ENV === 'production'
        ? process.env.FRONTEND_URL        // Use production frontend URL if in production
        : 'http://localhost:3000',        // Use localhost:3000 for development
    credentials: true                     // Allow cookies and authentication headers
}));

// Parse incoming JSON requests with a size limit of 10MB
app.use(express.json({ limit: '10mb' }));
// Parse URL-encoded requests with a size limit of 10MB
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ===== RATE LIMITING SETUP =====
// Create a rate limiter to prevent API abuse
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,            // Time window: 15 minutes
    max: 100,                             // Maximum 100 requests per IP per window
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,                 // Include standard rate limit headers
    legacyHeaders: false,                  // Don't include legacy headers
});

// Apply rate limiting to all API routes
app.use('/api/', limiter);

// ===== HEALTH CHECK ENDPOINT =====
// Simple endpoint to verify the server is running
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',                      // Server status
        timestamp: new Date().toISOString(), // Current timestamp
        message: 'Backend server is running' // Status message
    });
});

// ===== API ROUTES SETUP =====
// Mount different route modules for different API functionalities
app.use('/api/rag', require('./routes/rag'));      // RAG (Retrieval-Augmented Generation) routes
app.use('/api/chat', require('./routes/chat'));    // Chat functionality routes
app.use('/api/health', require('./routes/health')); // Detailed health check routes

// ===== ERROR HANDLING MIDDLEWARE =====
// Global error handler - catches any errors thrown in the application
app.use((err, req, res, next) => {
    console.error('Error:', err);          // Log the error for debugging
    res.status(500).json({                 // Send 500 Internal Server Error
        error: 'Internal server error',     // Error type
        message: err.message,               // Error message from the error object
        timestamp: new Date().toISOString() // When the error occurred
    });
});

// ===== 404 HANDLER =====
// Catch-all route for any requests that don't match defined routes
app.use('*', (req, res) => {
    res.status(404).json({                 // Send 404 Not Found
        error: 'Route not found',           // Error type
        message: `Cannot ${req.method} ${req.originalUrl}`, // What was attempted
        timestamp: new Date().toISOString() // When the request was made
    });
});

// ===== START THE SERVER =====
// Begin listening for incoming HTTP requests
app.listen(PORT, () => {
    console.log(`🚀 Backend server running on port ${PORT}`);           // Server start confirmation
    console.log(`📊 Health check: http://localhost:${PORT}/health`);    // Health check URL
    console.log(`🔗 API base: http://localhost:${PORT}/api`);          // Base API URL
});
