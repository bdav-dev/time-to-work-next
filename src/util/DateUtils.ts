
export function getCurrentDateAsString() {
    return new Date().toISOString().split('T')[0];
}
