import { HTMLAttributes } from "react";
import flattenNeumorphicBlueprint, { NeumorphicBlueprint } from "@/neumorphic/NeumorphicStyle";

type NeumorphicDivProps = { blueprint: NeumorphicBlueprint, overrideBackground?: boolean } & HTMLAttributes<HTMLDivElement>;

export default function NeumorphicDiv({blueprint, overrideBackground, className, children, ...rest}: NeumorphicDivProps) {
    const bp = flattenNeumorphicBlueprint(blueprint);

    return (
        <div className={`${!overrideBackground && 'bg-neumorphic-100 dark:bg-neumorphic-750'} ${className}`} {...rest}>
            {children}
            <style jsx>{`
                div {
                    ${bp.margin ? `margin: ${bp.margin}px;` : ''}
                    box-shadow:
                        ${bp.inverted ? 'inset' : ''} ${bp.right}px ${bp.bottom}px ${bp.blur}px var(--neumorphic-dark-shadow-color),
                        ${bp.inverted ? 'inset' : ''} ${-bp.left}px ${-bp.top}px ${bp.blur}px var(--neumorphic-light-shadow-color);
                }
            `}</style>
        </div>
    );
}