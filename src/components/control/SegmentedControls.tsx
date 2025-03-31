import React, { CSSProperties } from "react";
import { NeumorphicBlueprint } from "@/neumorphic/neumorphic";
import NeumorphicButton from "@/components/neumorphic-primitives/NeumorphicButton";

export type Segment = {
    id: number,
    displayAs: string | React.ReactNode,
    className?: string | ((isSelection: boolean) => string),
} | string;

type Orientation = 'horizontal' | 'vertical';
type Position = 'leading' | 'inBetween' | 'trailing';
type SegmentClassName = string | ((isSelection: boolean) => string);

type SegmentedControlsProps<T extends Segment> = {
    orientation?: Orientation;
    segmentClassName?: SegmentClassName,
    segments: T[];
    selection: T | undefined,
    onSelectionChange: (selection?: T) => void,
    deselectable?: boolean,
    className?: string,
    widthFull?: boolean,
    roundedFull?: boolean,
    disabled?: boolean
}

const BLUR = 10;
const DISTANCE = 7;

export default function SegmentedControls<T extends Segment>(props: SegmentedControlsProps<T>) {
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
                props.segments.map((segment, i) => {
                    const isSelection = areSegmentsEqual(segment, props.selection);
                    const position = positionFromIndex(i);
                    return (
                        <div className={`flex ${flexDirection} ${props.widthFull && 'w-full'}`} key={i}>
                            {
                                i != 0 &&
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
                                    px-3 py-2
                                    ${isSelection && props.deselectable == false && 'pointer-events-none'}
                                    ${realizeSegmentClassName(props.segmentClassName, isSelection)}
                                    ${realizeSpecificSegmentClassName(segment, isSelection)}
                                    ${props.widthFull && 'w-full'}
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


function areSegmentsEqual(a: Segment | undefined, b: Segment | undefined): boolean {
    if (a == undefined || b == undefined) {
        return false;
    }

    const identifierOfA = typeof a == "object" ? a.id : a;
    const identifierOfB = typeof b == "object" ? b.id : b;

    return identifierOfA == identifierOfB;
}

function realizeSegment(segment: Segment) {
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

function realizeSpecificSegmentClassName(segment: Segment | undefined, isSelection: boolean): string {
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