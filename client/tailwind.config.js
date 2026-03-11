/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#7C3AED',
                    dark: '#6D28D9',
                },
                secondary: {
                    DEFAULT: '#1E293B',
                    dark: '#0F172A',
                },
                accent: '#3B82F6',
                background: {
                    dark: '#0F172A',
                    light: '#F8FAFC',
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
