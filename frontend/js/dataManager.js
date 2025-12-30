// ============================================
// DATA MANAGEMENT MODULE
// CSV/JSON Import/Export Functionality
// ============================================

class DataManager {
    constructor() {
        this.setupEventListeners();
    }

    /**
     * Setup event listeners for import/export
     */
    setupEventListeners() {
        // Export buttons
        document.getElementById('exportCSVBtn')?.addEventListener('click', () => {
            this.exportToCSV();
        });

        document.getElementById('exportJSONBtn')?.addEventListener('click', () => {
            this.exportToJSON();
        });

        // Import button
        document.getElementById('importBtn')?.addEventListener('click', () => {
            document.getElementById('importFileInput').click();
        });

        document.getElementById('importFileInput')?.addEventListener('change', (e) => {
            this.handleFileImport(e);
        });
    }

    /**
     * Export current food trucks to CSV
     */
    async exportToCSV() {
        try {
            ui.showToast('Preparing CSV export...', 'info');

            // Fetch all food trucks
            const response = await api.getFoodTrucks({ limit: 1000 });
            const trucks = response.data;

            if (!trucks || trucks.length === 0) {
                ui.showToast('No data to export', 'warning');
                return;
            }

            // Convert to CSV
            const csv = this.convertToCSV(trucks);

            // Download file
            this.downloadFile(csv, 'food-trucks-export.csv', 'text/csv');

            ui.showToast(`Exported ${trucks.length} food trucks to CSV`, 'success');
        } catch (error) {
            console.error('CSV export error:', error);
            ui.showToast('Failed to export CSV', 'error');
        }
    }

    /**
     * Export current food trucks to JSON
     */
    async exportToJSON() {
        try {
            ui.showToast('Preparing JSON export...', 'info');

            // Fetch all food trucks
            const response = await api.getFoodTrucks({ limit: 1000 });
            const trucks = response.data;

            if (!trucks || trucks.length === 0) {
                ui.showToast('No data to export', 'warning');
                return;
            }

            // Convert to JSON with formatting
            const json = JSON.stringify({
                exportDate: new Date().toISOString(),
                totalRecords: trucks.length,
                data: trucks
            }, null, 2);

            // Download file
            this.downloadFile(json, 'food-trucks-export.json', 'application/json');

            ui.showToast(`Exported ${trucks.length} food trucks to JSON`, 'success');
        } catch (error) {
            console.error('JSON export error:', error);
            ui.showToast('Failed to export JSON', 'error');
        }
    }

