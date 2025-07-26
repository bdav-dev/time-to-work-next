'use client';

import { createContext, CSSProperties, useState } from "react";
import { ContextProviderProps } from "@/contexts/ContextTypes";
import { delay } from "@/util/PromiseUtils";


export type Notification = {
    id: string,
    title: string,
    body: string,
    onClear?: () => void
}

type NotificationContextType = {
    notification: Notification | undefined,
    push: (newNotification: Notification) => void,
    update: (notification: Notification) => void,
    clear: (notificationToClear?: Notification) => void,
    animationStyles: CSSProperties
}
const EmptyNotificationContext: NotificationContextType = {
    notification: undefined,
    push: () => {},
    update: () => {},
    clear: () => {},
    animationStyles: {}
}
export const NotificationContext = createContext<NotificationContextType>(EmptyNotificationContext);

const APPEAR_DISAPPEAR_ANIMATION_DURATION_IN_SECONDS = 0.25;
const APPEAR_STYLES: CSSProperties = { animation: `notification-appear ${APPEAR_DISAPPEAR_ANIMATION_DURATION_IN_SECONDS}s ease-out forwards` };
const DISAPPEAR_STYLES: CSSProperties = { animation: `notification-disappear ${APPEAR_DISAPPEAR_ANIMATION_DURATION_IN_SECONDS}s ease-in forwards` };

export default function NotificationProvider({ children }: ContextProviderProps) {
    const [notification, setNotification] = useState<Notification>();
    const [animationStyles, setAnimationStyles] = useState<CSSProperties>({});

    async function push(newNotification: Notification) {
        if (notification) {
            await clear();
        }
        setAnimationStyles(APPEAR_STYLES);
        setNotification(newNotification);
    }

    function update(updatedNotification: Notification) {
        if (notification && notification.id === updatedNotification.id) {
            setNotification(updatedNotification);
        }
    }

    async function clear(notificationToClear?: Notification) {
        if (notificationToClear?.id !== notification?.id) {
            return;
        }
        setAnimationStyles(DISAPPEAR_STYLES);
        await delay(APPEAR_DISAPPEAR_ANIMATION_DURATION_IN_SECONDS * 1000);
        notification?.onClear?.();
        setNotification(undefined);
    }

    return (
        <NotificationContext.Provider value={{ notification, push, update, clear, animationStyles }}>
            {children}
        </NotificationContext.Provider>
    );
}
