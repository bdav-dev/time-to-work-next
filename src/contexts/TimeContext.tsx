'use client';

import { createContext, useEffect, useState } from "react";
import Time from "@/time/Time";
import { ContextProviderProps } from "@/contexts/ContextTypes";


export const TimeContext = createContext<Time | undefined>(undefined);

const SECONDS_ADDITION = 3;

export function TimeProvider(props: ContextProviderProps) {
    const [time, setTime] = useState<Time>();

    /*
    useEffect(() => {
        setTime(Time.of(13, 0));
    }, []);
    */

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
            {props.children}
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
    console.log(format(now) + `Refresh time in ${delayInMs / 1000}s`);
}


function format(date: Date) {
    return date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + ":" + date.getMilliseconds() + ":  ";
}