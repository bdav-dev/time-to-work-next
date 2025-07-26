import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";


type GuardValue<T> = { fallback?: never, value: T } | { fallback: T, value?: never };

export default function useInputGuard<I, V>(
    { guard, encode, state }: {
        guard: (inputValue: I, value: V) => GuardValue<V>,
        encode: (value: V) => I,
        state: [V, (value: V) => void]
    }
): [I, Dispatch<SetStateAction<I>>, () => void, boolean] {
    const [value, setValue] = state;
    const [inputValue, setInputValue] = useState<I>(encode(value));
    const guardValue = useMemo(() => guard(inputValue, value), [inputValue]);
    const isInputValid = () => "value" in guardValue;

    useEffect(() => {
        setInputValue(encode(value));
    }, [value]);

    useEffect(() => {
        if (isInputValid()) {
            setValue(guardValue.value!);
        }
    }, [guardValue]);

    const applyFallbackIfInputInvalid = () => {
        if (!isInputValid()) {
            setInputValue(encode(guardValue.fallback!));
        }
    }

    return [inputValue, setInputValue, applyFallbackIfInputInvalid, !isInputValid()];
}
