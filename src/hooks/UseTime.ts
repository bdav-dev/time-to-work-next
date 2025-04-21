import { useContext } from "react";
import { TimeContext } from "@/contexts/TimeContext";
import Time from "@/time/Time";


export default function useTime() {
    return useContext(TimeContext) ?? Time.midnight();
}
