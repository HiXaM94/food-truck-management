// ============================================
// N8N INTEGRATION ROUTES
// ============================================

const express = require('express');
const router = express.Router();
const n8nController = require('../controllers/n8nController');
const { authenticateToken } = require('../middleware/auth');

// Protected routes (require authentication)
router.post('/trigger-lead-generation', authenticateToken, n8nController.triggerLeadGeneration);
router.get('/status/:workflowId', authenticateToken, n8nController.getLeadGenerationStatus);
router.post('/sync-google-sheets', authenticateToken, n8nController.syncGoogleSheets);
router.post('/export-google-sheets', authenticateToken, n8nController.exportToGoogleSheets);

// Webhook endpoint (public - for n8n to send data back)
router.post('/webhook/receive', n8nController.receiveN8nData);

module.exports = router;
