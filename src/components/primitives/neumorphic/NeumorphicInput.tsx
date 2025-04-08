import { InputHTMLAttributes, Ref } from "react";
import flattenNeumorphicBlueprint, { NeumorphicBlueprint } from "@/neumorphic/NeumorphicStyle";

type NeumorphicInputProps = {
    blueprint: NeumorphicBlueprint,
    overrideBackground?: boolean,
    type: string,
    ref?: Ref<HTMLInputElement>
} & InputHTMLAttributes<HTMLInputElement>;

export default function NeumorphicInput(
    { blueprint, overrideBackground, className, children, type, ref, ...rest }: NeumorphicInputProps
) {
    const bp = flattenNeumorphicBlueprint(blueprint);

    return (
        <input
            ref={ref}
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
