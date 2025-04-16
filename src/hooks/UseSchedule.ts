import { Dispatch, SetStateAction, useContext } from "react";
import { ScheduleContext } from "@/contexts/ScheduleContext";
import { Schedule } from "@/schedule/Schedule";


export default function useSchedule(): [Schedule, Dispatch<SetStateAction<Schedule>>] {
    const { schedule, setSchedule } = useContext(ScheduleContext);
    return [schedule, setSchedule];
}