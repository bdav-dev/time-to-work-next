import { HTMLAttributes } from "react";


type FrameProps = { overridePadding?: boolean, onSection?: boolean } & HTMLAttributes<HTMLDivElement>;

export default function Frame({ className, children, overridePadding, onSection, ...rest }: FrameProps) {

    return (
        <div
            className={`
                ${className}
                border-2 rounded-lg
                ${onSection ? "border-neumorphic-100 dark:border-neumorphic-750 " : "border-neumorphic-200 dark:border-neumorphic-700"}
                ${!overridePadding && 'p-2.5'}
            `}
            {...rest}
        >
            {children}
        </div>
    );
}
