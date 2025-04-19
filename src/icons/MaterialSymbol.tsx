import { HTMLProps, ReactNode } from "react";

export enum MaterialSymbols {
    SCHEDULE,
    TIMELAPSE,
    AV_TIMER,
    TIMER,
    UPDATE,
    DIRECTIONS_WALK,
    TRAIN,
    SETTINGS,
    DIRECTIONS_BUS,
    TRAM,
    SUBWAY
}

const MaterialSymbolsMap: { [key in MaterialSymbols]: ReactNode } = {
    [MaterialSymbols.SCHEDULE]: <>&#xe8b5;</>,
    [MaterialSymbols.TIMELAPSE]: <>&#xe422;</>,
    [MaterialSymbols.AV_TIMER]: <>&#xe01b;</>,
    [MaterialSymbols.TIMER]: <>&#xe425;</>,
    [MaterialSymbols.UPDATE]: <>&#xe923;</>,
    [MaterialSymbols.DIRECTIONS_WALK]: <>&#xe536;</>,
    [MaterialSymbols.TRAIN]: <>&#xe570;</>,
    [MaterialSymbols.SETTINGS]: <>&#xe8b8;</>,
    [MaterialSymbols.DIRECTIONS_BUS]: <>&#xe530;</>,
    [MaterialSymbols.TRAM]: <>&#xe571;</>,
    [MaterialSymbols.SUBWAY]: <>&#xe56f;</>
}

type MaterialSymbolProps = HTMLProps<HTMLSpanElement> & {
    symbol: MaterialSymbols
}

export default function MaterialSymbol({ symbol, style, className, ...rest }: MaterialSymbolProps) {
    return (
        <span
            style={{ ...{ fontFamily: 'Material Symbols Rounded Regular' }, ...style }}
            className={`inline-flex items-center justify-center ${className}`}
            {...rest}
        >
            {MaterialSymbolsMap[symbol]}
        </span>
    );
}