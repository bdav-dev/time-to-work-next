import { Dispatch, SetStateAction, useContext } from "react";
import { ScheduleContext, ScheduleContextType } from "@/contexts/ScheduleContext";
import { Schedule } from "@/schedule/Schedule";


export default function useSchedule(): ScheduleContextType {
    return useContext(ScheduleContext);
}