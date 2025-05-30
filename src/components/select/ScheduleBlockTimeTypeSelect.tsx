import SegmentedControls, { Segment } from "@/components/primitives/control/SegmentedControls";
import { ScheduleBlockTimeType, ScheduleBlockTimeTypeIdentifier, ScheduleBlockTimeTypes } from "@/schedule/ScheduleBlockTimeType";


export default function ScheduleBlockTimeTypeSelect(props: SelectProps<ScheduleBlockTimeType>) {
    return (
        <SegmentedControls
            segments={Object.values(ScheduleBlockTimeSegments)}
            selection={ScheduleBlockTimeSegments[props.value.identifier]}
            onSelectionChange={segment => props.onValueChange(segment!.value)}
            orientation={'horizontal'}
            segmentClassName={(isSelection) => `${isSelection && 'font-bold'}`}
            deselectable={false}
            disabled={props.disabled}
        />
    );
}

export const ScheduleBlockTimeSegments = (
    ScheduleBlockTimeTypes.values().reduce(
        (segments, timeType, index) => ({
            ...segments,
            [timeType.identifier]: {
                id: index,
                value: timeType,
                displayAs: timeType.segment.displayAs,
                className: (isSelection: boolean) => `${isSelection && timeType.segment.className}`
            }
        }),
        {}
    ) as { [key in ScheduleBlockTimeTypeIdentifier]: Segment<ScheduleBlockTimeType> }
);
