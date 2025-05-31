import NeumorphicInput from "@/components/primitives/neumorphic/NeumorphicInput";
import { NeumorphicBlueprintFactory } from "@/neumorphic/NeumorphicStyle";
import Time from "@/time/Time";
import { FocusEventHandler, useEffect, useRef } from "react";
import { Key } from "@/shortcuts/SemanticKeys";

export type TimePickerProps = {
    value: Time | undefined,
    onValueChange: (value: Time | undefined) => void,
    onBlur?: FocusEventHandler<HTMLInputElement>,
    showInvalidEvenWhenFocused?: boolean,
    disabled?: boolean,
    className?: string,
    invalid?: boolean,
    onKeyUp?: { [key in Key]?: OnKeyUpActions }
}

type OnKeyUpActions = {
    setValue?: Time | null,
    runAndBlur?: () => void,
    run?: () => void
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

    function onKeyUp(pressedKey: string) {
        if (!props.onKeyUp) {
            return;
        }

        for (const [key, actions] of Object.entries(props.onKeyUp)) {
            if (pressedKey !== key) {
                continue;
            }

            if (actions.setValue !== undefined) {
                props.onValueChange(actions.setValue ?? undefined);
            }
            if (actions.run) {
                actions.run();
            }
            if (actions.runAndBlur) {
                actions.runAndBlur();
                input.current?.blur();
            }
        }
    }

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
            onKeyUp={e => onKeyUp(e.key)}
        />
    );

}