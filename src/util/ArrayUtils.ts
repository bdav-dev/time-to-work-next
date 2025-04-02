export function createIsLast(array: unknown[]) {
    return (index: number) => array.length - 1 === index;
}

export function isFirst(index: number) {
    return index === 0;
}

export function isEmpty(array: unknown[]) {
    return array.length === 0;
}