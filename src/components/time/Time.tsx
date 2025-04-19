import TimeClass from "@/time/Time";
import TimeSpan from "@/time/TimeSpan";

type TimeProps = {
    time: TimeClass | TimeSpan | undefined,
    className?: string
}

export default function Time({ time, className }: TimeProps) {
    return (
        <span className={className}>
            {
                time
                    ? <>{time.toString()}</>
                    : <>--:--</>
            }
        </span>
    );
}