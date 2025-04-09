'use client';

import { ButtonProps } from "@/components/primitives/control/Button";

export default function FlatButton({ className, children, overrideMargin, circular, overridePadding, ...rest }: ButtonProps) {

    return (
        <button
            className={`
                ${!overridePadding && 'p-2.5'}
                ${circular ? 'rounded-full' : 'rounded-xl'}
                border border-neumorphic-700 dark:border-neumorphic-150 
                ${className}
            `}
            {...rest}
        >
            {children}
        </button>
    );
}