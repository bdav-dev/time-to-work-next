import {
    applyMaterialSymbolDefaults,
    MaterialSymbolInstance,
    MaterialSymbolInstanceDefaults,
    MaterialSymbolInstances,
    MaterialSymbols,
    MaterialSymbolStyle
} from "@/icon/MaterialSymbols";
import { CSSProperties } from "react";


export type MaterialSymbolProps = {
    symbol: MaterialSymbols,
    symbolStyle?: MaterialSymbolStyle
    useOpticalSize?: boolean,
    className?: string,
    style?: CSSProperties
} & Partial<Omit<MaterialSymbolInstance, 'svg'>>;

export default function MaterialSymbol(
    {
        symbol,
        fill = MaterialSymbolInstanceDefaults.fill,
        weight = MaterialSymbolInstanceDefaults.weight,
        grade = MaterialSymbolInstanceDefaults.grade,
        opticalSize = MaterialSymbolInstanceDefaults.opticalSize,
        symbolStyle = 'rounded',
        className,
        style
    }: MaterialSymbolProps
) {
    const symbolInstances = MaterialSymbolInstances[symbol][symbolStyle];

    if (!symbolInstances) {
        return undefined;
    }

    const symbolInstance = symbolInstances.find(
        symbolInstance => {
            const instance = applyMaterialSymbolDefaults(symbolInstance);
            return (
                instance.weight === weight &&
                instance.grade === grade &&
                instance.opticalSize === opticalSize &&
                instance.fill === fill
            );
        }
    );

    if (!symbolInstance) {
        return undefined;
    }

    return symbolInstance.svg(className, style);
}
