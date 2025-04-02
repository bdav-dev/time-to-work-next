import { useContext } from "react";
import { TimeContext } from "@/contexts/TimeContext";


export default function useTime() {
    return useContext(TimeContext);
}
