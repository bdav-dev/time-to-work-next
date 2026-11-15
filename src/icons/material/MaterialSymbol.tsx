import { WeightableIconProps } from "@/icons/WeightableIcon";


export enum MaterialSymbols {
    LIGHT_MODE = 'light_mode',
    DARK_MODE = 'dark_mode',
    SETTINGS = 'settings',
    TIMER = 'timer',
    DIRECTIONS_WALK = 'directions_walk',
    DIRECTIONS_RUN = 'directions_run',
    TRAIN = 'train',
    DIRECTIONS_BUS = 'directions_bus',
    TRAM = 'tram',
    SUBWAY = 'subway',
    ADD = 'add',
    REMOVE = 'remove',
    CHECK = 'check',
    CLOSE = 'close',
    MENU = 'menu',
    INFO = 'info',
    KEYBOARD = 'keyboard',
    LOCK = 'lock',
    CAPTIVE_PORTAL = 'captive_portal'
}

export const MATERIAL_SYMBOLS_API_URL = `https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght@20..48,100..700&icon_names=${Object.values(MaterialSymbols).toSorted().join(',')}`;


type MaterialSymbolConfiguration = {
    opticalSize?: 20 | 24 | 40 | 48
    weight?: 100 | 200 | 300 | 350 | 400 | 500 | 600 | 700 | number
}

export type MaterialSymbolProps = { symbol: MaterialSymbols } & MaterialSymbolConfiguration & WeightableIconProps;

export default function MaterialSymbol(props: MaterialSymbolProps) {

    return (
        <span
            className={`material-symbols-rounded select-none`}
            style={{ fontVariationSettings: createFontVariationSettings(props), display: 'inline-flex', fontSize: "1.5em" }}
        >
            <span className={props.className} style={props.style}>
                {props.symbol}
            </span>
        </span>
    );
}

function createFontVariationSettings(configuration: MaterialSymbolConfiguration) {
    return (
        Object
            .entries(
                {
                    opsz: configuration.opticalSize,
                    wght: configuration.weight
                }
            )
            .filter(([, value]) => value != undefined)
            .map(([key, value]) => `"${key}" ${value}`).join(', ')
        || undefined
    );
}
