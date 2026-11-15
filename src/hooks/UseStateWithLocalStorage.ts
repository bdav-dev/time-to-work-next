'use client';

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { createSerialization, Serialization } from "@/serialization/Serialization";


/**
 * This hook wraps the useState hook from React and stores the state in LocalStorage.
 * Storing undefined or null values (in local storage) is not supported by this hook.
 */
export default function useStateWithLocalStorage<T>(key: string, fallback: T, serialization: Serialization<T> = createSerialization()): [T, Dispatch<SetStateAction<T>>] {
    const [firstLoadDone, setFirstLoadDone] = useState(false);
    const [storedValue, setStoredValue] = useState(fallback);

    function fromLocalStorage() {
        if (window == undefined) {
            return fallback;
        }

        try {
            const item = window.localStorage.getItem(key);
            return item ? serialization.decode(item) : fallback;
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
                window.localStorage.setItem(key, serialization.encode(storedValue));
            }
        } catch (error) {
        }
    }, [storedValue]);

    return [storedValue, setStoredValue];
}
