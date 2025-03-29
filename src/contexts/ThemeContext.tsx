'use client';

import React, { Dispatch, SetStateAction, useEffect } from "react";
import useLocalStorage from "../hooks/UseLocalStorage";


type ThemeContextType = {
    darkTheme: boolean,
    setDarkTheme: Dispatch<SetStateAction<boolean>>
}

export const ThemeContext = React.createContext<ThemeContextType>({
    darkTheme: true,
    setDarkTheme: () => { }
});

type ThemeProviderProps = {
    children?: React.ReactNode
}

export default function ThemeProvider(props: ThemeProviderProps) {
    const [darkTheme, setDarkTheme] = useLocalStorage("useDarkTheme", true);

    useEffect(() => {
        document.documentElement.style.setProperty(
            '--neumorphic-text-color', (darkTheme ? "var(--gray-neumorphic-text-color)" : "var(--white-neumorphic-text-color)")
        );
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
            {props.children}
        </ThemeContext.Provider>
    );
}