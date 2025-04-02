import Time from "@/time/Time";
import TimeSpan from "@/time/TimeSpan";
import { compare } from "@/util/CompareUtils";


export default class TimeInterval {
    public readonly startTime: Time;
    public readonly endTime: Time;

    private constructor(startTime: Time, endTime: Time) {
        this.startTime = startTime;
        this.endTime = endTime;
    }

    public static of(startTime: Time, endTime: Time) {
        if (endTime.compareTo(startTime) < 0) {
            throw new Error("End time should be larger then start time.");
        }
        return new TimeInterval(startTime, endTime);
    }

    public static ofTimeSpan(startTime: Time, timeSpanSinceStartTime: TimeSpan) {
        const endTime = startTime.asTimeSpan().add(timeSpanSinceStartTime).asTime();
        return new TimeInterval(startTime, endTime);
    }

    intersectsWith(other: TimeInterval) {
        return (
            (compare(this.startTime, 'greaterThan', other.startTime) && compare(this.startTime, 'lessThan', other.endTime)) ||
            (compare(this.endTime, 'greaterThan', other.startTime) && compare(this.endTime, 'lessThan', other.endTime))
        );
    }

    hasNoLength() {
        return this.getTimeDifference().hasNoLength();
    }

    getTimeDifference() {
        return this.endTime.asTimeSpan().subtract(this.startTime.asTimeSpan());
    }

    equals(other: TimeInterval): boolean {
        return this.startTime.equals(other.startTime) && this.endTime.equals(other.endTime);
    }

}