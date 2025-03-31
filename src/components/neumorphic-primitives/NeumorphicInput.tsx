import { HTMLAttributes } from "react";
import flattenNeumorphicBlueprint, { NeumorphicBlueprint } from "@/neumorphic/neumorphic";

type NeumorphicInputProps = { blueprint: NeumorphicBlueprint, overrideBackground?: boolean, type: string } & HTMLAttributes<HTMLInputElement>;

export default function NeumorphicInput({ blueprint, overrideBackground, className, children, type, ...rest }: NeumorphicInputProps) {
    const bp = flattenNeumorphicBlueprint(blueprint);

    return (
        <input
            type={type}
            className={`${!overrideBackground && 'bg-neumorphic-100 dark:bg-neumorphic-750'} ${className}`}
            {...rest}
            style={{
                margin: bp.margin ? `margin: ${bp.margin}px` : undefined,
                boxShadow: `
                    ${bp.inverted ? 'inset' : ''} ${bp.right}px ${bp.bottom}px ${bp.blur}px var(--neumorphic-dark-shadow-color),
                    ${bp.inverted ? 'inset' : ''} ${-bp.left}px ${-bp.top}px ${bp.blur}px var(--neumorphic-light-shadow-color)
                `,
            }}
        />
    );
}
