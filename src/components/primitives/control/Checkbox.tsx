import NeumorphicButton from "@/components/primitives/neumorphic/NeumorphicButton";
import { NeumorphicBlueprintFactory } from "@/neumorphic/NeumorphicStyle";
import { ReactNode } from "react";


type CheckboxProps = {
    label?: string | ReactNode,
    value: boolean,
    setValue: (value: boolean) => void
};

export default function Checkbox(props: CheckboxProps) {
    const blueprint = NeumorphicBlueprintFactory.createMedium();
    blueprint.active = true;
    blueprint.inverted = props.value;

    return (
        <div className={'flex flex-row items-center'}>
            <NeumorphicButton
                blueprint={blueprint}
                className={'rounded-lg size-8 dark:border-zinc-600 border-zinc-400 border-2 text-center content-center text-xl select-none'}
                onClick={() => props.setValue(!props.value)}
            >
                {props.value ? '✓' : ''} {/* TODO: Implement custom check icon  */}
            </NeumorphicButton>
            {props.label}
        </div>
    );
}
