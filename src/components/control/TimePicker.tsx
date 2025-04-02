import NeumorphicInput from "@/components/neumorphicPrimitives/NeumorphicInput";
import { NeumorphicBlueprintFactory } from "@/neumorphic/NeumorphicStyle";
import Time from "@/time/Time";
import { useEffect, useRef } from "react";

type TimePickerProps = {
    value: Time | undefined,
    onValueChange: (value: Time | undefined) => void
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
            defaultValue={props.value?.toString() ?? ''}
            onChange={event => {
                const value = event.currentTarget.value;
                props.onValueChange(value != '' ? Time.ofString(value) : undefined);
            }}
            className={'px-2 py-1.5 rounded-full outline-none'}
            onKeyUp={(e) => {
                if (e.key === 'Enter') {
                    props.onValueChange(Time.now());
                }
            }}
        />
    );

}