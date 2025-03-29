import MaterialSymbol, { MaterialSymbols } from "@/icons/MaterialSymbol";
import TimeSpan from "@/time/TimeSpan";
import React from "react";
import Time from "@/time/Time";
import { ColorPair } from "@/color/color";


type TimelineBlockTimeLabelProps = {
    className?: string,
    startTime: Time,
    endTime: Time,
    isOpen: boolean,
    color: ColorPair
}

export default function TimelineBlockTimeLabel(props: TimelineBlockTimeLabelProps) {

    return (
        <div
            className={`
                ${props.className}
                px-1.5 py-0.5 mb-1.5
                rounded-lg
                select-none
                z-10
            `}
            style={{
                backgroundColor: props.color.background,
                color: props.color.text,
                fontSize: 'clamp(0px, 2vw, 0.8125rem)'
            }}
        >
            <div>
                {props.startTime.toString()}
                <span className={'mx-0.5'}>-</span>
                {props.isOpen ? '...' : props.endTime.toString()}
            </div>

            <div className={'flex flex-row gap-0.5 justify-center items-center'}>
                <MaterialSymbol symbol={MaterialSymbols.TIMER} style={{ fontSize: 'clamp(0px, 2vw, 1rem)' }}/>
                {TimeSpan.ofTimeDifference(props.startTime, props.endTime).toString()}
            </div>
        </div>
    );

}
