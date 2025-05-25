import NeumorphicInput from "@/components/primitives/neumorphic/NeumorphicInput";
import { NeumorphicBlueprintFactory } from "@/neumorphic/NeumorphicStyle";
import Time from "@/time/Time";
import { FocusEventHandler, useEffect, useRef } from "react";

export type TimePickerProps = {
    value: Time | undefined,
    onValueChange: (value: Time | undefined) => void,
    onEnterKeyPressed?: () => void,
    valueOnSpaceKeyPressed?: Time,
    onBlur?: FocusEventHandler<HTMLInputElement>
    showInvalidEvenWhenFocused?: boolean,
    disabled?: boolean,
    className?: string,
    invalid?: boolean
}

export default function TimePicker(props: TimePickerProps) {
    const blueprint = NeumorphicBlueprintFactory.createMedium();
    blueprint.inverted = true;

    const input = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (input.current) {
            input.current.value = props.value?.toString() ?? '';
        }
    }, [props.value]);

    return (
        <NeumorphicInput
            ref={input}
            blueprint={blueprint}
            type={'time'}
            disabled={props.disabled}
            value={props.value?.toString() ?? ''}
            onChange={event => {
                const value = event.currentTarget.value;
                props.onValueChange(value != '' ? Time.ofString(value) : undefined);
            }}
            onBlur={props.onBlur}
            className={`
                px-2 py-1.5 rounded-full ${props.className}
                ${(!props.invalid || !props.showInvalidEvenWhenFocused) && "focus:outline-none"}
                ${props.invalid && 'outline-red-400 outline outline-1'}
            `}
            onKeyUp={(e) => {
                if (e.key === ' ') {
                    props.valueOnSpaceKeyPressed && props.onValueChange(props.valueOnSpaceKeyPressed);
                } else if (e.key === 'Enter') {
                    input.current?.blur();
                    props.onEnterKeyPressed?.();
                }
            }}
        />
    );

}