import SegmentedControls, { Segment } from "@/components/primitives/control/SegmentedControls";


type ToggleProps = {
    value: boolean,
    onValueChange: (isOn: boolean) => void,
    disabled?: boolean,
    customLabels?: {
        true: string,
        false: string
    }
}

export default function Toggle(props: ToggleProps) {
    const onSegment: Segment<boolean> = {
        id: 0,
        displayAs: props.customLabels?.true ?? 'AN',
        value: true,
        className: (isSelection) => `${isSelection && 'text-green-500 dark:text-green-400'}`,
    };
    const offSegment: Segment<boolean> = {
        id: 1,
        displayAs: props.customLabels?.false ?? 'AUS',
        value: false,
        className: (isSelection) => `${isSelection && 'text-red-500 dark:text-red-400'}`
    };

    return (
        <SegmentedControls
            overrideSegmentPadding
            disabled={props.disabled}
            orientation={"horizontal"}
            segments={[onSegment, offSegment]}
            selection={props.value ? onSegment : offSegment}
            segmentClassName={(isSelection) => `min-w-14 ${isSelection && 'font-bold'} px-2 py-1.5`}
            onSelectionChange={(selection) => props.onValueChange(selection!.value)}
            deselectable={false}
        />
    );
}
