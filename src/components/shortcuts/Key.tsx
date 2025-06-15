import { ReactNode } from "react";

export default function Key({ children }: { children?: ReactNode }) {

    return (
        <div
            className={`
                w-fit px-2.5 py-0.5 
                rounded-md
                bg-neumorphic-100 dark:bg-neumorphic-850 
                border border-b-[3px]
                border-neumorphic-400 dark:border-neumorphic-700
            `}
        >
            {children}
        </div>
    );
}
