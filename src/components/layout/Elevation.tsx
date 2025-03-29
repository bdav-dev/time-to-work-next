import { HTMLAttributes } from "react";
import NeumorphicDiv from "@/components/neumorphic/NeumorphicDiv";
import { NeumorphicBlueprintFactory } from "@/neumorphic/neumorphic";

type ElevationProps = HTMLAttributes<HTMLDivElement>;
export default function Elevation({ className, children, ...rest }: ElevationProps) {

    return (
        <NeumorphicDiv
            blueprint={NeumorphicBlueprintFactory.createLarge()}
            className={`
                neumorphic-large
                p-4
                rounded-2xl
                ${className}
            `}
            {...rest}
        >
            {children}
        </NeumorphicDiv>
    )
}
