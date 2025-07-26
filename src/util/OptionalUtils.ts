type Optional<T> = {
    value: T
    map: <S>(mapper: (value: NonNullable<T>) => S) => Optional<S | undefined | null>,
    orUndefined: () => NonNullable<T> | undefined
}

export function optional<T>(value: T): Optional<T> {

    function map<S>(mapper: (value: NonNullable<T>) => S): Optional<S | undefined | null> {
        return value == null
            ? optional(value as S | undefined | null)
            : optional(mapper(value as NonNullable<T>));
    }

    function orUndefined(): NonNullable<T> | undefined {
        return value == undefined ? undefined : value;
    }

    return {
        map,
        orUndefined,
        value
    };
}
