'use client';

import { useTheme } from "@/hooks/UseTheme";
import Button from "@/components/primitives/control/Button";
import { MaterialSymbols } from "@/icon/MaterialSymbols";
import MaterialSymbol from "@/components/icon/MaterialSymbol";

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
            className={`${props.className} size-12 flex items-center justify-center`}
        >
            <MaterialSymbol
                symbol={icon}
                opticalSize={'24px'}
                weight={300}
                className={'size-7'}
            />
        </Button>
    );
}