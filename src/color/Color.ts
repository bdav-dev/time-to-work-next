export type Color = string | ThemedColor;

export type ColorPair = {
    background?: string,
    text?: string
}

export type ThemedColor = {
    inLightMode: string,
    inDarkMode: string
}

export type ThemedColorPair = {
    background?: Color,
    text?: Color
}

export function applyThemeToColor(color: Color, isDarkMode: boolean) {
    return (
        typeof color === "string"
            ? color
            : isDarkMode
                ? color.inDarkMode
                : color.inLightMode
    );
}

export function applyThemeToThemedColorPair(themedColorPair: ThemedColorPair, isDarkMode: boolean): ColorPair {
    return {
        background: themedColorPair.background ? applyThemeToColor(themedColorPair.background, isDarkMode) : undefined,
        text: themedColorPair.text ? applyThemeToColor(themedColorPair.text, isDarkMode) : undefined
    };
}