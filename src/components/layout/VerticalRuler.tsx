import { CSSProperties } from "react";

type VerticalRulerProps = {
    className?: string,
    style?: CSSProperties
}

export default function VerticalRuler({ className, style }: VerticalRulerProps) {
    return <div className={`border-neutral-400 dark:border-neumorphic-500 border-l ${className}`} style={style}/>
}
