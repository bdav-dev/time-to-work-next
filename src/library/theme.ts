export type Theme = 'light' | 'dark';

export const THEME_COOKIE = 'theme';

export function parseTheme(value: string | undefined): Theme {
    return value === 'light' || value === 'dark' ? value : 'dark';
}
