'use client';

import LightModeIcon from "@/icons/LightModeIcon";
import DarkModeIcon from "@/icons/DarkModeIcon";
import { useTheme } from "@/hooks/UseTheme";
import Button from "@/components/buttons/Button";

type ThemeToggleProps = {
    selected?: boolean
}

export default function ThemeToggle(props: ThemeToggleProps) {
    const { darkTheme, setDarkTheme } = useTheme();

    return (
        <Button
            circular
            onClick={() => setDarkTheme(curr => !curr)}
        >
            {
                darkTheme
                    ? <DarkModeIcon className="stroke-[7] h-6 w-6"/>
                    : <LightModeIcon className="stroke-[7] h-6 w-6"/>
            }
        </Button>
    );
}