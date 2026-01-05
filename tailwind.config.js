/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./frontend/**/*.{html,js}"],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#FF6B35',
                    dark: '#E85A2A',
                    light: '#FF8557',
                },
                secondary: {
                    DEFAULT: '#004E89',
                    dark: '#003A66',
                    light: '#1A6BA8',
                },
                accent: {
                    DEFAULT: '#F7B801',
                    dark: '#D99F00',
                },
                teal: '#1A936F',
                coral: '#FF6B6B',
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
