import { HTMLAttributes } from "react";
import flattenNeumorphicBlueprint, { NeumorphicBlueprint } from "@/neumorphic/neumorphic";

type NeumorphicButtonProps = { blueprint: NeumorphicBlueprint } & HTMLAttributes<HTMLButtonElement>;

export default function NeumorphicButton({blueprint, children, ...rest}: NeumorphicButtonProps) {
    const bp = flattenNeumorphicBlueprint(blueprint);

    return (
        <button {...rest}>
            {children}
            <style jsx>{`
                button {
                    background-color: var(--neumorphic-background-color);
                    ${bp.margin ? `margin: ${bp.margin}px;` : ''}
                    box-shadow:
                        ${bp.inverted ? 'inset' : ''} ${bp.right}px ${bp.bottom}px ${bp.blur}px var(--neumorphic-dark-shadow-color),
                        ${bp.inverted ? 'inset' : ''} ${-bp.left}px ${-bp.top}px ${bp.blur}px var(--neumorphic-light-shadow-color);
                }
                
                button:active {
                    background-color: var(--neumorphic-background-color);
                    ${bp.margin ? `margin: ${bp.margin}px;` : ''}
                    box-shadow:
                        ${bp.inverted ? '' : 'inset'} ${bp.right}px ${bp.bottom}px ${bp.blur}px var(--neumorphic-dark-shadow-color),
                        ${bp.inverted ? '' : 'inset'} ${-bp.left}px ${-bp.top}px ${bp.blur}px var(--neumorphic-light-shadow-color);
                }
            `}</style>
        </button>
    );
}