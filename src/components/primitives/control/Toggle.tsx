import SegmentedControls, { Segment } from "@/components/primitives/control/SegmentedControls";
import React from "react";


type ToggleProps = {
    isOn: boolean,
    onChange: (isOn: boolean) => void,
}

export default function Toggle(props: ToggleProps) {
    const onSegment: Segment<boolean> = {
        id: 0,
        displayAs: 'ON',
        value: true,
        className: (isSelection) => `${isSelection && 'text-green-500 dark:text-green-400'}`,
    };
    const offSegment: Segment<boolean> = {
        id: 1,
        displayAs: 'OFF',
        value: false,
        className: (isSelection) => `${isSelection && 'text-red-500 dark:text-red-400'}`
    };

    return (
        <SegmentedControls
            orientation={"horizontal"}
            segments={[onSegment, offSegment]}
            selection={props.isOn ? onSegment : offSegment}
            segmentClassName={(isSelection) => `min-w-14 ${isSelection && 'font-bold'}`}
            onSelectionChange={(selection) => props.onChange(selection!.value)}
            deselectable={false}
        />
    );
}