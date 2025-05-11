import TimeClass from "@/time/Time";
import TimeSpan from "@/time/TimeSpan";
import TimeInterval from "@/time/TimeInterval";

type TimeProps = {
    time: TimeClass | TimeSpan | TimeInterval | undefined,
    showPositiveSign?: boolean,
    className?: string
}

function getTimeAndSignStrings(timeObject: TimeClass | TimeSpan | TimeInterval | undefined, showPositiveSign: boolean) {
    if (!timeObject) {
        return { timeString: '--:--' };
    }

    const timeSpan: TimeSpan = (
        timeObject instanceof TimeClass
            ? timeObject.asTimeSpan()
            : timeObject instanceof TimeInterval
                ? timeObject.getTimeDifference()
                : timeObject
    );

    return {
        timeString: timeSpan.absolute().toString(),
        signString: (timeSpan.isNegative() || showPositiveSign || undefined) && (timeSpan.isNegative() ? '-' : '+')
    }
}

export default function Time({ time, className, showPositiveSign }: TimeProps) {
    const { timeString, signString } = getTimeAndSignStrings(time, showPositiveSign ?? false);

    return (
        <span className={className}>
            {
                signString &&
                <span className={'mr-0.5'}>{signString}</span>
            }
            {timeString}
        </span>
    );
}