import Time from "@/time/Time";
import { ScheduleBlockTimeType } from "@/schedule/ScheduleBlockTimeType";
import TimeInterval from "@/time/TimeInterval";
import { Schedule } from "@/schedule/Schedule";
import ScheduleOperations from "@/schedule/ScheduleOperations";
import { Message } from "@/contexts/MessageContext";
import { DisplayableError } from "@/error/DisplayableError";


export type ScheduleModificationContext = {
    now: Time,
    schedule: Schedule,
    setSchedule: (schedule: Schedule) => void,
    setMessage: (message: Message) => void
}

export class ModifySchedule {
    private readonly context: ScheduleModificationContext;

    private constructor(context: ScheduleModificationContext) {
        this.context = context;
    }

    static withContext(context: ScheduleModificationContext) {
        return new ModifySchedule(context);
    }

    addTimeInterval(
        startTime: Time | undefined,
        endTime: Time | undefined,
        time: ScheduleBlockTimeType
    ): boolean {
        if (!startTime || !endTime) {
            this.context.setMessage(this.createTimeIntervalErrorMessage('Das Start- oder Endfeld ist leer.'));
            return false;
        }

        let timeInterval: TimeInterval;
        try {
            timeInterval = TimeInterval.of(startTime, endTime)
        } catch (ignored) {
            this.context.setMessage(
                this.createTimeIntervalErrorMessage('Die Endzeit des Zeitintervalls darf nicht vor der Startzeit liegen.')
            );
            return false;
        }

        let newSchedule: Schedule;
        try {
            newSchedule =
                ScheduleOperations.addTimeInterval(
                    this.context.schedule,
                    this.context.now,
                    timeInterval,
                    time
                );
        } catch (error) {
            this.showErrorMessage(error);
            return false;
        }

        this.context.setSchedule(newSchedule);
        return true;
    }

    closeAndOpenTimeStamp(time: Time, timeType: ScheduleBlockTimeType) {
        let newSchedule;
        try {
            newSchedule = ScheduleOperations.closeTimeStamp(this.context.schedule, time, this.context.now);
            newSchedule = ScheduleOperations.openTimeStamp(newSchedule, time, this.context.now, timeType);
        } catch (error) {
            this.showErrorMessage(error);
            return false;
        }

        this.context.setSchedule(newSchedule);
        return true;
    }

    openTimeStamp(openTimeStampAt: Time, timeType: ScheduleBlockTimeType): boolean {
        let newSchedule;
        try {
            newSchedule =
                ScheduleOperations.openTimeStamp(
                    this.context.schedule,
                    openTimeStampAt,
                    this.context.now,
                    timeType
                );
        } catch (error) {
            this.showErrorMessage(error);
            return false;
        }

        this.context.setSchedule(newSchedule);
        return true;
    }

    closeTimeStamp(closeTimeStampAt: Time): boolean {
        let newSchedule;
        try {
            newSchedule =
                ScheduleOperations.closeTimeStamp(
                    this.context.schedule,
                    closeTimeStampAt,
                    this.context.now
                );
        } catch (error) {
            this.showErrorMessage(error);
            return false;
        }

        this.context.setSchedule(newSchedule);
        return true;
    }

    private showErrorMessage(error: unknown) {
        this.context.setMessage(
            error instanceof DisplayableError
                ? this.createTimeStampErrorMessage(error.message, error.messageRetentionInSeconds)
                : this.createTimeStampErrorMessage(DisplayableError.unknown().message)
        );
    }

    private createTimeIntervalErrorMessage(body: string, retentionInSeconds?: number): Message {
        return {
            body,
            retentionInSeconds: retentionInSeconds ?? 5,
            title: 'Fehler beim Hinzufügen',
            type: 'error'
        }
    }

    private createTimeStampErrorMessage(body: string, retentionInSeconds?: number): Message {
        return {
            body,
            retentionInSeconds: retentionInSeconds ?? 5,
            title: 'Fehler beim Stempeln',
            type: 'error'
        };
    }

}
