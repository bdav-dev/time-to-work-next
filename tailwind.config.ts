import type { Config } from "tailwindcss";

export default {
    content: [
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                neumorphic: {
                    50: '#f5f8fa',
                    100: '#ecf0f3',
                    150: '#e0e4e8',
                    200: '#dbdfe3',
                    300: '#c9ced4',
                    400: '#9a9ca1',
                    500: '#6a6c73',
                    600: '#4a4c52',
                    700: '#3b3d43',
                    750: '#303135',
                    800: '#242528',
                    850: '#1b1c1f',
                    900: '#111217',
                    950: '#04050a'
                },
                'white-neumorphic-accent-bright': 'rgb(255, 255, 255)',
                'white-neumorphic-accent-shadow': 'rgb(209, 217, 230)',
                'gray-neumorphic-accent-bright': 'rgb(62, 63, 70)',
                'gray-neumorphic-accent-shadow': 'rgb(35, 35, 35)'
            }
        },
    },
    darkMode: 'class',
    plugins: [],
} satisfies Config;
