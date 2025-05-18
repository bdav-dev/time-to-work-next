import Time from "@/time/Time";


const ONE_DAY_IN_MINUTES = 24 * 60;

export default class TimeSpan {
    private readonly reducedMinutes: number;

    private constructor(reducedMinutes: number) {
        this.reducedMinutes = Math.trunc(reducedMinutes);
    }

    static of(hours: number, minutes: number) {
        return new TimeSpan(hours * 60 + minutes);
    }

    static ofMinutes(minutes: number) {
        return new TimeSpan(minutes);
    }

    static ofHours(hours: number) {
        return new TimeSpan(hours * 60);
    }

    static ofString(timeSpan: string) {
        const [hoursAsString, minutesAsString] = timeSpan.split(":");

        const sign = hoursAsString.startsWith('-') ? -1 : 1;
        const hours = sign * Math.abs(parseInt(hoursAsString));
        const minutes = sign * Math.abs(parseInt(minutesAsString));

        return TimeSpan.of(hours, minutes);
    }

    static ofTimeDifference(startTime: Time, endTime: Time) {
        return endTime.asTimeSpan().subtract(startTime.asTimeSpan());
    }

    static empty() {
        return new TimeSpan(0);
    }

    sign() {
        return Math.sign(this.reducedMinutes);
    }

    hours() {
        return Math.trunc(Math.abs(this.reducedMinutes) / 60);
    }

    minutes() {
        return Math.abs(this.reducedMinutes) % 60;
    }

    add(timeSpan: TimeSpan) {
        return TimeSpan.ofMinutes(
            this.reduceToMinutes() + timeSpan.reduceToMinutes()
        );
    }

    subtract(timeSpan: TimeSpan) {
        return TimeSpan.ofMinutes(
            this.reduceToMinutes() - timeSpan.reduceToMinutes()
        );
    }

    multiply(factor: number) {
        return TimeSpan.ofMinutes(
            this.reducedMinutes * factor
        );
    }

    divide(divisor: number) {
        return TimeSpan.ofMinutes(
            this.reducedMinutes / divisor
        );
    }

    static divide(numerator: TimeSpan, denominator: TimeSpan) {
        return numerator.reduceToMinutes() / denominator.reduceToMinutes();
    }

    static ratio(numerator: TimeSpan, denominator: TimeSpan) {
        return this.divide(numerator, denominator);
    }

    hasNoLength() {
        return this.reducedMinutes == 0;
    }

    isNegative() {
        return this.reducedMinutes < 0;
    }

    absolute() {
        return TimeSpan.ofMinutes(
            Math.abs(this.reducedMinutes)
        );
    }

    reduceToMinutes() {
        return this.reducedMinutes;
    }

    reduceToHours() {
        return this.reducedMinutes / 60;
    }

    asTime(wrap = false) {
        return Time.ofMinutes(
            wrap
                ? this.reducedMinutes % ONE_DAY_IN_MINUTES + (this.isNegative() ? ONE_DAY_IN_MINUTES : 0)
                : this.reducedMinutes
        );
    }

    toString() {
        const sign = this.isNegative() ? '-' : '';
        const hours = this.hours().toString().padStart(2, '0');
        const minutes = this.minutes().toString().padStart(2, '0');

        return `${sign}${hours}:${minutes}`;
    }

    compareTo(other: TimeSpan) {
        return this.reduceToMinutes() - other.reduceToMinutes();
    }

    equals(other: TimeSpan | undefined | null) {
        return other == undefined
            ? false
            : this.compareTo(other) == 0;
    }

}