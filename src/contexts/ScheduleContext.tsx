'use client';


import { createContext, Dispatch, SetStateAction } from "react";
import { Schedule, ScheduleSerialization } from "@/schedule/Schedule";
import { ContextProviderProps } from "@/contexts/ContextTypes";
import useStateWithLocalStorage from "@/hooks/UseStateWithLocalStorage";

type ScheduleContextType = {
    schedule: Schedule,
    setSchedule: Dispatch<SetStateAction<Schedule>>,
}

export const ScheduleContext = createContext<ScheduleContextType>({ schedule: [], setSchedule: () => {} });


export default function ScheduleProvider({ children }: ContextProviderProps) {
    const [schedule, setSchedule] = useStateWithLocalStorage<Schedule>('ttw-n.schedule', [], ScheduleSerialization);

    return (
        <ScheduleContext.Provider value={{ schedule, setSchedule }}>
            {children}
        </ScheduleContext.Provider>
    );
}






