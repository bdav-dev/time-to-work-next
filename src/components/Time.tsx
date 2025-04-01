import TimeClass from "@/time/Time";
import TimeSpan from "@/time/TimeSpan";

type TimeProps = {
    time: TimeClass | TimeSpan | undefined;
}

export default function Time({ time }: TimeProps) {
    return (
        time
            ? <>{time.toString()}</>
            : <>--:--</>
    );
}