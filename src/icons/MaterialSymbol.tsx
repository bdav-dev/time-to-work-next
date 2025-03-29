import React, { HTMLProps } from "react";

export enum MaterialSymbols {
    SCHEDULE,
    TIMELAPSE,
    AV_TIMER,
    TIMER,
    UPDATE
}

const MaterialSymbolsMap: { [key in MaterialSymbols]: React.ReactNode } = {
    [MaterialSymbols.SCHEDULE]: <>&#xe8b5;</>,
    [MaterialSymbols.TIMELAPSE]: <>&#xe422;</>,
    [MaterialSymbols.AV_TIMER]: <>&#xe01b;</>,
    [MaterialSymbols.TIMER]: <>&#xe425;</>,
    [MaterialSymbols.UPDATE]: <>&#xe923;</>,
}

type MaterialSymbolProps = HTMLProps<HTMLSpanElement> & {
    symbol: MaterialSymbols
}

export default function MaterialSymbol({ symbol, style, ...rest }: MaterialSymbolProps) {
    return (
        <span style={{ ...{ fontFamily: 'Material Symbols Rounded Regular' }, ...style }} {...rest}>
            {MaterialSymbolsMap[symbol]}
        </span>
    );
}