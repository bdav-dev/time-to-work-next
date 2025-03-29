import { HTMLAttributes } from "react";
import flattenNeumorphicBlueprint, { NeumorphicBlueprint } from "@/neumorphic/neumorphic";

type NeumorphicDivProps = { blueprint: NeumorphicBlueprint } & HTMLAttributes<HTMLDivElement>;

export default function NeumorphicDiv({blueprint, children, ...rest}: NeumorphicDivProps) {
    const bp = flattenNeumorphicBlueprint(blueprint);

    return (
        <div {...rest}>
            {children}
            <style jsx>{`
                div {
                    background-color: var(--neumorphic-background-color);
                    ${bp.margin ? `margin: ${bp.margin}px;` : ''}
                    box-shadow:
                        ${bp.inverted ? 'inset' : ''} ${bp.right}px ${bp.bottom}px ${bp.blur}px var(--neumorphic-dark-shadow-color),
                        ${bp.inverted ? 'inset' : ''} ${-bp.left}px ${-bp.top}px ${bp.blur}px var(--neumorphic-light-shadow-color);
                }
            `}</style>
        </div>
    );
}