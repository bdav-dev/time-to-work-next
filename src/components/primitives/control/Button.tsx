'use client';

import { ButtonHTMLAttributes } from "react";
import { NeumorphicBlueprintFactory } from "@/neumorphic/NeumorphicStyle";
import NeumorphicButton from "@/components/primitives/neumorphic/NeumorphicButton";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    circular?: boolean,
    overrideMargin?: boolean,
    overridePadding?: boolean
};

export default function Button({ className, children, overrideMargin, circular, overridePadding, ...rest }: ButtonProps) {
    const blueprint = NeumorphicBlueprintFactory.createMedium();
    blueprint.active = true;
    if (overrideMargin) {
        blueprint.margin = undefined;
    }

    return (
        <NeumorphicButton
            blueprint={blueprint}
            className={`
                ${!overridePadding && 'p-2.5'}
                ${circular ? 'rounded-full' : 'rounded-xl'}
                border-none
                ${className}
                flex items-center justify-center
            `}
            {...rest}
        >
            {children}
        </NeumorphicButton>
    );
}
