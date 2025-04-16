import { ReactNode } from "react";
import ThemeProvider from "@/contexts/ThemeContext";
import { TimeProvider } from "@/contexts/TimeContext";
import MessageProvider from "@/contexts/MessageContext";
import ConfigurationProvider from "@/contexts/ConfigurationContext";
import ScheduleProvider from "@/contexts/ScheduleContext";


export default function ContextProvider({ children }: { children: ReactNode }) {
    return (
        <ThemeProvider>
            <TimeProvider>
                <ScheduleProvider>
                    <MessageProvider>
                        <ConfigurationProvider>
                            {children}
                        </ConfigurationProvider>
                    </MessageProvider>
                </ScheduleProvider>
            </TimeProvider>
        </ThemeProvider>
    );
}
