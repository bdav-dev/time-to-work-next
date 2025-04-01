'use client';

import LightModeIcon from "@/icons/LightModeIcon";
import DarkModeIcon from "@/icons/DarkModeIcon";
import { useTheme } from "@/hooks/UseTheme";
import Button from "@/components/buttons/Button";

type ThemeToggleProps = {
    overrideMargin?: boolean
}

export default function ThemeToggle(props: ThemeToggleProps) {
    const { darkTheme, setDarkTheme } = useTheme();

    return (
        <Button
            overrideMargin={props.overrideMargin}
            circular
            onClick={() => setDarkTheme(curr => !curr)}
            className={'size-12 flex items-center justify-center'}
        >
            {
                darkTheme
                    ? <DarkModeIcon className="stroke-[7] size-6"/>
                    : <LightModeIcon className="stroke-[7] size-6"/>
            }
        </Button>
    );
}