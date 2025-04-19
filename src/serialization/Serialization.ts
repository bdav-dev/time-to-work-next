export type GenericSerialization<S, T> = {
    serialize: (source: S) => T,
    deserialize: (target: T) => S
};

export type Serialization<S> = GenericSerialization<S, string>;

export function createJsonSerialization<S, T>(serialization?: GenericSerialization<S, T>): Serialization<S> {
    if (!serialization) {
        return createJsonSerialization({
            serialize: source => source,
            deserialize: target => target
        });
    }

    return {
        serialize: source => JSON.stringify(serialization.serialize(source)),
        deserialize: target => serialization.deserialize(JSON.parse(target))
    };
}