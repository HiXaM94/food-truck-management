/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./frontend/**/*.{html,js}"],
    theme: {
        extend: {
            colors: {
                // CORE BRAND PALETTE - Futuristic & Confident
                primary: {
                    DEFAULT: '#0066FF',      // Electric Blue - modern, tech-forward, trustworthy
                    light: '#3395FF',
                    dark: '#0052CC',
                    muted: '#E6F0FF',
                },
                secondary: {
                    DEFAULT: '#00D4AA',      // Cyan-Turquoise - fresh, energetic, indicates action
                    light: '#33DDBA',
                    dark: '#00AA88',
                    muted: '#E6F7F3',
                },

                // UI & DATA VISUALIZATION PALETTE
                ui: {
                    surface: '#FFFFFF',
                    card: '#F8FAFC',
                    sidebar: '#0F172A',     // Deep Space Blue - sophisticated dark mode
                    border: '#E2E8F0',
                },

                // SEMANTIC & FUNCTIONAL COLORS (Clear meaning)
                success: {
                    DEFAULT: '#10B981',      // Emerald Green
                    light: '#D1FAE5',
                    dark: '#059669',
                },
                warning: {
                    DEFAULT: '#F59E0B',      // Amber
                    light: '#FEF3C7',
                    dark: '#D97706',
                },
                error: {
                    DEFAULT: '#EF4444',      // Crimson Red
                    light: '#FEE2E2',
                    dark: '#DC2626',
                },
                info: {
                    DEFAULT: '#8B5CF6',      // Vibrant Purple (instead of standard blue)
                    light: '#EDE9FE',
                    dark: '#7C3AED',
                },

                // ACCENT COLORS (For highlights, tags, special status)
                accent: {
                    purple: '#8B5CF6',       // Vibrant Purple
                    pink: '#EC4899',         // Hot Pink
                    amber: '#F59E0B',        // Amber
                    lime: '#84CC16',         // Lime Green
                    DEFAULT: '#00D4AA',      // Default accent mapping
                },

                // NEUTRAL SCALE - Cool, sophisticated grays
                neutral: {
                    50: '#F8FAFC',
                    100: '#F1F5F9',
                    200: '#E2E8F0',
                    300: '#CBD5E1',
                    400: '#94A3B8',
                    500: '#64748B',
                    600: '#475569',
                    700: '#334155',
                    800: '#1E293B',
                    900: '#0F172A',
                },

                // SPECIAL MODERN EFFECTS
                gradient: {
                    start: '#0066FF',       // For gradient buttons/cards
                    end: '#00D4AA',
                },

                // DARK MODE READY
                dark: {
                    surface: '#0F172A',
                    card: '#1E293B',
                    border: '#334155',
                    text: '#F1F5F9',
                },

                // Backwards compatibility mappings
                gray: {
                    50: '#F8FAFC',
                    100: '#F1F5F9',
                    200: '#E2E8F0',
                    300: '#CBD5E1',
                    400: '#94A3B8',
                    500: '#64748B',
                    600: '#475569',
                    700: '#334155',
                    800: '#1E293B',
                    900: '#0F172A',
                }
            },

            // MODERN GRADIENTS
            backgroundImage: {
                'primary-gradient': 'linear-gradient(135deg, #0066FF 0%, #00D4AA 100%)',
                'sidebar-gradient': 'linear-gradient(180deg, #0F172A 0%, #1E293B 100%)',
                'card-gradient': 'linear-gradient(145deg, #FFFFFF 0%, #F8FAFC 100%)',
            },

            // MODERN SHADOWS
            boxShadow: {
                'soft': '0 4px 20px rgba(0, 102, 255, 0.08)',
                'medium': '0 8px 30px rgba(0, 102, 255, 0.12)',
                'hard': '0 12px 40px rgba(0, 102, 255, 0.15)',
                'inner-glow': 'inset 0 2px 4px rgba(255, 255, 255, 0.1)',
            },

            fontFamily: {
                primary: ['Inter', 'sans-serif'],
                display: ['Outfit', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'], // Added for data/code
            }
        },
    },
    plugins: [],
    darkMode: 'class', // Enable dark mode with class strategy
}
