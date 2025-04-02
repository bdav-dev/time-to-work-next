'use client';

import React, { createContext, useEffect, useState } from "react";
import Time from "@/time/Time";


export const TimeContext = createContext<Time>(Time.now());

export function TimeProvider({ children }: { children?: React.ReactNode }) {
    const [time, setTime] = useState<Time>(Time.now());

    useEffect(() => {
        runEveryTimeWhenMinuteChanges(() => setTime(Time.now()));
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
    const delayInMs = ONE_MINUTE_IN_MS - now.valueOf() % ONE_MINUTE_IN_MS;

    setTimeout(
        () => {
            callback();
            runEveryTimeWhenMinuteChanges(callback);
        },
        delayInMs
    );
}

