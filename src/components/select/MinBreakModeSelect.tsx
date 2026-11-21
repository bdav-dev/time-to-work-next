import SegmentedControls, { Segment } from "@/components/primitives/control/SegmentedControls";
import { MinBreakMode } from "@/hooks/configuration/instances/UseWorkingTimeConfiguration";


export default function MinBreakModeSelect(props: SelectProps<MinBreakMode>) {
    return (
        <SegmentedControls
            segments={Object.values(MinBreakModeSegments)}
            selection={MinBreakModeSegments[props.value]}
            onSelectionChange={segment => props.onValueChange(segment!.value)}
            orientation={'horizontal'}
            deselectable={false}
            disabled={props.disabled}
        />
    );
}

const MinBreakModeSegments: { [key in MinBreakMode]: Segment<MinBreakMode> } = {
    total: {
        id: 0,
        value: 'total',
        displayAs: 'Insgesamt'
    },
    straight: {
        id: 1,
        value: 'straight',
        displayAs: 'Am Stück'
    }
};
