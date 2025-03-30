import type { Config } from "tailwindcss";

export default {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                neumorphic: {
                    50: '#f5f8fa',
                    100: '#ecf0f3',
                    150: '#e8e8e8',
                    200: '#dbdfe3',
                    300: '#c9ced4',
                    400: '#9a9ca1',
                    500: '#6a6c73',
                    600: '#4a4c52',
                    700: '#3b3d43',
                    750: '#303135',
                    800: '#232428',
                    900: '#111217',
                    950: '#04050a'
                }
            },
        },
    },
    darkMode: 'class',
    plugins: [],
} satisfies Config;
