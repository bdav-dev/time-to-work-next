'use client';

import React, { createContext, useEffect, useState } from "react";
import Time from "@/time/Time";


const ONE_MINUTE = 60 * 1000;

export const TimeContext = createContext<Time>(Time.now());

export function TimeProvider({ children }: { children?: React.ReactNode }) {
    const [time, setTime] = useState<Time>(Time.now());

    useEffect(() => {
        repeatEvery(
            () => setTime(Time.now()),
            ONE_MINUTE
        );
    }, []);

    return (
        <TimeContext.Provider value={time}>
            {children}
        </TimeContext.Provider>
    );

}

function repeatEvery(func: () => void, interval: number) {
    const now = new Date();
    const delay = interval - now.valueOf() % interval;

    function start() {
        func();
        repeatEvery(func, interval);
    }

    setTimeout(start, delay);
}

