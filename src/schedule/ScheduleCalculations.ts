import TimeSpan from "@/time/TimeSpan";
import { Schedule } from "@/schedule/Schedule";
import Time from "@/time/Time";


export default class ScheduleCalculations {
    private constructor() {}

    static getSumOfWorkTime(schedule: Schedule, now: Time) {
        return schedule
            .filter(block => block.time.identifier === 'workTime')
            .reduce(
                (sumOfWorkTime, block) => sumOfWorkTime.add(TimeSpan.ofTimeDifference(block.startTime, block.endTime ?? now)),
                TimeSpan.of(0, 0)
            );
    }

    static getRemainingTimeToWork(schedule: Schedule, now: Time, timeToWork: TimeSpan) {
        return timeToWork.subtract(this.getSumOfWorkTime(schedule, now));
    }

}