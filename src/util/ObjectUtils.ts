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

export function toReplacedDeepValue<T extends Record<string, any>>(object: T, [pathKey, ...restOfPath]: string[], key: string, value: any): T {
    return pathKey
        ? {
            ...object,
            [pathKey]: toReplacedDeepValue(object[pathKey], restOfPath, key, value)
        }
        : { ...object, [key]: value };
}
