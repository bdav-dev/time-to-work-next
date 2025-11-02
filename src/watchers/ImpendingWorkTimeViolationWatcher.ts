import useSchedule from "@/hooks/UseSchedule";
import useTime from "@/hooks/UseTime";
import { useEffect, useState } from "react";
import ScheduleCalculations from "@/schedule/ScheduleCalculations";
import TimeSpan from "@/time/TimeSpan";
import useConfigurationValue from "@/hooks/configuration/UseConfigurationValue";
import { compare } from "@/util/CompareUtils";
import useNotifications from "@/hooks/useNotifications";
import useStateWithLocalStorage from "@/hooks/UseStateWithLocalStorage";
import { Notification } from "@/contexts/NotificationContext";
import useConfigurationBundle from "@/hooks/configuration/UseConfigurationBundle";
import useBrowserNotifications from "@/hooks/UseBrowserNotifications";
import { isEmpty } from "@/util/ArrayUtils";

type NotifyResult = {
    pushBrowserNotification: boolean,
    currentWorkTimeBlockDuration: TimeSpan
    durationUntilViolation: TimeSpan,
    maxWorkTimeBlockDuration: TimeSpan
}

export default function ImpendingWorkTimeViolationWatcher() {
    const { schedule } = useSchedule();
    const now = useTime();
    const maxWorkTimeBlockDuration = useConfigurationValue(config => config.workingTime.maxWorkTimeBlockDuration);
    const impendingWorkTimeViolation = useConfigurationBundle(config => config.workingTime._impendingWorkTimeViolation);

    const notifications = useNotifications();
    const browserNotifications = useBrowserNotifications();

    const [isDismissed, setDismissed] = useStateWithLocalStorage("ttw-n.isImpendingWorkTimeViolationNotificationDismissed", false);

    const [notification, setNotification] = useState<Notification>();

    useEffect(() => {
        if (!isEmpty(schedule) && !ScheduleCalculations.hasOpenWorkTimeStamp(schedule)) {
            setDismissed(false);
        }
    }, [schedule]);

    useEffect(probe, [now, schedule, maxWorkTimeBlockDuration, impendingWorkTimeViolation.notify, impendingWorkTimeViolation.threshold]);

    function probe() {
        const notifyResult = analyse();

        if (notifyResult?.pushBrowserNotification) {
            pushBrowserNotification(notifyResult);
        }

        if (notifyResult) {
            if (notification) {
                updateNotification(notifyResult);
            } else {
                pushNotification(notifyResult);
            }
        } else {
            clearNotification();
        }
    }

    function analyse(): NotifyResult | undefined {
        if (
            !impendingWorkTimeViolation.notify
            || !impendingWorkTimeViolation.threshold
            || !maxWorkTimeBlockDuration
            || isDismissed
        ) {
            return;
        }

        const openWorkTimeStamp = ScheduleCalculations.getOpenWorkTimeStamp(schedule);
        if (!openWorkTimeStamp) {
            return;
        }

        const currentWorkTimeBlockDuration = TimeSpan.ofTimeDifference(openWorkTimeStamp.startTime, now);
        const durationUntilViolation = maxWorkTimeBlockDuration.subtract(currentWorkTimeBlockDuration);

        if (!compare(durationUntilViolation, 'lessOrEqualThan', impendingWorkTimeViolation.threshold)) {
            return;
        }

        return {
            pushBrowserNotification: compare(durationUntilViolation, 'equal', impendingWorkTimeViolation.threshold),
            currentWorkTimeBlockDuration,
            durationUntilViolation,
            maxWorkTimeBlockDuration
        };
    }

    function pushBrowserNotification(notifyResult: NotifyResult) {
        browserNotifications.push(
            createNotificationTitle(notifyResult.durationUntilViolation),
            {
                body: createNotificationTimeViolationText(notifyResult.durationUntilViolation, notifyResult.maxWorkTimeBlockDuration),
                icon: "/app-icons/ttw-app-icon-dark.png",
                badge: "/apple-icon.png"
            },
        );
    }

    function pushNotification(notifyResult: NotifyResult) {
        const newNotification = createNotification(notifyResult);
        newNotification.onClear = fromUser => {
            if (fromUser) {
                setDismissed(true);
            }
            setNotification(undefined);
        };
        setNotification(newNotification);
        notifications.push(newNotification);
    }

    function updateNotification(notifyResult: NotifyResult) {
        if (!notification) {
            return;
        }
        notification.title = createNotificationTitle(notifyResult.durationUntilViolation)
        notification.body = createNotificationBody(notifyResult);
        notification.type = createNotificationMessageType(notifyResult);
        notifications.update(notification);
    }

    function clearNotification() {
        if (notification) {
            notifications.clear({ ifCurrentIs: notification });
        }
        setNotification(undefined);
    }

}

function createNotification(notifyResult: NotifyResult): Notification {
    return {
        id: Math.random().toString(),
        type: createNotificationMessageType(notifyResult),
        title: createNotificationTitle(notifyResult.durationUntilViolation),
        body: createNotificationBody(notifyResult)
    };
}

function createNotificationTitle(durationUntilViolation: TimeSpan): string {
    return compare(durationUntilViolation, 'lessThan', TimeSpan.zero())
        ? "Arbeitszeitverletzung"
        : "Bevorstehende Arbeitszeitverletzung";
}

function createNotificationMessageType(notifyResult: NotifyResult) {
    return compare(notifyResult.durationUntilViolation, 'lessOrEqualThan', TimeSpan.zero()) ? 'error' : 'warning';
}

function createNotificationBody(notifyResult: NotifyResult) {
    return `Deine Arbeitszeit am Stück beträgt aktuell ${notifyResult.currentWorkTimeBlockDuration}. ` +
        createNotificationTimeViolationText(notifyResult.durationUntilViolation, notifyResult.maxWorkTimeBlockDuration);
}

function createNotificationTimeViolationText(durationUntilViolation: TimeSpan, maxWorkTimeBlockDuration: TimeSpan): string {
    if (compare(durationUntilViolation, 'equal', TimeSpan.zero())) {
        return "Die maximale Arbeitszeit am Stück ist erreicht.";
    }

    return compare(durationUntilViolation, 'lessThan', TimeSpan.zero())
        ? `Seit ${durationUntilViolation.absolute()} ist die maximale Arbeitszeit am Stück von ${maxWorkTimeBlockDuration} überschritten.`
        : `In ${durationUntilViolation} wird die maximale Arbeitszeit am Stück von ${maxWorkTimeBlockDuration} erreicht.`;
}
