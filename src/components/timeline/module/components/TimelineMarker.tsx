import { TimelineMarker as TimelineMarkerType } from "../TimelineTypes";
import { RequireProperty } from "@/util/UtilTypes";


export type TimelineMarkerProps = {
    marker: RequireProperty<TimelineMarkerType, 'height'>
    position: number
}

export default function TimelineMarker({ marker, position }: TimelineMarkerProps) {
    const cssHeight = marker.height * 100;

    return (
        <div
            className={marker.className}
            style={{
                position: "absolute",
                borderRadius: "999px",
                translate: "-50% 0",
                backgroundColor: marker.color,
                height: `${cssHeight}%`,
                top: `${(100 - cssHeight) / 2}%`,
                width: '2px',
                left: `${position}%`
            }}
        >
            <div
                style={{
                    position: "absolute",
                    color: marker.color,
                    top: "0",
                    translate: `-50% calc(-100% - 0.1rem)`,
                    userSelect: "none",

                }}
            >
                {marker.title}
            </div>
        </div>
    );
}
