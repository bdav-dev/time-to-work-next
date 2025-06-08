import React from "react";


export function TimelineLine(props: { width: string, color: string, position: number }) {
    return (
        <div
            style={{
                position: "absolute",
                height: "100%",
                borderRadius: "999px",
                userSelect: "none",
                translate: "-50% 0",
                left: `${props.position}%`,
                width: props.width,
                backgroundColor: props.color,
            }}
        />
    );
}
