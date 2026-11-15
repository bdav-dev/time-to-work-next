'use client';

import { useTheme } from "@/hooks/UseTheme";
import Button from "@/components/primitives/control/Button";
import MaterialSymbol, { MaterialSymbols } from "@/icons/material/MaterialSymbol";

type ThemeToggleProps = {
    overrideMargin?: boolean,
    className?: string
}

export default function ThemeToggle(props: ThemeToggleProps) {
    const { theme, toggleTheme } = useTheme();

    return (
        <Button
            overrideMargin={props.overrideMargin}
            circular
            onClick={() => toggleTheme()}
            className={`${props.className} size-12`}
        >
            <MaterialSymbol
                symbol={{ dark: MaterialSymbols.DARK_MODE, light: MaterialSymbols.LIGHT_MODE }[theme]}
                weight={300}
                className={'text-[1.15em]'}
            />
        </Button>
    );
}