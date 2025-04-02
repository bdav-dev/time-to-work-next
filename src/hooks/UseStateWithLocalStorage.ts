'use client';

import { Dispatch, SetStateAction, useEffect, useState } from "react";

export type Serialization<T> = {
    serialize: (source: T) => string,
    deserialize: (target: string) => T
}

function createObjectSerialization<T>(): Serialization<T> {
    return {
        serialize: source => JSON.stringify(source),
        deserialize: source => JSON.parse(source)
    }
}

// This hook currently has a limitation: It cannot handle storing / retrieving undefined or null values to / from LocalStorage
export default function useStateWithLocalStorage<T>(key: string, fallback: T, serialization: Serialization<T> = createObjectSerialization<T>()): [T, Dispatch<SetStateAction<T>>] {
    const [value, setValue] = useState<T>(fallback);

    useEffect(() => {
        let raw = getFromLocalStorage(key);
        setValue(raw == null ? fallback : serialization.deserialize(raw));
    }, []);

    useEffect(() => {
        saveToLocalStorage(key, serialization.serialize(value));
    }, [value]);

    return [value, setValue];
}


function saveToLocalStorage(key: string, value: any) {
    window.localStorage.setItem(key, value);
}

function getFromLocalStorage(key: string) {
    return window.localStorage.getItem(key);
}
