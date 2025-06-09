import TimeSpan from "@/time/TimeSpan";

export default class Time {
    private readonly timeSpan: TimeSpan;

    private constructor(hours: number, minutes: number) {
        this.timeSpan = TimeSpan.of(hours, minutes);
        this.validateTime();
    }

    public static of(hours: number, minutes: number) {
        return new Time(hours, minutes);
    }

    public static ofMinutes(minutes: number) {
        return new Time(0, minutes);
    }

    public static ofHours(hours: number) {
        return new Time(hours, 0);
    }

    public static ofString(time: string) {
        return TimeSpan.ofString(time).asTime();
    }

    public static now() {
        const date = new Date();
        return new Time(date.getHours(), date.getMinutes());
    }

    public static midnight() {
        return new Time(0, 0);
    }

    private validateTime() {
        if (this.timeSpan.hours() == 24 && this.timeSpan.minutes() == 0) {
            return;
        }
        if (this.timeSpan.isNegative()) {
            throw new Error("Cannot be negative.");
        }
        if (this.timeSpan.hours() > 23) {
            throw new RangeError(`Invalid hour range (must be between 0 and 23). Hour value was ${this.timeSpan.hours()}`);
        }
    }

    hours() {
        return this.timeSpan.hours();
    }

    minutes() {
        return this.timeSpan.minutes();
    }

    add(timeSpan: TimeSpan) {
        return this.timeSpan.add(timeSpan).asTime(true);
    }

    proximity(other: Time): TimeSpan {
        return this.asTimeSpan().subtract(other.asTimeSpan()).absolute();
    }

    subtract(timeSpan: TimeSpan) {
        return this.timeSpan.subtract(timeSpan).asTime(true);
    }

    multiply(factor: number) {
        return this.timeSpan.multiply(factor).asTime(true);
    }

    divide(divisor: number) {
        return this.timeSpan.divide(divisor).asTime(true);
    }

    asTimeSpan() {
        return this.timeSpan;
    }

    toString() {
        return this.timeSpan.toString();
    }

    compareTo(other: Time) {
        return this.timeSpan.compareTo(other.asTimeSpan());
    }

    equals(other: Time | undefined | null) {
        return this.timeSpan.equals(other?.asTimeSpan());
    }

}
