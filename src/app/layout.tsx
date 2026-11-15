import type { Metadata } from "next";
import "./globals.css";
import './neumorphic.css';
import { ReactNode } from "react";
import StyledJsxRegistry from "@/app/registry";
import ThemeProvider from "@/contexts/ThemeContext";
import { TimeProvider } from "@/contexts/TimeContext";
import ScheduleProvider from "@/contexts/ScheduleContext";
import MessageProvider from "@/contexts/MessageContext";
import ConfigurationProvider from "@/contexts/ConfigurationContext";
import Footer from "@/components/layout/page/Footer";
import { CascadiaCode } from "@/font/CascadiaCode";
import ModifyScheduleContextProvider from "@/contexts/ModifyScheduleContext";
import NotificationProvider from "@/contexts/NotificationContext";
import BrowserNotificationProvider from "@/contexts/BrowserNotificationContext";
import { MATERIAL_SYMBOLS_API_URL } from "@/icons/material/MaterialSymbol";
import { parseTheme, Theme, THEME_COOKIE } from "@/library/theme";
import { cookies } from "next/headers";

export const metadata: Metadata = {
    title: "time-to-work",
    description: "Arbeitszeitdashboard"
};

export default async function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
    const initialTheme = parseTheme((await cookies()).get(THEME_COOKIE)?.value);

    return (
        <html
            lang={"de"}
            className={`${CascadiaCode.className} ${initialTheme === 'dark' ? 'dark' : ''}`}
            suppressHydrationWarning
        >
        <head>
            <link rel="stylesheet" href={MATERIAL_SYMBOLS_API_URL}/>
        </head>
        <ContextProvider initialTheme={initialTheme}>
            <body
                className={`
                    flex flex-col min-h-dvh
                    text-neumorphic-700 dark:text-neumorphic-150 
                    stroke-neumorphic-700 dark:stroke-neumorphic-150
                    fill-neumorphic-700 dark:fill-neumorphic-150
                `}
            >
            <StyledJsxRegistry>
                <div className={'flex-1 flex flex-col'}>
                    {children}
                </div>
                <Footer/>
            </StyledJsxRegistry>
            </body>
        </ContextProvider>
        </html>
    );
}

function ContextProvider({ initialTheme, children }: { initialTheme: Theme, children: ReactNode }) {
    return (
        <ThemeProvider initialTheme={initialTheme}>
            <TimeProvider>
                <ScheduleProvider>
                    <MessageProvider>
                        <BrowserNotificationProvider>
                            <NotificationProvider>
                                <ConfigurationProvider>
                                    <ModifyScheduleContextProvider>
                                        {children}
                                    </ModifyScheduleContextProvider>
                                </ConfigurationProvider>
                            </NotificationProvider>
                        </BrowserNotificationProvider>
                    </MessageProvider>
                </ScheduleProvider>
            </TimeProvider>
        </ThemeProvider>
    );
}
