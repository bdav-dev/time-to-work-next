export function extractValue(any: any, ...keys: string[]) {
    for (const key of keys) {
        // @ts-ignore
        const value = any[key];

        if (value != undefined) {
            return value;
        }
    }

    return undefined;
}

export function replaceValue<T extends object, K extends keyof T>(object: T, key: K, newValue: T[K]) {
    return { ...object, [key]: newValue };
}
