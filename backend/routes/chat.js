const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// In-memory storage for chat sessions (replace with database in production)
const chatSessions = new Map();

// Start a new chat session
router.post('/start', (req, res) => {
    try {
        const sessionId = uuidv4();
        const session = {
            id: sessionId,
            createdAt: new Date().toISOString(),
            messages: [],
            metadata: req.body.metadata || {}
        };

        chatSessions.set(sessionId, session);

        res.json({
            sessionId,
            message: 'Chat session started successfully',
            session
        });
    } catch (error) {
        console.error('Start session error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Send a message in a chat session
router.post('/message', async (req, res) => {
    try {
        const { sessionId, message, type = 'user' } = req.body;

        if (!sessionId || !message) {
            return res.status(400).json({ error: 'Session ID and message are required' });
        }

        const session = chatSessions.get(sessionId);
        if (!session) {
            return res.status(404).json({ error: 'Chat session not found' });
        }

        // Add message to session
        const messageObj = {
            id: uuidv4(),
            content: message,
            type,
            timestamp: new Date().toISOString()
        };

        session.messages.push(messageObj);

        res.json({
            message: 'Message sent successfully',
            messageObj,
            session
        });
    } catch (error) {
        console.error('Send message error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get chat session
router.get('/session/:sessionId', (req, res) => {
    try {
        const { sessionId } = req.params;
        const session = chatSessions.get(sessionId);

        if (!session) {
            return res.status(404).json({ error: 'Chat session not found' });
        }

        res.json(session);
    } catch (error) {
        console.error('Get session error:', error);
        res.status(500).json({ error: error.message });
    }
});

// End a chat session
router.delete('/session/:sessionId', (req, res) => {
    try {
        const { sessionId } = req.params;
        const deleted = chatSessions.delete(sessionId);

        if (!deleted) {
            return res.status(404).json({ error: 'Chat session not found' });
        }

        res.json({ message: 'Chat session ended successfully' });
    } catch (error) {
        console.error('End session error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get all active sessions
router.get('/sessions', (req, res) => {
    try {
        const sessions = Array.from(chatSessions.values()).map(session => ({
            id: session.id,
            createdAt: session.createdAt,
            messageCount: session.messages.length,
            metadata: session.metadata
        }));

        res.json(sessions);
    } catch (error) {
        console.error('Get sessions error:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;


