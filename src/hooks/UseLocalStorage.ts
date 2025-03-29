'use client';

import { Dispatch, SetStateAction, useEffect, useState } from "react";

export default function useLocalStorage<T>(key: string, fallback: T): [T, Dispatch<SetStateAction<T>>] {
    const [firstLoadDone, setFirstLoadDone] = useState(false);
    const [storedValue, setStoredValue] = useState(fallback);

    function fromLocalStorage() {
        if (window == undefined) {
            return fallback;
        }

        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : fallback;
        } catch (error) {
            return fallback;
        }
    }

    useEffect(() => {
        setStoredValue(fromLocalStorage());
        setFirstLoadDone(true);
    }, []);

    useEffect(() => {
        if (!firstLoadDone) {
            return;
        }

        try {
            if (window != undefined) {
                window.localStorage.setItem(key, JSON.stringify(storedValue));
            }
        } catch (error) {
        }
    }, [storedValue]);

    return [storedValue, setStoredValue];
}