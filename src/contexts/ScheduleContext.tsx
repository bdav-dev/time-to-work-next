'use client';


import { createContext, Dispatch, SetStateAction } from "react";
import { Schedule, ScheduleSerialization } from "@/schedule/Schedule";
import { ContextProviderProps } from "@/contexts/ContextTypes";
import useStateWithLocalStorage from "@/hooks/UseStateWithLocalStorage";
import { getCurrentDateAsString } from "@/util/DateUtils";


export type ScheduleContextType = {
    schedule: Schedule,
    setSchedule: Dispatch<SetStateAction<Schedule>>,
    dateOfSchedule: string,
    setDateOfSchedule: Dispatch<SetStateAction<string>>
}

export const ScheduleContext = createContext<ScheduleContextType>(
    { schedule: [], setSchedule: () => {}, setDateOfSchedule: () => {}, dateOfSchedule: '' }
);

export default function ScheduleProvider({ children }: ContextProviderProps) {
    const [schedule, setSchedule] = useStateWithLocalStorage<Schedule>('ttw-n.schedule', [], ScheduleSerialization);
    const [dateOfSchedule, setDateOfSchedule] = useStateWithLocalStorage<string>('ttw-n.dateOfSchedule', getCurrentDateAsString());

    return (
        <ScheduleContext.Provider value={{ schedule, setSchedule, dateOfSchedule, setDateOfSchedule }}>
            {children}
        </ScheduleContext.Provider>
    );
}
