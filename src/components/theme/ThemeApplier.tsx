'use client';

import React from "react";
import { useTheme } from "@/hooks/UseTheme";

type ThemeApplierProps = {
    className?: string,
    children?: React.ReactNode
}

export default function ThemeApplier(props: ThemeApplierProps) {
    const { darkTheme } = useTheme();

    return (
        <div className={`${darkTheme ? "dark text-dark" : "text-light"} ${props.className}`}>
            {props.children}
        </div>
    );

}