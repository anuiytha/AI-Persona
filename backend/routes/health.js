const express = require('express');
const router = express.Router();

// Basic health check
router.get('/', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// Detailed health check
router.get('/detailed', (req, res) => {
    const health = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
        memory: process.memoryUsage(),
        platform: process.platform,
        nodeVersion: process.version,
        pid: process.pid
    };

    res.json(health);
});

// Readiness check
router.get('/ready', (req, res) => {
    // Add any additional readiness checks here
    // For example, check database connections, external services, etc.
    res.json({
        status: 'ready',
        timestamp: new Date().toISOString(),
        message: 'Service is ready to handle requests'
    });
});

module.exports = router;


