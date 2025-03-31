import TimeClass from "@/time/Time";

type TimeProps = {
    time: TimeClass | undefined;
}

export default function Time({ time }: TimeProps) {
    return (
        time
            ? <>{time.toString()}</>
            : <>--:--</>
    );
}