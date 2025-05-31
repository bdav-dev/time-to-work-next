import TimeSpan from "@/time/TimeSpan";
import { Schedule, ScheduleBlock, scheduleBlockEquals } from "@/schedule/Schedule";
import Time from "@/time/Time";


export default class ScheduleCalculations {
    private constructor() {}

    static hasOpenTimeStamp(schedule: Schedule) {
        return schedule.some(block => block.endTime == undefined);
    }

    static getOpenTimestamp(schedule: Schedule) {
        return schedule.find(block => block.endTime == undefined);
    }

    static getSumOfWorkTime(schedule: Schedule, now: Time) {
        return schedule
            .filter(block => block.timeType.identifier === 'workTime')
            .reduce(
                (sumOfWorkTime, block) => sumOfWorkTime.add(TimeSpan.ofTimeDifference(block.startTime, block.endTime ?? now)),
                TimeSpan.empty()
            );
    }

    static getSumOfBreakTime(schedule: Schedule, now: Time) {
        return schedule
            .filter(block => block.timeType.identifier === 'breakTime')
            .reduce(
                (sumOfBreakTime, block) => sumOfBreakTime.add(TimeSpan.ofTimeDifference(block.startTime, block.endTime ?? now)),
                TimeSpan.empty()
            );
    }

    static getRemainingTimeToWork(schedule: Schedule, now: Time, dailyWorkingTime: TimeSpan) {
        return dailyWorkingTime.subtract(this.getSumOfWorkTime(schedule, now));
    }

    static getEndOfWork(schedule: Schedule, now: Time, dailyWorkingTime: TimeSpan): Time | undefined {
        const remainingTimeToWork = this.getRemainingTimeToWork(schedule, now, dailyWorkingTime);

        if (remainingTimeToWork.isNegative()) {
            return undefined;
        }

        return now.add(remainingTimeToWork);
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

}