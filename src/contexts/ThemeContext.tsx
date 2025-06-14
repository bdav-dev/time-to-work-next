'use client';

import { createContext, Dispatch, SetStateAction, useEffect } from "react";
import useStateWithLocalStorage from "@/hooks/UseStateWithLocalStorage";
import { ContextProviderProps } from "@/contexts/ContextTypes";


type ThemeContextType = {
    darkTheme: boolean,
    setDarkTheme: Dispatch<SetStateAction<boolean>>
}

export const ThemeContext = createContext<ThemeContextType>({
    darkTheme: true,
    setDarkTheme: () => { }
});

export default function ThemeProvider({ children }: ContextProviderProps) {
    const [darkTheme, setDarkTheme] = useStateWithLocalStorage("ttw-n.useDarkTheme", true);

    useEffect(() => {
        document.documentElement.style.setProperty(
            '--neumorphic-background-color', (darkTheme ? "var(--gray-neumorphic-background-color)" : "var(--white-neumorphic-background-color)")
        );
        document.documentElement.style.setProperty(
            '--neumorphic-light-shadow-color', (darkTheme ? "var(--gray-neumorphic-light-shadow-color)" : "var(--white-neumorphic-light-shadow-color)")
        );
        document.documentElement.style.setProperty(
            '--neumorphic-dark-shadow-color', (darkTheme ? "var(--gray-neumorphic-dark-shadow-color)" : "var(--white-neumorphic-dark-shadow-color)")
        );
    }, [darkTheme]);

    return (
        <ThemeContext.Provider value={{ darkTheme, setDarkTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}