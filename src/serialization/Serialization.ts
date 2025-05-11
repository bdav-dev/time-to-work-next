
export type Codec<S, T> = {
    encode: (source: S) => T,
    decode: (target: T) => S
};

export type Serialization<S> = Codec<S, string>;

export function createSerialization<S, T>(codec?: Codec<S, T>): Serialization<S> {
    if (!codec) {
        return createSerialization({
            encode: source => source,
            decode: target => target
        });
    }

    return {
        encode: source => JSON.stringify(codec.encode(source)),
        decode: target => codec.decode(JSON.parse(target))
    };
}
