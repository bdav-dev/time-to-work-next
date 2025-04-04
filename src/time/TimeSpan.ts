import Time from "@/time/Time";

export default class TimeSpan {
    public readonly hours: number;
    public readonly minutes: number;

    private constructor(hours: number, minutes: number) {
        const { normalizedHours, normalizedMinutes } = this.normalize(hours, minutes);
        this.hours = normalizedHours;
        this.minutes = normalizedMinutes;
    }

    static of(hours: number, minutes: number) {
        return new TimeSpan(hours, minutes);
    }

    static ofString(timeSpan: string) {
        const [hours, minutes] = timeSpan.split(":");
        return new TimeSpan(parseInt(hours), parseInt(minutes));
    }

    static ofTimeDifference(startTime: Time, endTime: Time) {
        return endTime.asTimeSpan().subtract(startTime.asTimeSpan());
    }

    private normalize(hours: number, minutes: number) {
        const asMinutes = hours * 60 + minutes;

        let normalizedHours = Math.trunc(Math.abs(asMinutes) / 60);
        let normalizedMinutes = Math.trunc(Math.abs(asMinutes) % 60);

        if (asMinutes < 0) {
            if (normalizedHours != 0) {
                normalizedHours *= -1;
            } else if (normalizedMinutes != 0) {
                normalizedMinutes *= -1;
            }
        }

        return { normalizedMinutes, normalizedHours };
    }

    static ratio(numerator: TimeSpan, denominator: TimeSpan) {
        return numerator.reduceToMinutes() / denominator.reduceToMinutes();
    }

    subtract(timeSpan: TimeSpan) {
        return new TimeSpan(
            this.hours - timeSpan.hours,
            this.minutes - timeSpan.minutes
        );
    }

    add(timeSpan: TimeSpan) {
        return new TimeSpan(
            this.hours + timeSpan.hours,
            this.minutes + timeSpan.minutes
        );
    }

    divide(divisor: number) {
        return new TimeSpan(
            this.hours / divisor,
            this.minutes / divisor
        );
    }

    multiply(factor: number) {
        return new TimeSpan(
            this.hours * factor,
            this.minutes * factor
        );
    }

    hasNoLength() {
        return this.reduceToMinutes() == 0;
    }

    asTime() {
        return Time.of(this.hours, this.minutes);
    }

    reduceToMinutes() {
        return this.hours * 60 + this.minutes;
    }

    reduceToHours() {
        return this.hours + this.minutes / 60;
    }

    isNegative() {
        return this.hours < 0 || this.minutes < 0;
    }

    toString() {
        const sign = this.isNegative() ? '-' : '';
        const hours = Math.abs(this.hours).toString().padStart(2, '0');
        const minutes = Math.abs(this.minutes).toString().padStart(2, '0');

        return `${sign}${hours}:${minutes}`;
    }

    compareTo(other: TimeSpan) {
        return this.reduceToMinutes() - other.reduceToMinutes();
    }

    equals(other: TimeSpan) {
        return this.compareTo(other) == 0;
    }

}