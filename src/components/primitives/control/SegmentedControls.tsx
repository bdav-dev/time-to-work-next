import { CSSProperties, ReactNode } from "react";
import { NeumorphicBlueprint } from "@/neumorphic/NeumorphicStyle";
import NeumorphicButton from "@/components/primitives/neumorphic/NeumorphicButton";


export type Segment<T> = {
    id: number,
    value: T,
    displayAs: ReactNode,
    className?: string | ((isSelection: boolean) => string),
};

type Position = 'leading' | 'inBetween' | 'trailing';
type SegmentClassName = string | ((isSelection: boolean) => string);

type SegmentedControlsProps<T> = {
    orientation?: 'horizontal' | 'vertical';
    segmentClassName?: SegmentClassName,
    segments: Segment<T>[];
    selection: Segment<T> | undefined,
    onSelectionChange: (selection?: Segment<T>) => void,
    deselectable?: boolean,
    className?: string,
    widthFull?: boolean,
    roundedFull?: boolean,
    disabled?: boolean,
    overrideSegmentPadding?: boolean
}

const BLUR = 10;
const DISTANCE = 7;

export default function SegmentedControls<T>(props: SegmentedControlsProps<T>) {
    const orientation = props.orientation ?? 'vertical';
    const flexDirection = orientation == 'vertical' ? "flex-col" : "flex-row";
    const borderRadius = props.roundedFull ? '9999px' : '0.75rem';

    const positionFromIndex = (index: number): Position => {
        switch (index) {
            case 0:
                return 'leading';
            case props.segments.length - 1:
                return 'trailing';
            default:
                return 'inBetween';
        }
    };

    return (
        <div className={`flex ${flexDirection} m-2 ${props.className} ${props.widthFull ? 'w-full' : 'w-fit'}`}>
            {
                props.segments.map((segment, index) => {
                    const isSelection = areSegmentsEqual(segment, props.selection);
                    const position = positionFromIndex(index);
                    return (
                        <div className={`flex ${flexDirection} ${props.widthFull && 'w-full'}`} key={index}>
                            {
                                index != 0 &&
                                <div
                                    className={`
                                        ${flexDirection}
                                        z-20
                                        bg-neumorphic-400 dark:bg-neumorphic-500
                                    `}
                                    style={{
                                        width: props.orientation == "vertical" ? "100%" : "1px",
                                        height: props.orientation == "vertical" ? "1px" : "100%",
                                    }}
                                />
                            }

                            <NeumorphicButton
                                onClick={() => props.onSelectionChange(isSelection ? undefined : segment)}
                                blueprint={createNeumorphicBlueprint(position, isSelection, orientation)}
                                style={createBorderRadiusStyle(position, orientation, borderRadius)}
                                disabled={props.disabled}
                                className={`
                                    ${!props.overrideSegmentPadding && 'px-3 py-2'}
                                    ${isSelection && props.deselectable == false && 'pointer-events-none'}
                                    ${realizeSegmentClassName(props.segmentClassName, isSelection)}
                                    ${realizeSpecificSegmentClassName(segment, isSelection)}
                                    ${props.widthFull && 'w-full'}
                                    select-none
                                    flex items-center justify-center
                                `}
                            >
                                {realizeSegment(segment)}
                            </NeumorphicButton>
                        </div>
                    );
                })
            }
        </div>
    );
}


function areSegmentsEqual(a: Segment<any> | undefined, b: Segment<any> | undefined): boolean {
    if (a == undefined || b == undefined) {
        return false;
    }

    const identifierOfA = typeof a == "object" ? a.id : a;
    const identifierOfB = typeof b == "object" ? b.id : b;

    return identifierOfA == identifierOfB;
}

function realizeSegment(segment: Segment<any>) {
    return (
        typeof segment == "object"
            ? segment.displayAs
            : segment
    );
}

function realizeSegmentClassName(segmentClassName: SegmentClassName | undefined, isSelection: boolean) {
    if (segmentClassName == undefined) {
        return '';
    }

    return (
        typeof segmentClassName === 'string'
            ? segmentClassName
            : segmentClassName?.(isSelection)
    );
}

function realizeSpecificSegmentClassName(segment: Segment<any> | undefined, isSelection: boolean): string {
    if (segment == undefined) {
        return '';
    }

    if (typeof segment === 'object') {
        if (segment.className == undefined) {
            return '';
        }

        return (
            typeof segment.className === 'string'
                ? segment.className
                : segment.className(isSelection)
        );
    } else {
        return segment;
    }
}

function createNeumorphicBlueprint(position: Position, isSelection: boolean, orientation: "horizontal" | "vertical"): NeumorphicBlueprint {
    return {
        inverted: isSelection,
        margin: 0,
        shadow: {
            blur: BLUR,
            distance: {
                left: orientation == "vertical"
                    ? DISTANCE
                    : { 'leading': DISTANCE, 'inBetween': 0, 'trailing': 0 }[position],
                right: orientation == "vertical"
                    ? DISTANCE
                    : { 'leading': 0, 'inBetween': 0, 'trailing': DISTANCE }[position],
                top: orientation == "vertical"
                    ? { 'leading': DISTANCE, 'inBetween': 0, 'trailing': 0 }[position]
                    : DISTANCE,
                bottom: orientation == "vertical"
                    ? { 'leading': 0, 'inBetween': 0, 'trailing': DISTANCE }[position]
                    : DISTANCE
            }
        }
    };
}

function createBorderRadiusStyle(position: Position, orientation: 'vertical' | 'horizontal', borderRadius: string): CSSProperties {
    return {
        borderTopLeftRadius: position == 'leading' ? borderRadius : undefined,
        borderTopRightRadius: (
            position == 'leading' && orientation == 'vertical' ||
            position == 'trailing' && orientation == 'horizontal'
                ? borderRadius : undefined
        ),
        borderBottomLeftRadius: (
            position == 'leading' && orientation == 'horizontal' ||
            position == 'trailing' && orientation == 'vertical'
                ? borderRadius : undefined
        ),
        borderBottomRightRadius: position == 'trailing' ? borderRadius : undefined
    }
}
