export function splitWithoutRemoving(string: string, separators: string[]) {
    const chunks: string[] = [];
    let chunk: string = '';

    for (const char of string) {
        chunk += char;
        if (separators.includes(char)) {
            chunks.push(chunk);
            chunk = '';
        }
    }
    if (chunk.length != 0) {
        chunks.push(chunk);
    }

    return chunks;
}
