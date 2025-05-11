import TimeSpan from "@/time/TimeSpan";
import { Schedule } from "@/schedule/Schedule";
import Time from "@/time/Time";


export default class ScheduleCalculations {
    private constructor() {}

    static hasOpenTimeStamp(schedule: Schedule) {
        return schedule.some(block => block.endTime == undefined);
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

    static getNextDayTimeBalance(schedule: Schedule, dailyWorkingTime: TimeSpan, timeBalance: TimeSpan) {
        if (ScheduleCalculations.hasOpenTimeStamp(schedule)) {
            throw new Error("Cannot calculate new time balance because schedule has unclosed time stamp.");
        }

        const remainingTimeToWork = ScheduleCalculations.getRemainingTimeToWork(
            schedule,
            Time.midnight(), // Will never be used since it is ensued that the schedule has no open time stamps.
            dailyWorkingTime
        );

        return timeBalance.subtract(remainingTimeToWork);
    }

}