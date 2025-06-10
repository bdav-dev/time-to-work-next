'use client';

import { createContext, useEffect, useState } from "react";
import Time from "@/time/Time";
import { ContextProviderProps } from "@/contexts/ContextTypes";


export const TimeContext = createContext<Time | undefined>(undefined);

const SECONDS_ADDITION = 3;

export function TimeProvider({ children }: ContextProviderProps) {
    const [time, setTime] = useState<Time>();

    useEffect(() => {
        setTime(Time.now());
        runEveryTimeWhenMinuteChanges(() => {
            const now = new Date();
            const hours = now.getHours();
            const minutes = now.getMinutes();
            const seconds = now.getSeconds();

            const time = Time.of(hours, minutes + ((seconds + SECONDS_ADDITION) / 60));

            setTime(time);
        });
    }, []);

    return (
        <TimeContext.Provider value={time}>
            {children}
        </TimeContext.Provider>
    );
}

const ONE_MINUTE_IN_MS = 60 * 1000;

function runEveryTimeWhenMinuteChanges(callback: () => void) {
    const now = new Date();
    const delayInMs = ONE_MINUTE_IN_MS - now.getMilliseconds() - now.getSeconds() * 1000;

    setTimeout(
        () => {
            callback();
            runEveryTimeWhenMinuteChanges(callback);
        },
        delayInMs
    );
}
