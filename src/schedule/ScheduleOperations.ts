import { Schedule } from "@/schedule/Schedule";
import Time from "@/time/Time";
import { ScheduleBlockTime } from "@/schedule/ScheduleBlockTime";
import TimeInterval from "@/time/TimeInterval";
import { compare } from "@/util/CompareUtils";


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

    static addTimeInterval(schedule: Schedule, now: Time, intervalToAdd: TimeInterval, time: ScheduleBlockTime): Schedule {
        const newSchedule = [...schedule];

        if (intervalToAdd.hasNoLength()) {
            throw new Error("has no length");
        }

        if (compare(intervalToAdd.endTime, 'greaterThan', now)) {
            throw new Error("in future");
        }

        for (const block of schedule) {
            if (!block.endTime) {
                continue;
            }

            const existingInterval = TimeInterval.of(block.startTime, block.endTime);

            if (intervalToAdd.intersectsWith(existingInterval)) {
                throw new Error('intersects with!');
            }
            if (intervalToAdd.equals(existingInterval)) {
                throw new Error("interval already exists!");
            }
        }

        const openTimeStamp = this.getOpenTimestamp(schedule);
        if (openTimeStamp && compare(intervalToAdd.endTime, 'greaterThan', openTimeStamp.startTime)) {
            throw new Error('intersects with open timestamp!');
        }

        newSchedule.push({
            startTime: intervalToAdd.startTime,
            endTime: intervalToAdd.endTime,
            time
        });

        return newSchedule;
    }

    static openTimeStamp(schedule: Schedule, startTime: Time, now: Time, time: ScheduleBlockTime): Schedule {
        const newSchedule = [...schedule];

        if (this.doesOpenTimeStampExist(newSchedule)) {
            throw new Error('openTimeStamp already exists!');
        }

        if (compare(startTime, 'greaterThan', now)) {
            throw new Error('cannot open time stamp in future');
        }

        const intervalRepresentation = TimeInterval.of(startTime, now);

        for (const block of schedule) {
            if (!block.endTime) {
                continue;
            }

            const existingInterval = TimeInterval.of(block.startTime, block.endTime);

            if (existingInterval.intersectsWith(intervalRepresentation)) {
                throw new Error('intersects with!');
            }

            if (compare(existingInterval.endTime, 'greaterThan', startTime)) {
                throw new Error('interval in future ahead');
            }
        }

        newSchedule.push({
            startTime: startTime,
            time
        });

        return newSchedule;
    }

    static closeTimeStamp(schedule: Schedule, endTime: Time, now: Time): Schedule {
        let newSchedule = [...schedule];

        const openTimeStamp = this.getOpenTimestamp(newSchedule);
        if (!openTimeStamp) {
            throw new Error("no open time stamp exists to be closed");
        }

        if (compare(endTime, 'greaterThan', now)) {
            throw new Error('cannot be closed in future');
        }

        if (compare(endTime, 'lessThan', openTimeStamp.startTime)) {
            throw new Error('cannot close timestamp which endtime is less than starttime');
        }

        newSchedule = newSchedule.filter(block => block !== openTimeStamp);
        newSchedule.push({
            startTime: openTimeStamp.startTime,
            endTime,
            time: openTimeStamp.time
        });

        newSchedule = newSchedule.filter(block => !TimeInterval.of(block.startTime, block.endTime!).hasNoLength());

        return newSchedule;
    }

    private static doesOpenTimeStampExist(schedule: Schedule) {
        return !!this.getOpenTimestamp(schedule);
    }

}