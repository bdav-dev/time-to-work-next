import SegmentedControls, { Segment } from "@/components/primitives/control/SegmentedControls";
import { PublicTransitType, PublicTransitTypeIdentifier, PublicTransitTypes } from "@/publicTransit/PublicTransitType";
import MaterialSymbol from "@/components/icon/MaterialSymbol";


export default function PublicTransitTypeSelect(props: SelectProps<PublicTransitType>) {
    return (
        <SegmentedControls
            segments={Object.values(PublicTransitTypeSegments)}
            selection={PublicTransitTypeSegments[props.value.identifier]}
            onSelectionChange={segment => props.onValueChange(segment!.value)}
            orientation={'horizontal'}
            segmentClassName={(isSelection) => `${isSelection && 'font-bold stroke-[10px]'}`}
            deselectable={false}
            disabled={props.disabled}
        />
    );
}

const PublicTransitTypeSegments = (
    PublicTransitTypes.values().reduce(
        (segments, type, index) => ({
            ...segments,
            [type.identifier]: {
                id: index,
                value: type,
                displayAs: (
                    <span className={'flex items-center gap-1'}>
                        <MaterialSymbol symbol={type.icon} opticalSize={"20px"} className={"size-5"}/>
                        {type.displayAs}
                    </span>
                )
            }
        }),
        {}
    ) as { [key in PublicTransitTypeIdentifier]: Segment<PublicTransitType> }
);