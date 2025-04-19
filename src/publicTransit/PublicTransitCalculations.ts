import { VerifiedPublicTransitConfiguration } from "@/hooks/configuration/instances/UsePublicTransitConfiguration";
import TimeSpan from "@/time/TimeSpan";
import Time from "@/time/Time";
import { compare } from "@/util/CompareUtils";


export default class PublicTransitCalculations {
    private constructor() {}

    private static departure(config: VerifiedPublicTransitConfiguration, nthDeparture: number): Time | undefined {
        const departureTime = (
            config.startTime.asTimeSpan()
                .add(config.period.multiply(nthDeparture))
        );

        return (
            compare(departureTime, "greaterOrEqualThan", TimeSpan.ofString('24:00'))
                ? undefined
                : departureTime.asTime()
        );
    }

    static nextDeparture(config: VerifiedPublicTransitConfiguration, now: Time) {
        let timeSpan = TimeSpan.ofTimeDifference(config.startTime, now);
        if (config.travelTime) {
            timeSpan = timeSpan
                .add(config.travelTime ?? TimeSpan.of(0, 0))
                .subtract(config.gracePeriod.add(TimeSpan.ofMinutes(1)));
        }

        const nthDeparture = Math.floor(TimeSpan.divide(timeSpan, config.period)) + 1;

        if (nthDeparture < 0) {
            return config.startTime;
        }

        return this.departure(config, nthDeparture);
    }

    static timeUntilNextDeparture(nextDeparture: Time, now: Time) {
        return TimeSpan.ofTimeDifference(now, nextDeparture);
    }

    static leaveTime(travelTime: TimeSpan, nextDeparture: Time) {
        return nextDeparture.subtract(travelTime);
    }

    static timeUntilLeave(leaveTime: Time, now: Time) {
        return TimeSpan.ofTimeDifference(now, leaveTime);
    }

    static calculatePublicTransitInformation(config: VerifiedPublicTransitConfiguration, now: Time) {
        const nextDeparture = PublicTransitCalculations.nextDeparture(config, now);
        const timeUntilNextDeparture = nextDeparture && PublicTransitCalculations.timeUntilNextDeparture(nextDeparture, now);

        const leaveTime = nextDeparture && config.travelTime && PublicTransitCalculations.leaveTime(config.travelTime, nextDeparture);
        const timeUntilLeave = leaveTime && PublicTransitCalculations.timeUntilLeave(leaveTime, now);

        return { nextDeparture, timeUntilNextDeparture, leaveTime, timeUntilLeave };
    }

}