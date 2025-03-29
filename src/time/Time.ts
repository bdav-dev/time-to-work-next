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

    public static ofString(timeSpan: string) {
        const [hours, minutes] = timeSpan.split(":");
        return new Time(parseInt(hours), parseInt(minutes));
    }

    public static now() {
        const date = new Date();
        return new Time(date.getHours(), date.getMinutes());
    }

    private validateTime() {
        if (this.timeSpan.hours < 0 || this.timeSpan.hours > 23) { //TODO 24:12 ist erlaubt???? FIXED... sort of -> was bei 24 uhr? maybe bei construktor modulo stunden 24...
            throw new RangeError("Invalid hour range (must be between 0 and 24).");
        }
    }

    subtract(time: Time) {
        return this.timeSpan.subtract(time.asTimeSpan()).asTime();
    }

    add(time: Time) {
        return this.timeSpan.add(time.asTimeSpan()).asTime();
    }

    divide(divisor: number) {
        return this.timeSpan.divide(divisor).asTime();
    }

    multiply(factor: number) {
        return this.timeSpan.multiply(factor).asTime();
    }

    asTimeSpan() {
        return this.timeSpan;
    }

    reduceToMinutes() {
        return this.timeSpan.reduceToMinutes();
    }

    reduceToHours() {
        return this.timeSpan.reduceToHours();
    }

    compareTo(other: Time) {
        return this.timeSpan.compareTo(other.asTimeSpan());
    }

    toString(twelveHour?: boolean) {
        if (!twelveHour) {
            return this.timeSpan.toString();
        }

        const meridiem = this.timeSpan.hours >= 12 ? 'PM' : 'AM';
        const hours = (this.timeSpan.hours % 12 || 12).toString().padStart(2, '0');
        const minutes = this.timeSpan.minutes.toString().padStart(2, '0');

        return `${hours}:${minutes} ${meridiem}`;
    }

}
