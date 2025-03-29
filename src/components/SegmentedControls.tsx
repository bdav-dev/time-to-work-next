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

const BLUR = 9;
const DISTANCE = 5;

function createVerticalBlueprint(position: Position, isActive: boolean): NeumorphicBlueprint {
    return {
        inverted: isActive,
        margin: 0,
        shadow: {
            blur: BLUR,
            distance: {
                left: DISTANCE,
                right: DISTANCE,
                top: {
                    [Position.LEADING]: DISTANCE,
                    [Position.IN_BETWEEN]: 0,
                    [Position.TRAILING]: 0
                }[position],
                bottom: {
                    [Position.LEADING]: 0,
                    [Position.IN_BETWEEN]: 0,
                    [Position.TRAILING]: DISTANCE
                }[position]
            }
        }
    };
}

function createHorizontalBlueprint(position: Position, isActive: boolean): NeumorphicBlueprint {
    return {
        inverted: isActive,
        margin: 0,
        shadow: {
            blur: BLUR,
            distance: {
                left: {
                    [Position.LEADING]: DISTANCE,
                    [Position.IN_BETWEEN]: 0,
                    [Position.TRAILING]: 0
                }[position],
                right: {
                    [Position.LEADING]: 0,
                    [Position.IN_BETWEEN]: 0,
                    [Position.TRAILING]: DISTANCE
                }[position],
                top: DISTANCE,
                bottom: DISTANCE
            }
        }
    };
}


export default function SegmentedControls<T extends HasDisplayAs | string>(props: SegmentedControlsProps<T>) {

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
        <div className={`flex ${props.orientation == "vertical" ? "flex-col" : "flex-row"} w-fit m-10`}>
            {
                props.segments.map((selection, i) => {
                    const isSelection = selection == props.selection;

                    return (
                        <div className={`flex ${props.orientation == "vertical" ? "flex-col" : "flex-row"}`} key={i}>
                            {
                                i != 0 &&
                                <div
                                    className={`
                                        ${props.orientation == "vertical" ? "flex-col" : "flex-row"}
                                        z-20
                                        bg-zinc-400
                                    `}
                                    style={{
                                        width: props.orientation == "vertical" ? "100%" : "1px",
                                        height: props.orientation == "vertical" ? "1px%" : "100%",
                                    }}
                                />
                            }

                            <NeumorphicButton
                                onClick={() => props.onSelectionChanged(isSelection ? undefined : selection)}
                                blueprint={props.orientation == "vertical" ? createVerticalBlueprint(positionFromIndex(i), isSelection) : createHorizontalBlueprint(positionFromIndex(i), isSelection)}
                                className={`
                                    p-2
                                    ${positionFromIndex(i) == Position.LEADING && (props.orientation == "vertical" ? 'rounded-t-lg' : 'rounded-l-lg')}
                                    ${positionFromIndex(i) == Position.TRAILING && (props.orientation == "vertical" ? 'rounded-b-lg' : 'rounded-r-lg')}
                                    ${isSelection && props.deselectable == false && 'pointer-events-none'}
                                    ${props.segmentClassName}
                                `}
                                // style={{
                                //      backgroundColor: option == props.active ? "var(--neumorphic-light-shadow-color)" : undefined
                                // }}
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