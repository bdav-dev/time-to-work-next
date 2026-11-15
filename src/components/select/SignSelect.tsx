import SegmentedControls, { Segment } from "@/components/primitives/control/SegmentedControls";
import MaterialSymbol, { MaterialSymbols } from "@/icons/material/MaterialSymbol";


export default function SignSelect(props: SelectProps<number>) {
    return (
        <SegmentedControls
            segments={Object.values(SignSegments)}
            selection={SignSegments[props.value == 1 ? 'positive' : 'negative']}
            orientation={'horizontal'}
            overrideSegmentPadding
            segmentClassName={'w-9 h-9'}
            onSelectionChange={selected => props.onValueChange(selected!.value)}
            deselectable={false}
            disabled={props.disabled}
        />
    );
}

const SignSegments: { [key in 'positive' | 'negative']: Segment<number> } = {
    positive: {
        id: 0,
        value: 1,
        displayAs: <MaterialSymbol symbol={MaterialSymbols.ADD}/>,
        className: isSelection => `${isSelection && 'fill-green-500 dark:fill-green-400'}`
    },
    negative: {
        id: 1,
        value: -1,
        displayAs: <MaterialSymbol symbol={MaterialSymbols.REMOVE}/>,
        className: isSelection => `${isSelection && 'fill-red-500 dark:fill-red-400'}`
    }
};
