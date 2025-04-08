import SegmentedControls, { Segment } from "@/components/primitives/control/SegmentedControls";
import React from "react";
import { ScheduleBlockType, ScheduleBlockTypeIdentifier, ScheduleBlockTypes } from "@/schedule/ScheduleBlockType";


type ScheduleBlockTypeSelectProps = {
    value: ScheduleBlockType,
    onValueChange: (value: ScheduleBlockType) => void,
    disabled?: boolean
}

export default function ScheduleBlockTypeSelect(props: ScheduleBlockTypeSelectProps) {
    return (
        <SegmentedControls
            segments={Object.values(ScheduleBlockTypeSegments)}
            selection={ScheduleBlockTypeSegments[props.value.identifier]}
            orientation={'horizontal'}
            segmentClassName={(isSelection) => `${isSelection && 'font-bold'}`}
            onSelectionChange={selected => props.onValueChange(selected!.value)}
            deselectable={false}
            widthFull
            roundedFull
        />
    );
}

// @ts-ignore
const ScheduleBlockTypeSegments: { [key in ScheduleBlockTypeIdentifier]: Segment<ScheduleBlockType> } = (
    ScheduleBlockTypes.values().reduce(
        (segments, type, index) => ({
            ...segments,
            [type.identifier]: {
                id: index,
                value: type,
                displayAs: type.segment.displayAs
            }
        }),
        {}
    )
);