import { ModifyScheduleContext } from "@/contexts/ModifyScheduleContext";
import { useContext } from "react";


export default function useModifySchedule() {
    return useContext(ModifyScheduleContext);
}
