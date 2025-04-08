import { Schedule, ScheduleBlock, scheduleBlockEquals } from "@/schedule/Schedule";
import Time from "@/time/Time";
import { ScheduleBlockTimeType } from "@/schedule/ScheduleBlockTimeType";
import TimeInterval from "@/time/TimeInterval";
import { compare } from "@/util/CompareUtils";
import { DisplayableError } from "@/error/DisplayableError";


export default class ScheduleOperations {
    private constructor() {}

    static getOpenTimestamp(schedule: Schedule) {
        for (const block of schedule) {
            if (!block.endTime) {
                return block;
            }
        }

        return null;
    }

    static addTimeInterval(schedule: Schedule, now: Time, intervalToAdd: TimeInterval, timeType: ScheduleBlockTimeType): Schedule {
        const newSchedule = [...schedule];

        if (intervalToAdd.hasNoLength()) {
            throw new DisplayableError("Das Zeitintervall hat keine Länge.");
        }

        if (compare(intervalToAdd.endTime, 'greaterThan', now)) {
            throw new DisplayableError("Das Zeitintervall liegt in der Zukunft.");
        }

        for (const block of schedule) {
            if (!block.endTime) {
                continue;
            }

            const existingInterval = TimeInterval.of(block.startTime, block.endTime);

            if (intervalToAdd.intersectsWith(existingInterval)) {
                throw new DisplayableError('Das Zeitintervall überschneidet sich mit einem bereits bestehenden Intervall.');
            }
        }

        const openTimeStamp = this.getOpenTimestamp(schedule);
        if (openTimeStamp && compare(intervalToAdd.endTime, 'greaterThan', openTimeStamp.startTime)) {
            throw new DisplayableError('Das Zeitintervall überschneidet sich mit einem geöffnetem Zeitstempel.');
        }

        newSchedule.push({
            startTime: intervalToAdd.startTime,
            endTime: intervalToAdd.endTime,
            timeType
        });

        return newSchedule;
    }

    static openTimeStamp(schedule: Schedule, startTime: Time, now: Time, timeType: ScheduleBlockTimeType): Schedule {
        const newSchedule = [...schedule];

        if (this.doesOpenTimeStampExist(newSchedule)) {
            throw new DisplayableError('Es existiert bereits ein offener Zeitstempel.');
        }

        if (compare(startTime, 'greaterThan', now)) {
            throw new DisplayableError('Die Startzeit des Stempels liegt in der Zukunft.');
        }

        const intervalRepresentation = TimeInterval.of(startTime, now);

        for (const block of schedule) {
            if (!block.endTime) {
                continue;
            }

            const existingInterval = TimeInterval.of(block.startTime, block.endTime);

            if (existingInterval.intersectsWith(intervalRepresentation)) {
                throw new DisplayableError('Der Zeitstempel überschneidet sich mit einem bereits bestehenden Intervall.');
            }

            if (compare(existingInterval.endTime, 'greaterThan', startTime)) {
                throw new DisplayableError('Ein Zeitintervall liegt in der Zukunft voraus.');
            }
        }

        newSchedule.push({
            startTime: startTime,
            timeType
        });

        return newSchedule;
    }

    static closeTimeStamp(schedule: Schedule, endTime: Time, now: Time): Schedule {
        let newSchedule = [...schedule];

        const openTimeStamp = this.getOpenTimestamp(newSchedule);
        if (!openTimeStamp) {
            throw new DisplayableError("Es existiert kein offener Zeitstempel zum Schließen.");
        }

        if (compare(endTime, 'greaterThan', now)) {
            throw new DisplayableError('Der Zeitstempel kann nicht in der Zukunft geschlossen werden.');
        }

        if (compare(endTime, 'lessThan', openTimeStamp.startTime)) {
            throw new DisplayableError('Die Schließungszeit des Zeitstempels darf nicht vor der Startzeit liegen.');
        }

        newSchedule = newSchedule.filter(block => block !== openTimeStamp);
        newSchedule.push({
            startTime: openTimeStamp.startTime,
            endTime,
            timeType: openTimeStamp.timeType
        });

        newSchedule = newSchedule.filter(block => !TimeInterval.of(block.startTime, block.endTime!).hasNoLength());

        return newSchedule;
    }

    static removeScheduleBlock(schedule: Schedule, blockToRemove: ScheduleBlock) {
        return schedule.filter(block => !scheduleBlockEquals(block, blockToRemove));
    }

    private static doesOpenTimeStampExist(schedule: Schedule) {
        return !!this.getOpenTimestamp(schedule);
    }

}