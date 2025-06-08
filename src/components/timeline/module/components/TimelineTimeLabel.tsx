import Time from "@/time/Time";


type TimestampProps = {
    position: number,
    time: Time
}

export default function TimelineTimeLabel(props: TimestampProps) {

    return (
        <div
            style={{
                position: "absolute",
                userSelect: "none",
                left: `${props.position}%`,
                fontSize: 'clamp(0px, 2vw, 1em)',
                translate: `-50% calc(100% + 0.4rem)`,
                bottom: '0'
            }}
        >
            {props.time.toString()}
        </div>
    );

}
