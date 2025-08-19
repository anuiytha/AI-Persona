const express = require('express');
const router = express.Router();
const ragService = require('../services/ragService');

// Upload document to vector store
router.post('/upload', async (req, res) => {
    try {
        const { content, metadata = {} } = req.body;

        if (!content) {
            return res.status(400).json({ error: 'Document content is required' });
        }

        const result = await ragService.uploadDocument(content, metadata);
        res.json(result);
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Chat with RAG
router.post('/chat', async (req, res) => {
    try {
        const { message, sessionId } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        const result = await ragService.chat(message, sessionId);
        res.json(result);
    } catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get chat session
router.get('/session/:sessionId', async (req, res) => {
    try {
        const { sessionId } = req.params;
        const session = await ragService.getSession(sessionId);
        res.json(session);
    } catch (error) {
        console.error('Get session error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get statistics
router.get('/stats', async (req, res) => {
    try {
        const stats = await ragService.getStats();
        res.json(stats);
    } catch (error) {
        console.error('Stats error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Direct query without chat context
router.post('/query', async (req, res) => {
    try {
        const { query } = req.body;

        if (!query) {
            return res.status(400).json({ error: 'Query is required' });
        }

        const result = await ragService.directQuery(query);
        res.json(result);
    } catch (error) {
        console.error('Query error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Health check for RAG service
router.get('/health', async (req, res) => {
    try {
        const health = await ragService.healthCheck();
        res.json(health);
    } catch (error) {
        console.error('Health check error:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;


