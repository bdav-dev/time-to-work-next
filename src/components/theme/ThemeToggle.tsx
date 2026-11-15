'use client';

import { useTheme } from "@/hooks/UseTheme";
import Button from "@/components/primitives/control/Button";
import MaterialSymbol, { MaterialSymbols } from "@/icons/material/MaterialSymbol";

type ThemeToggleProps = {
    overrideMargin?: boolean,
    className?: string
}

export default function ThemeToggle(props: ThemeToggleProps) {
    const { darkTheme, setDarkTheme } = useTheme();

    const icon =  darkTheme ? MaterialSymbols.DARK_MODE : MaterialSymbols.LIGHT_MODE;

    return (
        <Button
            overrideMargin={props.overrideMargin}
            circular
            onClick={() => setDarkTheme(isDark => !isDark)}
            className={`${props.className} size-12`}
        >
            <MaterialSymbol
                symbol={icon}
                weight={300}
                className={'text-[1.15em]'}
            />
        </Button>
    );
}