    /**
     * Convert array of objects to CSV
     */
    convertToCSV(data) {
        if (!data || data.length === 0) return '';

        // Define headers
        const headers = [
            'id', 'name', 'cuisine', 'city', 'current_location',
            'average_price', 'operating_hours', 'status', 'image',
            'menu', 'rating', 'reviews_count', 'phone', 'website',
            'latitude', 'longitude', 'created_at'
        ];

        // Create CSV header row
        const csvRows = [headers.join(',')];

        // Add data rows
        for (const row of data) {
            const values = headers.map(header => {
                let value = row[header] || '';

                // Handle special cases
                if (typeof value === 'object') {
                    value = JSON.stringify(value);
                }

                // Escape quotes and wrap in quotes if contains comma
                value = String(value).replace(/"/g, '""');
                if (value.includes(',') || value.includes('\n') || value.includes('"')) {
                    value = `"${value}"`;
                }

                return value;
            });

            csvRows.push(values.join(','));
        }

        return csvRows.join('\n');
    }

    /**
     * Handle file import
     */
    async handleFileImport(event) {
        const file = event.target.files[0];
        if (!file) return;

        const fileExtension = file.name.split('.').pop().toLowerCase();

        try {
            ui.showToast('Reading file...', 'info');

            const content = await this.readFile(file);

            let data;
            if (fileExtension === 'csv') {
                data = this.parseCSV(content);
            } else if (fileExtension === 'json') {
                data = this.parseJSON(content);
            } else {
                throw new Error('Unsupported file format. Please use CSV or JSON.');
            }

            // Validate and import data
            await this.importData(data);

        } catch (error) {
            console.error('Import error:', error);
            ui.showToast(error.message || 'Failed to import file', 'error');
        } finally {
            // Reset file input
            event.target.value = '';
        }
    }

    /**
     * Read file content
     */
    readFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = (e) => reject(new Error('Failed to read file'));
            reader.readAsText(file);
        });
    }

    /**
     * Parse CSV content
     */
    parseCSV(content) {
        const lines = content.split('\n').filter(line => line.trim());
        if (lines.length < 2) {
            throw new Error('CSV file is empty or invalid');
        }

        // Parse header
        const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));

        // Parse rows
        const data = [];
        for (let i = 1; i < lines.length; i++) {
            const values = this.parseCSVLine(lines[i]);
            const row = {};

            headers.forEach((header, index) => {
                let value = values[index] || '';

                // Try to parse JSON fields
                if (header === 'menu' && value) {
                    try {
                        value = JSON.parse(value);
                    } catch (e) {
                        // Keep as string if not valid JSON
                    }
                }

                // Convert numeric fields
                if (header === 'average_price' || header === 'rating' ||
                    header === 'reviews_count' || header === 'latitude' || header === 'longitude') {
                    value = value ? parseFloat(value) : null;
                }

                row[header] = value;
            });

            data.push(row);
        }

        return data;
    }

    /**
     * Parse a single CSV line (handles quoted values)
     */
    parseCSVLine(line) {
        const values = [];
        let current = '';
        let inQuotes = false;

        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            const nextChar = line[i + 1];

            if (char === '"') {
                if (inQuotes && nextChar === '"') {
                    current += '"';
                    i++; // Skip next quote
                } else {
                    inQuotes = !inQuotes;
                }
            } else if (char === ',' && !inQuotes) {
                values.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }

        values.push(current.trim());
        return values;
    }

    /**
     * Parse JSON content
     */
    parseJSON(content) {
        try {
            const parsed = JSON.parse(content);

            // Handle different JSON structures
            if (Array.isArray(parsed)) {
                return parsed;
            } else if (parsed.data && Array.isArray(parsed.data)) {
                return parsed.data;
            } else {
                throw new Error('Invalid JSON structure. Expected an array or object with "data" property.');
            }
        } catch (error) {
            throw new Error('Invalid JSON format: ' + error.message);
        }
    }

    /**
     * Import data to database
     */
    async importData(data) {
        if (!data || data.length === 0) {
            throw new Error('No data to import');
        }

        if (!auth.isAuthenticated()) {
            throw new Error('Please login to import data');
        }

        ui.showToast(`Importing ${data.length} records...`, 'info');

        const results = {
            success: 0,
            failed: 0,
            errors: []
        };

        for (const item of data) {
            try {
                // Remove id if present (will be auto-generated)
                const { id, created_at, updated_at, user_id, favorites_count, ...truckData } = item;

                // Validate required fields
                if (!truckData.name || !truckData.cuisine) {
                    throw new Error('Missing required fields: name and cuisine');
                }

                await api.createFoodTruck(truckData);
                results.success++;
            } catch (error) {
                results.failed++;
                results.errors.push({
                    item: item.name || 'Unknown',
                    error: error.message
                });
            }
        }

        // Show results
        if (results.success > 0) {
            ui.showToast(`Successfully imported ${results.success} food trucks`, 'success');

            // Reload the page
            if (window.app) {
                await window.app.loadFoodTrucks();
            }
        }

        if (results.failed > 0) {
            console.error('Import errors:', results.errors);
            ui.showToast(`Failed to import ${results.failed} records. Check console for details.`, 'warning');
        }

        return results;
    }

    /**
     * Download file
     */
    downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url);
    }
}

// Create global instance
const dataManager = new DataManager();
