import React from "react";
import Time from "@/time/Time";
import { applyThemeToThemedColorPair } from "@/color/color";
import TimelineBlockTimeLabel from "@/components/timeline/components/TimelineBlockTimeLabel";
import { TimelineBlockColor, TimelineBlockColors } from "@/components/timeline/TimelineBlockColor";


export type BookingBlockProps = {
    title?: string | React.ReactNode,
    startTime: Time,
    endTime: Time,
    isOpen?: boolean,
    leftOverflow?: boolean,
    rightOverflow?: boolean,
    position: number,
    size: number,
    color?: TimelineBlockColor,
    isDarkTheme: boolean
}

const HEIGHT = 94;

export default function TimelineBlock(props: BookingBlockProps) {
    const color = props.color ?? TimelineBlockColors.BLUE;
    const blockColor = applyThemeToThemedColorPair(color.block, props.isDarkTheme);
    const timeLabelColor = applyThemeToThemedColorPair(color.timeLabel, props.isDarkTheme);

    return (
        <div
            className={`
                absolute
                flex flex-col justify-between
                rounded-xl
                ${props.leftOverflow ? 'rounded-l-none' : ''}
                ${props.rightOverflow || props.isOpen ? 'rounded-r-none' : ''}
            `}
            style={{
                left: props.position + '%',
                width: props.size + '%',
                top: ((100 - HEIGHT) / 2) + '%',
                height: HEIGHT + '%',
                backgroundColor: blockColor.background,
                color: blockColor.text ?? 'white',
            }}
        >
            {
                props.title &&
                <div
                    className={`
                        m-2 overflow-hidden text-ellipsis leading-5
                        user-none
                    `}
                >
                    {props.title}
                </div>
            }
            <TimelineBlockTimeLabel
                className={'absolute bottom-0 self-center'}
                startTime={props.startTime}
                endTime={props.endTime}
                isOpen={props.isOpen ?? false}
                color={timeLabelColor}
            />
        </div>
    );

}