import { HTMLAttributes } from "react";
import NeumorphicDiv from "@/components/neumorphic-primitives/NeumorphicDiv";
import { NeumorphicBlueprintFactory } from "@/neumorphic/neumorphic";

type ElevationProps = {
    overridePadding?: boolean,
    overrideRounded?: boolean,
    overrideMargin?: boolean,
} & HTMLAttributes<HTMLDivElement>;

export default function Elevation(
    { className, overridePadding, overrideRounded, overrideMargin, children, ...rest }: ElevationProps
) {
    const blueprint = NeumorphicBlueprintFactory.createLarge();
    if (overrideMargin) {
        blueprint.margin = 0;
    }

    return (
        <NeumorphicDiv
            blueprint={blueprint}
            className={`
                ${!overridePadding && 'p-4'}
                ${!overrideRounded && 'rounded-3xl'}
                ${className}
            `}
            {...rest}
        >
            {children}
        </NeumorphicDiv>
    )
}
