'use client';

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { createSerialization, Serialization } from "@/serialization/Serialization";
import LocalStorage from "@/storage/LocalStorage";


// This hook currently has a limitation: It cannot handle storing / retrieving undefined or null values to / from LocalStorage
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
