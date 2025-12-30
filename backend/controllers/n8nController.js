// ============================================
// N8N INTEGRATION CONTROLLER
// Lead Generation with Google Sheets
// ============================================

const axios = require('axios');

/**
 * Trigger n8n workflow for lead generation
 */
exports.triggerLeadGeneration = async (req, res) => {
    try {
        const { searchQuery, location, limit = 20 } = req.body;

        if (!searchQuery) {
            return res.status(400).json({
                success: false,
                message: 'Search query is required'
            });
        }

        const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;

        if (!n8nWebhookUrl) {
            return res.status(500).json({
                success: false,
                message: 'N8N webhook URL not configured'
            });
        }

        // Prepare payload for n8n
        const payload = {
            searchQuery,
            location,
            limit,
            userId: req.user.id,
            timestamp: new Date().toISOString(),
            source: 'food-truck-management-app'
        };

        // Trigger n8n workflow
        const response = await axios.post(n8nWebhookUrl, payload, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.N8N_API_KEY || ''}`
            },
            timeout: 30000 // 30 seconds timeout
        });

        res.json({
            success: true,
            message: 'Lead generation workflow triggered successfully',
            data: {
                workflowId: response.data.workflowId || 'pending',
                status: 'processing',
                estimatedTime: '2-5 minutes'
            }
        });

    } catch (error) {
        console.error('N8N trigger error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to trigger lead generation workflow',
            error: error.message
        });
    }
};

/**
 * Get lead generation status
 */
exports.getLeadGenerationStatus = async (req, res) => {
    try {
        const { workflowId } = req.params;

        // In a real implementation, you would query n8n API for status
        // For now, we'll return a mock response
        res.json({
            success: true,
            data: {
                workflowId,
                status: 'completed',
                recordsProcessed: 15,
                recordsAdded: 12,
                recordsFailed: 3
            }
        });

    } catch (error) {
        console.error('Status check error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get workflow status',
            error: error.message
        });
    }
};

/**
 * Webhook endpoint to receive data from n8n
 */
exports.receiveN8nData = async (req, res) => {
    try {
        const { leads, workflowId, status } = req.body;

        if (!leads || !Array.isArray(leads)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid data format'
            });
        }

        // Process and store leads
        // This would typically insert into your database
        console.log(`Received ${leads.length} leads from n8n workflow ${workflowId}`);

        res.json({
            success: true,
            message: `Successfully received ${leads.length} leads`,
            processed: leads.length
        });

    } catch (error) {
        console.error('N8N webhook error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to process n8n data',
            error: error.message
        });
    }
};

/**
 * Sync with Google Sheets
 */
exports.syncGoogleSheets = async (req, res) => {
    try {
        const { spreadsheetId, sheetName = 'Leads' } = req.body;

        if (!spreadsheetId) {
            return res.status(400).json({
                success: false,
                message: 'Spreadsheet ID is required'
            });
        }

        const n8nWebhookUrl = process.env.N8N_GOOGLE_SHEETS_WEBHOOK_URL;

        if (!n8nWebhookUrl) {
            return res.status(500).json({
                success: false,
                message: 'Google Sheets webhook URL not configured'
            });
        }

        // Trigger Google Sheets sync workflow
        const response = await axios.post(n8nWebhookUrl, {
            spreadsheetId,
            sheetName,
            userId: req.user.id,
            action: 'import',
            timestamp: new Date().toISOString()
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.N8N_API_KEY || ''}`
            },
            timeout: 30000
        });

        res.json({
            success: true,
            message: 'Google Sheets sync initiated',
            data: response.data
        });

    } catch (error) {
        console.error('Google Sheets sync error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to sync with Google Sheets',
            error: error.message
        });
    }
};

/**
 * Export leads to Google Sheets
 */
exports.exportToGoogleSheets = async (req, res) => {
    try {
        const { spreadsheetId, sheetName = 'Food Trucks', leads } = req.body;

        if (!spreadsheetId || !leads) {
            return res.status(400).json({
                success: false,
                message: 'Spreadsheet ID and leads data are required'
            });
        }

        const n8nWebhookUrl = process.env.N8N_GOOGLE_SHEETS_WEBHOOK_URL;

        if (!n8nWebhookUrl) {
            return res.status(500).json({
                success: false,
                message: 'Google Sheets webhook URL not configured'
            });
        }

        // Trigger export workflow
        const response = await axios.post(n8nWebhookUrl, {
            spreadsheetId,
            sheetName,
            leads,
            userId: req.user.id,
            action: 'export',
            timestamp: new Date().toISOString()
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.N8N_API_KEY || ''}`
            },
            timeout: 30000
        });

        res.json({
            success: true,
            message: `Successfully exported ${leads.length} leads to Google Sheets`,
            data: response.data
        });

    } catch (error) {
        console.error('Export to Google Sheets error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to export to Google Sheets',
            error: error.message
        });
    }
};
