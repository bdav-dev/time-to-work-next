import type { Metadata } from "next";
import "./globals.css";
import './neumorphic.css';
import { ReactNode } from "react";
import ThemeApplier from "@/components/theme/ThemeApplier";
import StyledJsxRegistry from "@/app/registry";
import ThemeProvider from "@/contexts/ThemeContext";
import { TimeProvider } from "@/contexts/TimeContext";
import ScheduleProvider from "@/contexts/ScheduleContext";
import MessageProvider from "@/contexts/MessageContext";
import ConfigurationProvider from "@/contexts/ConfigurationContext";
import Footer from "@/components/layout/page/Footer";
import { CascadiaCode } from "@/font/CascadiaCode";
import ModifyScheduleContextProvider from "@/contexts/ModifyScheduleContext";


export const metadata: Metadata = {
    title: "time-to-work",
    description: "Arbeitszeitdashboard",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
    return (
        <html lang="de">
        <ContextProvider>
            <body className={CascadiaCode.className}>
            <ThemeApplier>
                <StyledJsxRegistry>
                    <div
                        className={`
                            flex flex-col min-h-screen
                            antialiased
                            bg-neumorphic-100 dark:bg-neumorphic-750 
                            text-neumorphic-700 dark:text-neumorphic-150 
                            stroke-neumorphic-700 dark:stroke-neumorphic-150
                            fill-neumorphic-700 dark:fill-neumorphic-150 
                        `}
                    >
                        <div className={'flex-1 flex flex-col'}>
                            {children}
                        </div>
                        <Footer/>
                    </div>
                </StyledJsxRegistry>
            </ThemeApplier>
            </body>
        </ContextProvider>
        </html>
    );
}

function ContextProvider({ children }: { children: ReactNode }) {
    return (
        <ThemeProvider>
            <TimeProvider>
                <ScheduleProvider>
                    <MessageProvider>
                        <ConfigurationProvider>
                            <ModifyScheduleContextProvider>
                                {children}
                            </ModifyScheduleContextProvider>
                        </ConfigurationProvider>
                    </MessageProvider>
                </ScheduleProvider>
            </TimeProvider>
        </ThemeProvider>
    );
}
