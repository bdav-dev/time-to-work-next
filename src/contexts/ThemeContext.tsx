'use client';

import { createContext, ReactNode, useEffect, useLayoutEffect, useState, useTransition } from "react";
import { Theme } from "@/library/theme";
import { persistTheme } from "@/app/actions/theme";


type ThemeContextType = {
    theme: Theme,
    toggleTheme: () => void
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export default function ThemeContextProvider(props: { initialTheme: Theme, children?: ReactNode }) {
    const [theme, setTheme] = useState<Theme>(props.initialTheme);
    const [, startTransition] = useTransition();

    useIsomorphicLayoutEffect(
        () => { document.documentElement.classList.toggle("dark", theme === 'dark') },
        [theme]
    );

    function toggleTheme() {
        const nextTheme: Theme = theme === 'dark' ? 'light' : 'dark';
        setTheme(nextTheme);
        startTransition(() => { persistTheme(nextTheme) });
    }

    return (
        <ThemeContext value={{ theme, toggleTheme }}>
            {props.children}
        </ThemeContext>
    );
}

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;
