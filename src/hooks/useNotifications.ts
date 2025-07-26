import { NotificationContext } from "@/contexts/NotificationContext";
import { useContext } from "react";


export default function useNotifications() {
    return useContext(NotificationContext);
}
