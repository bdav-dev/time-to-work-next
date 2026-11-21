import TimeSpan from "@/time/TimeSpan";
import { Schedule, ScheduleBlock, scheduleBlockEquals } from "@/schedule/Schedule";
import Time from "@/time/Time";
import { compare } from "@/util/CompareUtils";
import { MinBreak } from "@/hooks/configuration/instances/UseWorkingTimeConfiguration";


export default class ScheduleCalculations {
    private constructor() {}

    static hasOpenTimeStamp(schedule: Schedule) {
        return schedule.some(block => block.endTime == undefined);
    }

    static getOpenTimestamp(schedule: Schedule) {
        return schedule.find(block => block.endTime == undefined);
    }

    static hasOpenWorkTimeStamp(schedule: Schedule) {
        return schedule.some(block => block.endTime == undefined && block.timeType.identifier === 'workTime');
    }

    static getOpenWorkTimeStamp(schedule: Schedule) {
        return schedule.find(block => block.endTime == undefined && block.timeType.identifier === 'workTime');
    }

    static getOpenBreakTimeStamp(schedule: Schedule) {
        return schedule.find(block => block.endTime == undefined && block.timeType.identifier === 'breakTime');
    }

    static getSumOfWorkTime(schedule: Schedule, now: Time) {
        return schedule
            .filter(block => block.timeType.identifier === 'workTime')
            .reduce(
                (sumOfWorkTime, block) => sumOfWorkTime.add(TimeSpan.ofTimeDifference(block.startTime, block.endTime ?? now)),
                TimeSpan.zero()
            );
    }

    static hasClosedBreakTimeBlockGreaterThanOrEqualToTimeSpan(schedule: Schedule, timeSpan: TimeSpan) {
        return schedule
            .filter(block => block.timeType.identifier === 'breakTime')
            .filter(block => block.endTime != undefined)
            .map(block => TimeSpan.ofTimeDifference(block.startTime, block.endTime!))
            .some(blockDuration => compare(blockDuration, 'greaterOrEqualThan', timeSpan));
    }

    static hasBreakTimeBlockGreaterThanOrEqualToTimeSpan(schedule: Schedule, timeSpan: TimeSpan, now: Time) {
        return schedule
            .filter(block => block.timeType.identifier === 'breakTime')
            .map(block => TimeSpan.ofTimeDifference(block.startTime, block.endTime ?? now))
            .some(blockDuration => compare(blockDuration, 'greaterOrEqualThan', timeSpan));
    }

    static getSumOfBreakTime(schedule: Schedule, now: Time) {
        return schedule
            .filter(block => block.timeType.identifier === 'breakTime')
            .reduce(
                (sumOfBreakTime, block) => sumOfBreakTime.add(TimeSpan.ofTimeDifference(block.startTime, block.endTime ?? now)),
                TimeSpan.zero()
            );
    }

    static getSumOfClosedBreakTime(schedule: Schedule) {
        return schedule
            .filter(block => block.timeType.identifier === 'breakTime')
            .filter(block => block.endTime != undefined)
            .reduce(
                (sumOfBreakTime, block) => sumOfBreakTime.add(TimeSpan.ofTimeDifference(block.startTime, block.endTime!)),
                TimeSpan.zero()
            );
    }

    static getRemainingTimeToWork(schedule: Schedule, now: Time, dailyWorkingTime: TimeSpan) {
        return dailyWorkingTime.subtract(this.getSumOfWorkTime(schedule, now));
    }

    static getEndOfWork(schedule: Schedule, now: Time, dailyWorkingTime: TimeSpan, minBreak: MinBreak): Time | undefined {
        const remainingTimeToWork = this.getRemainingTimeToWork(schedule, now, dailyWorkingTime);

        const calculateMinBreakOverhead = () => {
            if (!minBreak.duration) {
                return;
            }

            if (minBreak.mode === 'straight') {
                const minBreakAlreadyTaken = this.hasBreakTimeBlockGreaterThanOrEqualToTimeSpan(schedule, minBreak.duration, now);
                if (minBreakAlreadyTaken) {
                    return;
                }
                const openBreakTimeStamp = this.getOpenBreakTimeStamp(schedule);
                if (!openBreakTimeStamp) {
                    return minBreak.duration;
                }
                return minBreak.duration.subtract(TimeSpan.ofTimeDifference(openBreakTimeStamp.startTime, now));

            } else if (minBreak.mode === 'total') {
                const breakTime = this.getSumOfBreakTime(schedule, now);
                if (compare(breakTime, "lessThan", minBreak.duration)) {
                    return minBreak.duration.subtract(breakTime);
                }
            }
        }

        if (remainingTimeToWork.isNegative()) {
            return undefined;
        }

        return now
            .add(remainingTimeToWork)
            .add(calculateMinBreakOverhead() ?? TimeSpan.zero());
    }

    static getNewTimeBalance(schedule: Schedule, now: Time, dailyWorkingTime: TimeSpan, timeBalance: TimeSpan) {
        return timeBalance.subtract(this.getRemainingTimeToWork(schedule, now, dailyWorkingTime));
    }

    static getLatestEndTime(schedule: Schedule, omitBlock?: ScheduleBlock) {
        return schedule
            .filter(block => !scheduleBlockEquals(block, omitBlock))
            .map(block => block.endTime)
            .filter(endTime => !!endTime)
            .toSorted((a, b) => b.compareTo(a))
            .find(() => true);
    }

    static getAmountOfBreakTimeBlocks(schedule: Schedule) {
        return schedule
            .filter(block => block.timeType.identifier === 'breakTime')
            .length;
    }

}
