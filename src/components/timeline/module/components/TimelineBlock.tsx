import { RequireProperty } from "@/util/TypeUtils";
import { TimelineBlock as TimelineBlockType } from '../TimelineTypes';


export type TimelineBlockProps = {
    block: RequireProperty<RequireProperty<TimelineBlockType, 'endTime'>, 'height'>,
    isOpen?: boolean,
    leftOverflow?: boolean,
    rightOverflow?: boolean,
    position: number,
    size: number
}

export default function TimelineBlock(props: TimelineBlockProps) {
    const cssHeight = props.block.height * 100;

    const borderRadius = "0.75rem";
    const borderRadiusLeft = props.leftOverflow ? '0' : borderRadius;
    const borderRadiusRight = props.rightOverflow || props.isOpen ? '0' : borderRadius;

    return (
        <button
            className={props.block.className}
            style={{
                cursor: !props.block.onClick && 'default' || undefined,
                position: 'absolute',
                borderRadius: `${borderRadiusLeft} ${borderRadiusRight} ${borderRadiusRight} ${borderRadiusLeft}`,
                left: `${props.position}%`,
                width: `${props.size}%`,
                top: `${(100 - cssHeight) / 2}%`,
                height: `${cssHeight}%`,
                backgroundColor: props.block.backgroundColor,
                ...props.block.style
            }}
            onClick={props.block.onClick}
        >
            {props.block.content}
        </button>
    );

}
