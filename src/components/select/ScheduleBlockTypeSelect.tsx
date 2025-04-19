import SegmentedControls, { Segment } from "@/components/primitives/control/SegmentedControls";
import { ScheduleBlockType, ScheduleBlockTypeIdentifier, ScheduleBlockTypes } from "@/schedule/ScheduleBlockType";


export default function ScheduleBlockTypeSelect(props: SelectProps<ScheduleBlockType>) {
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

const ScheduleBlockTypeSegments = (
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
    ) as { [key in ScheduleBlockTypeIdentifier]: Segment<ScheduleBlockType> }
);
