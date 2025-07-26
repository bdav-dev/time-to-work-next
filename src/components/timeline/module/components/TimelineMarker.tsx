import { TimelineMarker as TimelineMarkerType } from "../TimelineTypes";

export type TimelineMarkerProps = {
    marker: TimelineMarkerType
    position: number
}

export default function TimelineMarker({ marker, position }: TimelineMarkerProps) {
    const {
        title, height, color, filled, className, style,
        textColor = marker.filled ? "white" : marker.color,
        labelPosition = "top",
        labelDistance = '0.1rem'
    } = marker;

    const cssHeight = (height ?? 1.1) * 100;
    const translateY = (
        labelPosition == 'top'
            ? `calc(-100% - ${labelDistance})`
            : `calc(100% + ${labelDistance})`
    );
    const filledStyles = {
        backgroundColor: marker.color,
        borderRadius: "0.4rem",
        padding: "0 4px",
    };

    return (
        <div
            className={className}
            style={{
                position: "absolute",
                borderRadius: "999px",
                translate: "-50% 0",
                backgroundColor: color,
                height: `${cssHeight}%`,
                top: `${(100 - cssHeight) / 2}%`,
                width: '2px',
                left: `${position}%`,
                ...style
            }}
        >
            <div
                style={{
                    position: "absolute",
                    top: labelPosition == "top" ? "0" : undefined,
                    bottom: labelPosition == "bottom" ? "0" : undefined,
                    color: textColor,
                    translate: `-50% ${translateY}`,
                    userSelect: "none",
                    ...(filled ? filledStyles : {})
                }}
            >
                {title}
            </div>
        </div>
    );
}
