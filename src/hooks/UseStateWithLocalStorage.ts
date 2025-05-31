'use client';

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { createSerialization, Serialization } from "@/serialization/Serialization";
import LocalStorage from "@/storage/LocalStorage";


/**
 * This hook wraps the useState hook from React and stores the state in LocalStorage.
 * Storing undefined or null values (in local storage) is not supported by this hook.
 */
export default function useStateWithLocalStorage<T>(key: string, fallback: T, serialization: Serialization<T> = createSerialization()): [T, Dispatch<SetStateAction<T>>] {
    const [value, setValue] = useState<T>(fallback);

    useEffect(() => {
        const raw = LocalStorage.get(key);
        setValue(raw == null ? fallback : serialization.decode(raw));
    }, []);

    useEffect(() => {
        LocalStorage.set(key, serialization.encode(value));
    }, [value]);

    return [value, setValue];
}
