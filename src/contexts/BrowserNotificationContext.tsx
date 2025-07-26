'use client';

import { createContext, useEffect, useState } from "react";
import { ContextProviderProps } from "@/contexts/ContextTypes";
import { Status } from "@/components/misc/StatusIndicator";

type NotificationAvailability = NotificationPermission | "unsupported";
export type BrowserNotification = Notification;

export type BrowserNotificationContextType = {
    availability: {
        value: NotificationAvailability,
        text: string,
        status: Status
    },
    requestPermission: () => void,
    isPotentiallyAvailable: boolean,
    push: (title: string, options?: NotificationOptions) => Notification
}

const availabilityInfo: { [key in NotificationAvailability]: { status: Status, text: string } } = {
    unsupported: {
        text: "Nicht unterstützt",
        status: "gray"
    },
    default: {
        text: "Nicht festgelegt",
        status: "yellow"
    },
    denied: {
        text: "Blockiert",
        status: "red"
    },
    granted: {
        text: "Erlaubt",
        status: "green"
    }
}

const EmptyConfiguration: BrowserNotificationContextType = {
    availability: {
        value: "unsupported",
        ...availabilityInfo["unsupported"]
    },
    isPotentiallyAvailable: false,
    requestPermission: () => {},
    push: () => undefined!
}

export const BrowserNotificationContext = createContext<BrowserNotificationContextType>(EmptyConfiguration);

export default function BrowserNotificationProvider({ children }: ContextProviderProps) {
    const [availability, setAvailability] = useState<NotificationAvailability>("unsupported");

    useEffect(() => {
        if ("Notification" in window) {
            setAvailability(Notification.permission);

            navigator.permissions.query({ name: "notifications" })
                .then(
                    status => {
                        status.onchange = () => setAvailability(Notification.permission);
                    }
                );
        }
    }, []);

    function requestPermission() {
        if (availability === "unsupported") {
            return;
        }

        Notification.requestPermission()
            .then(() => setAvailability(Notification.permission));
    }

    function push(title: string, options?: NotificationOptions) {
        return new Notification(title, options);
    }

    return (
        <BrowserNotificationContext.Provider
            value={{
                availability: {
                    value: availability,
                    ...availabilityInfo[availability]
                },
                requestPermission,
                isPotentiallyAvailable: availability !== "unsupported" && availability !== "denied",
                push
            }}
        >
            {children}
        </BrowserNotificationContext.Provider>
    );
}

