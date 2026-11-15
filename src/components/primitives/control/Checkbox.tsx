import NeumorphicButton from "@/components/primitives/neumorphic/NeumorphicButton";
import { NeumorphicBlueprintFactory } from "@/neumorphic/NeumorphicStyle";
import { ReactNode } from "react";
import MaterialSymbol, { MaterialSymbols } from "@/icons/material/MaterialSymbol";


type CheckboxProps = {
    label?: ReactNode,
    value: boolean,
    setValue: (value: boolean) => void,
    overrideMargin?: boolean,
    checkboxClassName?: string,
    disabled?: boolean
};

export default function Checkbox(props: CheckboxProps) {
    const blueprint = NeumorphicBlueprintFactory.createMedium();
    blueprint.active = true;
    blueprint.inverted = props.value;
    if (props.overrideMargin) {
        blueprint.margin = undefined;
    }

    return (
        <div className={'flex flex-row items-center'}>
            <NeumorphicButton
                disabled={props.disabled}
                blueprint={blueprint}
                className={`rounded-lg size-8 dark:border-zinc-600 border-zinc-400 border-2 text-center content-center text-xl select-none flex items-center justify-center ${props.checkboxClassName}`}
                onClick={() => props.setValue(!props.value)}
            >
                {props.value ? <MaterialSymbol symbol={MaterialSymbols.CHECK} className={'text-[0.8em]'}/> : ''}
            </NeumorphicButton>
            {props.label}
        </div>
    );
}
