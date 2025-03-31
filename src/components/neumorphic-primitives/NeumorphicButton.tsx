import { ButtonHTMLAttributes } from "react";
import flattenNeumorphicBlueprint, { NeumorphicBlueprint } from "@/neumorphic/neumorphic";

type NeumorphicButtonProps = { blueprint: NeumorphicBlueprint, overrideBackground?: boolean } & ButtonHTMLAttributes<HTMLButtonElement>;

export default function NeumorphicButton({ blueprint, overrideBackground, children, disabled, className, ...rest }: NeumorphicButtonProps) {
    const bp = flattenNeumorphicBlueprint(blueprint);

    return (
        <button
            disabled={disabled}
            className={`${!overrideBackground && 'bg-neumorphic-100 dark:bg-neumorphic-750'} ${disabled && 'pointer-events-none'} ${className}`}
            {...rest}
        >
            {children}
            <style jsx>{`
                button {
                    ${bp.margin ? `margin: ${bp.margin}px;` : ''}
                    box-shadow:
                        ${bp.inverted ? 'inset' : ''} ${bp.right}px ${bp.bottom}px ${bp.blur}px var(--neumorphic-dark-shadow-color),
                        ${bp.inverted ? 'inset' : ''} ${-bp.left}px ${-bp.top}px ${bp.blur}px var(--neumorphic-light-shadow-color);
                }

                button:active {
                    box-shadow:
                        ${bp.inverted ? '' : 'inset'} ${bp.right}px ${bp.bottom}px ${bp.blur}px var(--neumorphic-dark-shadow-color),
                        ${bp.inverted ? '' : 'inset'} ${-bp.left}px ${-bp.top}px ${bp.blur}px var(--neumorphic-light-shadow-color);
                }

                button:disabled {
                    opacity: 0.6;
                }
            `}</style>
        </button>
    );
}