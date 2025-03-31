import SegmentedControls, { Segment } from "@/components/control/SegmentedControls";
import React from "react";


type ToggleProps = {
    isOn: boolean,
    onChange: (on: boolean) => void,
}

export default function Toggle(props: ToggleProps) {
    const onSegment: Segment = {
        id: 0,
        displayAs: 'ON',
        className: (isSelection) => `${isSelection && 'text-green-500 dark:text-green-400'}`,
    };
    const offSegment: Segment = {
        id: 1,
        displayAs: 'OFF',
        className: (isSelection) => `${isSelection && 'text-red-500 dark:text-red-400'}`
    };

    return (
        <SegmentedControls
            orientation={"horizontal"}
            segments={[onSegment, offSegment]}
            selection={props.isOn ? onSegment : offSegment}
            segmentClassName={(isSelection) => `min-w-14 ${isSelection && 'font-bold'}`}
            onSelectionChange={(selection) => props.onChange(selection == onSegment)}
            deselectable={false}
        />
    );
}