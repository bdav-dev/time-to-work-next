import { HTMLAttributes } from "react";


type FrameProps = { overridePadding?: boolean } & HTMLAttributes<HTMLDivElement>;

export default function Frame({ className, children, overridePadding, ...rest }: FrameProps) {

    return (
        <div
            className={`
                ${className}
                border-2 rounded-lg 
                border-neumorphic-200 dark:border-neumorphic-700
                ${!overridePadding && 'p-2.5'}
            `}
            {...rest}
        >
            {children}
        </div>
    );
}
