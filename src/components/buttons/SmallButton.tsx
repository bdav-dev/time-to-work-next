'use client';

import { ButtonHTMLAttributes } from "react";
import { NeumorphicBlueprintFactory } from "@/neumorphic/neumorphic";
import NeumorphicButton from "@/components/neumorphic/NeumorphicButton";

export type SmallButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export default function SmallButton({ className, children, ...rest }: SmallButtonProps) {
    const blueprint = NeumorphicBlueprintFactory.createSmall();
    blueprint.active = true;

    return (
        <NeumorphicButton
            blueprint={blueprint}
            className={`
                p-2.5
                rounded-full
                border-none
                ${className}
            `}
            {...rest}
        >
            {children}
        </NeumorphicButton>
    );

}