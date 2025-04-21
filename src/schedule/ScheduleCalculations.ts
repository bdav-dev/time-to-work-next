import TimeSpan from "@/time/TimeSpan";
import { Schedule } from "@/schedule/Schedule";
import Time from "@/time/Time";


export default class ScheduleCalculations {
    private constructor() {}

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

    static getRemainingTimeToWork(schedule: Schedule, now: Time, timeToWork: TimeSpan) {
        return timeToWork.subtract(this.getSumOfWorkTime(schedule, now));
    }

}