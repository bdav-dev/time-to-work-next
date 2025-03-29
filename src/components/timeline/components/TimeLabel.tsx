import React from "react";
import Time from "@/time/Time";

type TimestampProps = {
    position: number,
    time: Time
}

export default function TimeLabel(props: TimestampProps) {

    return (
        <div
            className={`
                absolute
                -translate-x-1/2
                select-none
            `}
            style={{
                left: `${props.position}%`,
                fontSize: 'clamp(0px, 2vw, 1em)',
                translate: `0 calc(100% + 0.4rem)`,
                bottom: '0'
            }}>
            {props.time.toString()}
        </div>
    );

}