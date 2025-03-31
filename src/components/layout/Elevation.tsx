import { HTMLAttributes } from "react";
import NeumorphicDiv from "@/components/neumorphic-primitives/NeumorphicDiv";
import { NeumorphicBlueprintFactory } from "@/neumorphic/neumorphic";

type ElevationProps = { overridePadding?: boolean } & HTMLAttributes<HTMLDivElement>;
export default function Elevation({ className, overridePadding, children, ...rest }: ElevationProps) {

    return (
        <NeumorphicDiv
            blueprint={NeumorphicBlueprintFactory.createLarge()}
            className={`
                neumorphic-large
                ${!overridePadding && 'p-4'}
                rounded-2xl
                ${className}
            `}
            {...rest}
        >
            {children}
        </NeumorphicDiv>
    )
}
