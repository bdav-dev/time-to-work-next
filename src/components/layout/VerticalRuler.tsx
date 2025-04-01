import React from "react";

type VerticalRulerProps = {
    className?: string
}

export default function VerticalRuler({ className }: VerticalRulerProps ) {
    return <div className={`border-neutral-400 dark:border-neumorphic-500 border-l ${className}`}/>
}
