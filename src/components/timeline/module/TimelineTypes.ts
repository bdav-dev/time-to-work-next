import Time from "@/time/Time";
import { CSSProperties, ReactNode } from "react";


export type TimelineConfiguration = {
    startTime: Time,
    endTime: Time,
    currentTime?: Time
    theme: TimelineTheme,
    height: string,
    marginSize: number
    amountOfTimeSteps: number,
    amountOfSubTimeSteps: number,
    automaticTimeBoundsOnOverflow: boolean,
    automaticAmountOfTimeSteps: boolean,
    defaultBlockHeight: number,
    defaultMarkerHeight: number
}

export type TimelineBlock = {
    startTime: Time,
    endTime?: Time,
    content?: ReactNode,
    onClick?: () => void,
    height?: number,
    backgroundColor?: string,
    className?: string,
    style?: CSSProperties
}

export type TimelineMarker = {
    time: Time,
    title?: ReactNode,
    height?: number,
    color?: string,
    className?: string,
    style?: CSSProperties
}

export type TimelineTheme = {
    backgroundColor: string,
    marginColor: string,
    textColor: string,
    timeStepColor: string,
    subTimeStepColor: string,
    defaultBlockBackgroundColor: string,
    defaultMarkerColor: string
}
