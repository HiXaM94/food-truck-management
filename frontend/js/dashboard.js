// ============================================
// INTERACTIVE DASHBOARD
// ============================================

class Dashboard {
    constructor() {
        this.cuisineChart = null;
        this.growthChart = null;
    }

    /**
     * Initialize dashboard charts
     */
    async init(trucksData) {
        if (typeof Chart === 'undefined') {
            console.error('Chart.js not loaded');
            return;
        }

        this.createCuisineChart(trucksData);
        this.createGrowthChart(trucksData);
    }

    /**
     * Create cuisine distribution pie chart
     */
    createCuisineChart(trucks) {
        const ctx = document.getElementById('cuisineChart');
        if (!ctx) return;

        // Count trucks by cuisine
        const cuisineCounts = {};
        trucks.forEach(truck => {
            const cuisine = truck.cuisine || 'other';
            cuisineCounts[cuisine] = (cuisineCounts[cuisine] || 0) + 1;
        });

        // Prepare data
        const labels = Object.keys(cuisineCounts).map(c =>
            c.charAt(0).toUpperCase() + c.slice(1)
        );
        const data = Object.values(cuisineCounts);

        // Color palette
        const colors = [
            '#0066FF', // Primary blue
            '#00D4AA', // Secondary cyan
            '#8B5CF6', // Purple
            '#F59E0B', // Amber
            '#10B981', // Green
            '#EC4899', // Pink
            '#EF4444', // Red
            '#3B82F6', // Blue
            '#14B8A6', // Teal
            '#F97316'  // Orange
        ];

        // Destroy existing chart if any
        if (this.cuisineChart) {
            this.cuisineChart.destroy();
        }

        // Create chart
        this.cuisineChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: colors.slice(0, labels.length),
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            padding: 15,
                            font: {
                                size: 12,
                                family: 'Inter'
                            },
                            usePointStyle: true,
                            pointStyle: 'circle'
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        titleFont: {
                            size: 14,
                            weight: 'bold'
                        },
                        bodyFont: {
                            size: 13
                        },
                        callbacks: {
                            label: function (context) {
                                const label = context.label || '';
                                const value = context.parsed || 0;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((value / total) * 100).toFixed(1);
                                return `${label}: ${value} trucks (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }

    /**
     * Create trucks growth line chart
     */
    createGrowthChart(trucks) {
        const ctx = document.getElementById('trucksGrowthChart');
        if (!ctx) return;

        // Generate mock monthly data (in real app, use actual creation dates)
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        const data = [5, 12, 18, 25, 32, trucks.length];

        // Destroy existing chart if any
        if (this.growthChart) {
            this.growthChart.destroy();
        }

        // Create chart
        this.growthChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: months,
                datasets: [{
                    label: 'Total Trucks',
                    data: data,
                    borderColor: '#0066FF',
                    backgroundColor: 'rgba(0, 102, 255, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    pointBackgroundColor: '#0066FF',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        titleFont: {
                            size: 14,
                            weight: 'bold'
                        },
                        bodyFont: {
                            size: 13
                        },
                        callbacks: {
                            label: function (context) {
                                return `Trucks: ${context.parsed.y}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 5,
                            font: {
                                size: 11
                            }
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    },
                    x: {
                        ticks: {
                            font: {
                                size: 11
                            }
                        },
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }

    /**
     * Update charts with new data
     */
    updateCharts(trucks) {
        this.createCuisineChart(trucks);
        this.createGrowthChart(trucks);
    }

    /**
     * Destroy charts
     */
    destroy() {
        if (this.cuisineChart) {
            this.cuisineChart.destroy();
        }
        if (this.growthChart) {
            this.growthChart.destroy();
        }
    }
}

// Create global dashboard instance
const dashboard = new Dashboard();
