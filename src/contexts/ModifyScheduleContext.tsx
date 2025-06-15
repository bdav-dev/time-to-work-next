'use client';

import { createContext } from "react";
import { ContextProviderProps } from "@/contexts/ContextTypes";
import Time from "@/time/Time";
import { ScheduleBlockTimeType } from "@/schedule/ScheduleBlockTimeType";
import useTime from "@/hooks/UseTime";
import useSchedule from "@/hooks/UseSchedule";
import useMessaging from "@/hooks/UseMessaging";
import { Message } from "@/contexts/MessageContext";
import { DisplayableError } from "@/error/DisplayableError";
import TimeInterval from "@/time/TimeInterval";
import { Schedule } from "@/schedule/Schedule";
import ScheduleOperations from "@/schedule/ScheduleOperations";


type ModifyScheduleContextType = {
    addTimeInterval: (startTime: Time | undefined, endTime: Time | undefined, time: ScheduleBlockTimeType) => boolean,
    closeAndOpenTimeStamp: (time: Time, timeType: ScheduleBlockTimeType) => boolean,
    openTimeStamp: (time: Time, timeType: ScheduleBlockTimeType) => boolean,
    closeTimeStamp: (closeTimeStampAt: Time) => boolean
}

const EmptyModifyScheduleContext: ModifyScheduleContextType = {
    addTimeInterval: () => false,
    closeAndOpenTimeStamp: () => false,
    closeTimeStamp: () => false,
    openTimeStamp: () => false
}

export const ModifyScheduleContext = createContext<ModifyScheduleContextType>(EmptyModifyScheduleContext);

export default function ModifyScheduleContextProvider({ children }: ContextProviderProps) {
    const now = useTime();
    const { schedule, setSchedule } = useSchedule();
    const { set: setMessage } = useMessaging();

    function addTimeInterval(
        startTime: Time | undefined,
        endTime: Time | undefined,
        time: ScheduleBlockTimeType
    ): boolean {
        if (!startTime || !endTime) {
            setMessage(createTimeIntervalErrorMessage('Das Start- oder Endfeld ist leer.'));
            return false;
        }

        let timeInterval: TimeInterval;
        try {
            timeInterval = TimeInterval.of(startTime, endTime)
        } catch (ignored) {
            setMessage(
                createTimeIntervalErrorMessage('Die Endzeit des Zeitintervalls darf nicht vor der Startzeit liegen.')
            );
            return false;
        }

        let newSchedule: Schedule;
        try {
            newSchedule =
                ScheduleOperations.addTimeInterval(
                    schedule,
                    now,
                    timeInterval,
                    time
                );
        } catch (error) {
            showErrorMessage(error);
            return false;
        }

        setSchedule(newSchedule);
        return true;
    }

    function closeAndOpenTimeStamp(time: Time, timeType: ScheduleBlockTimeType): boolean {
        let newSchedule;
        try {
            newSchedule = ScheduleOperations.closeTimeStamp(schedule, time, now);
            newSchedule = ScheduleOperations.openTimeStamp(newSchedule, time, now, timeType);
        } catch (error) {
            showErrorMessage(error);
            return false;
        }

        setSchedule(newSchedule);
        return true;
    }

    function openTimeStamp(openTimeStampAt: Time, timeType: ScheduleBlockTimeType): boolean {
        let newSchedule;
        try {
            newSchedule =
                ScheduleOperations.openTimeStamp(
                    schedule,
                    openTimeStampAt,
                    now,
                    timeType
                );
        } catch (error) {
            showErrorMessage(error);
            return false;
        }

        setSchedule(newSchedule);
        return true;
    }

    function closeTimeStamp(closeTimeStampAt: Time): boolean {
        let newSchedule;
        try {
            newSchedule =
                ScheduleOperations.closeTimeStamp(
                    schedule,
                    closeTimeStampAt,
                    now
                );
        } catch (error) {
            showErrorMessage(error);
            return false;
        }

        setSchedule(newSchedule);
        return true;
    }

    function showErrorMessage(error: unknown) {
        setMessage(
            error instanceof DisplayableError
                ? createTimeStampErrorMessage(error.message, error.messageRetentionInSeconds)
                : createTimeStampErrorMessage(DisplayableError.unknown().message)
        );
    }

    return (
        <ModifyScheduleContext.Provider
            value={{
                addTimeInterval,
                closeAndOpenTimeStamp,
                openTimeStamp,
                closeTimeStamp
            }}
        >
            {children}
        </ModifyScheduleContext.Provider>
    );

}

function createTimeIntervalErrorMessage(body: string, retentionInSeconds?: number): Message {
    return {
        body,
        retentionInSeconds: retentionInSeconds ?? 5,
        title: 'Fehler beim Hinzufügen',
        type: 'error'
    }
}

function createTimeStampErrorMessage(body: string, retentionInSeconds?: number): Message {
    return {
        body,
        retentionInSeconds: retentionInSeconds ?? 5,
        title: 'Fehler beim Stempeln',
        type: 'error'
    };
}
