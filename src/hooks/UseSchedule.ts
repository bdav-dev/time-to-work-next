import { useContext } from "react";
import { ScheduleContext, ScheduleContextType } from "@/contexts/ScheduleContext";


export default function useSchedule(): ScheduleContextType {
    return useContext(ScheduleContext);
}