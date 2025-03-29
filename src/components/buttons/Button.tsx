'use client';

import { ButtonHTMLAttributes } from "react";
import { NeumorphicBlueprintFactory } from "@/neumorphic/neumorphic";
import NeumorphicButton from "@/components/neumorphic/NeumorphicButton";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    circular?: boolean;
};

export default function Button({ className, children, circular, ...rest }: ButtonProps) {
    const blueprint = NeumorphicBlueprintFactory.createMedium();
    blueprint.active = true;

    return (
        <NeumorphicButton
            blueprint={blueprint}
            className={`
                p-2.5
                ${circular ? 'rounded-full' : 'rounded-xl'}
                border-none
                ${className}
            `}
            {...rest}
        >
            {children}
        </NeumorphicButton>
    );

}