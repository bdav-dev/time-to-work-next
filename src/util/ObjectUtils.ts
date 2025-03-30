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

