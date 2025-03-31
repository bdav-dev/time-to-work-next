import React, { HTMLAttributes } from "react";

type SectionProps = HTMLAttributes<HTMLDivElement>;

export default function Section({ children, className, ...rest }: SectionProps) {

    return (
        <div className={`p-2.5 rounded-lg dark:bg-neumorphic-800 bg-neumorphic-200 ${className}`} {...rest}>
            {children}
        </div>
    );

}