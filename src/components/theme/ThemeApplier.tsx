

'use client';

import React from "react";
import { useTheme } from "@/hooks/UseTheme";

type ThemeApplierProps = {
    children?: React.ReactNode
}

export default function ThemeApplier(props: ThemeApplierProps) {
    const { darkTheme } = useTheme();

    return (
        <div className={darkTheme ? "dark text-dark" : "text-light"}>
            {props.children}
        </div>
    );

}