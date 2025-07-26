import { BrowserNotificationContext } from "@/contexts/BrowserNotificationContext";
import { useContext } from "react";

export default function useBrowserNotifications() {
    return useContext(BrowserNotificationContext);
}
