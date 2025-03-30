import type { Metadata } from "next";
import "./globals.css";
import './neumorphic.css';
import React from "react";
import ThemeProvider from "@/contexts/ThemeContext";
import ThemeApplier from "@/components/theme/ThemeApplier";
import StyledJsxRegistry from "@/app/registry";


export const metadata: Metadata = {
    title: "Time to Work",
    description: "Generated by create next app",
};

export default function RootLayout(
    { children }: Readonly<{ children: React.ReactNode }>
) {
    return (
        <html lang="en">
        <ThemeProvider>
            <body>
            <ThemeApplier className={'h-screen w-screen'}>
                <StyledJsxRegistry>
                    <div
                        className={`
                            antialiased
                            h-screen w-screen
                            bg-neumorphic-100 dark:bg-neumorphic-750 
                            text-neumorphic-700 dark:text-neumorphic-150 
                            stroke-neumorphic-700 dark:stroke-neumorphic-150
                        `}
                    >
                        {children}
                    </div>
                </StyledJsxRegistry>
            </ThemeApplier>
            </body>
        </ThemeProvider>
        </html>
    );
}
