import TimeClass from "@/time/Time";
import TimeSpan from "@/time/TimeSpan";

type TimeProps = {
    time: TimeClass | TimeSpan | undefined,
    showPositiveSign?: boolean,
    className?: string
}

function getTimeAndSignStrings(timeOrTimeSpan: TimeClass | TimeSpan | undefined, showPositiveSign: boolean) {
    if (!timeOrTimeSpan) {
        return { timeString: '--:--' };
    }

    const timeSpan = timeOrTimeSpan instanceof TimeClass ? timeOrTimeSpan.asTimeSpan() : timeOrTimeSpan;

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