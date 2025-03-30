import React from "react";
import { NeumorphicBlueprint } from "@/neumorphic/neumorphic";
import NeumorphicButton from "@/components/neumorphic/NeumorphicButton";

type HasDisplayAs = { displayAs: string | React.ReactNode };

type SegmentedControlsProps<T extends HasDisplayAs | string> = {
    orientation: "horizontal" | "vertical"
    segmentClassName?: string,
    segments: T[];
    selection: T | undefined,
    onSelectionChanged: (active?: T) => void,
    deselectable?: boolean,
}

enum Position {
    LEADING,
    IN_BETWEEN,
    TRAILING
}

const BLUR = 10;
const DISTANCE = 7;

function createNeumorphicBlueprint(position: Position, isActive: boolean, orientation: "horizontal" | "vertical"): NeumorphicBlueprint {
    return {
        inverted: isActive,
        margin: 0,
        shadow: {
            blur: BLUR,
            distance: {
                left: orientation == "vertical"
                    ? DISTANCE
                    : { [Position.LEADING]: DISTANCE, [Position.IN_BETWEEN]: 0, [Position.TRAILING]: 0 }[position],
                right: orientation == "vertical"
                    ? DISTANCE
                    : { [Position.LEADING]: 0, [Position.IN_BETWEEN]: 0, [Position.TRAILING]: DISTANCE }[position],
                top: orientation == "vertical"
                    ? { [Position.LEADING]: DISTANCE, [Position.IN_BETWEEN]: 0, [Position.TRAILING]: 0 }[position]
                    : DISTANCE,
                bottom: orientation == "vertical"
                    ? { [Position.LEADING]: 0, [Position.IN_BETWEEN]: 0, [Position.TRAILING]: DISTANCE }[position]
                    : DISTANCE
            }
        }
    };
}

export default function SegmentedControls<T extends HasDisplayAs | string>(props: SegmentedControlsProps<T>) {
    const flexDirection = props.orientation == "vertical" ? "flex-col" : "flex-row";

    function positionFromIndex(index: number): Position {
        switch (index) {
            case 0:
                return Position.LEADING;
            case props.segments.length - 1:
                return Position.TRAILING;
            default:
                return Position.IN_BETWEEN;
        }
    }

    return (
        <div className={`flex ${flexDirection} w-fit m-10`}>
            {
                props.segments.map((selection, i) => {
                    const isSelection = selection == props.selection;

                    return (
                        <div className={`flex ${flexDirection}`} key={i}>
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
                                onClick={() => props.onSelectionChanged(isSelection ? undefined : selection)}
                                blueprint={createNeumorphicBlueprint(positionFromIndex(i), isSelection, props.orientation)}
                                className={`
                                    p-2
                                    ${positionFromIndex(i) == Position.LEADING && (props.orientation == "vertical" ? 'rounded-t-lg' : 'rounded-l-lg')}
                                    ${positionFromIndex(i) == Position.TRAILING && (props.orientation == "vertical" ? 'rounded-b-lg' : 'rounded-r-lg')}
                                    ${isSelection && props.deselectable == false && 'pointer-events-none'}
                                    ${props.segmentClassName}
                                `}
                            >
                                {
                                    typeof selection == "object"
                                        ? selection.displayAs
                                        : selection
                                }
                            </NeumorphicButton>
                        </div>
                    );
                })
            }
        </div>
    );
}
