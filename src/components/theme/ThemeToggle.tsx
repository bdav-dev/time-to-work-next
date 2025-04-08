'use client';

import LightModeIcon from "@/icons/LightModeIcon";
import DarkModeIcon from "@/icons/DarkModeIcon";
import { useTheme } from "@/hooks/UseTheme";
import Button from "@/components/primitives/control/Button";
import { IconProps } from "@/icons/IconProps";
import React from "react";

type ThemeToggleProps = {
    overrideMargin?: boolean
}

export default function ThemeToggle(props: ThemeToggleProps) {
    const { darkTheme, setDarkTheme } = useTheme();

    const Icon: (props: IconProps) => React.ReactNode = darkTheme ? DarkModeIcon : LightModeIcon;

    return (
        <Button
            overrideMargin={props.overrideMargin}
            circular
            onClick={() => setDarkTheme(curr => !curr)}
            className={'size-12 flex items-center justify-center'}
        >
            <Icon className={"stroke-[7] size-6"}/>
        </Button>
    );
}