/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./frontend/**/*.{html,js}"],
    theme: {
        extend: {
            colors: {
                // Citrus Burst: Modern and friendly - Orange stimulates appetite, blue adds trust
                citrus: {
                    orange: '#FF9F1C',      // Vivid Orange
                    blue: '#2EC4B6',        // Tiffany Blue
                    white: '#FFFFFF',       // White
                },

                // Tomato & Herb: Attention-grabbing with sophisticated grounding
                tomato: {
                    red: '#E63946',         // Warm Red
                    aqua: '#A8DADC',        // Soft Aqua
                    navy: '#1D3557',        // Navy Blue
                },

                // Sunshine & Spice: Warm, earthy, artisan feel
                sunshine: {
                    orange: '#F4A261',      // Sandy Orange
                    terracotta: '#E76F51',  // Terracotta
                    teal: '#264653',        // Charcoal Teal
                },

                // Primary palette (using Citrus Burst as default)
                primary: {
                    DEFAULT: '#FF9F1C',     // Citrus Orange
                    dark: '#E68A00',        // Darker orange
                    light: '#FFB347',       // Lighter orange
                },
                secondary: {
                    DEFAULT: '#2EC4B6',     // Tiffany Blue
                    dark: '#26A69A',        // Darker blue
                    light: '#4DD0C3',       // Lighter blue
                },
                accent: {
                    DEFAULT: '#E63946',     // Warm Red (from Tomato)
                    dark: '#C62E3A',        // Darker red
                    light: '#EE5A66',       // Lighter red
                },

                // Additional utility colors
                teal: '#264653',            // Charcoal Teal (from Sunshine)
                coral: '#E76F51',           // Terracotta (from Sunshine)
                aqua: '#A8DADC',            // Soft Aqua (from Tomato)

                gray: {
                    50: '#F8F9FA',
                    100: '#F1F3F5',
                    200: '#E9ECEF',
                    300: '#DEE2E6',
                    400: '#ADB5BD',
                    500: '#6C757D',
                    600: '#495057',
                    700: '#343A40',
                    800: '#212529',
                    900: '#1A1D21',
                },
            },
            fontFamily: {
                primary: ['Inter', 'sans-serif'],
                display: ['Outfit', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
