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
                background: "var(--background)",


                whiteNeumorphicLightShadow: 'rgb(255, 255, 255)',
                whiteNeumorphicDarkShadow: 'rgb(209, 217, 230)',


                grayNeumorphicLightShadow: 'rgb(62, 63, 70)',
                grayNeumorphicDarkShadow: 'rgb(35, 35, 35)'
            },
        },
    },
    darkMode: 'class',
    plugins: [],
} satisfies Config;
