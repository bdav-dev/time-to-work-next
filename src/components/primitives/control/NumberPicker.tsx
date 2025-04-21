import NeumorphicInput from "@/components/primitives/neumorphic/NeumorphicInput";
import { NeumorphicBlueprint, NeumorphicBlueprintFactory } from "@/neumorphic/NeumorphicStyle";
import NeumorphicButton from "@/components/primitives/neumorphic/NeumorphicButton";
import { CSSProperties } from "react";
import VerticalRuler from "@/components/layout/VerticalRuler";


type NumberPickerProps = {
    value: number,
    onValueChange: (value: number) => void,
    upperLimit?: number,
    lowerLimit?: number,
    disabled?: boolean,
    className?: string
}

export default function NumberPicker(props: NumberPickerProps) {

    function applyLowerLimit(value: number) {
        if (props.lowerLimit != undefined && value < props.lowerLimit) {
            return props.lowerLimit;
        }
        return value;
    }

    function applyUpperLimit(value: number) {
        if (props.upperLimit != undefined && value > props.upperLimit) {
            return props.upperLimit;
        }
        return value;
    }

    function applyLimits(value: number) {
        return applyLowerLimit(applyUpperLimit(value));
    }

    const increment = () => props.onValueChange(applyUpperLimit(props.value + 1));
    const decrement = () => props.onValueChange(applyLowerLimit(props.value - 1));

    const onChange = (inputText: string) => props.onValueChange(applyLimits(formatInput(inputText)));

    function formatInput(inputText: string) {
        const sign = (
            inputText.trim().startsWith('-') || inputText.trim().endsWith('-')
                ? -1
                : 1
        );
        return (parseInt(inputText.replace(/\D/g, '')) || 0) * sign;
    }

    return (
        <div className={`flex flex-row ${props.className}`}>
            <NeumorphicButton
                blueprint={leftButtonBlueprint}
                className={'p-2 rounded-l-xl text-[1.3rem] leading-none'}
                style={BUTTON_STYLE}
                onClick={decrement}
                disabled={props.disabled || (props.lowerLimit != undefined && props.value == props.lowerLimit)}
            >
                -
            </NeumorphicButton>

            <VerticalRuler style={DIVIDER_STYLE}/>

            <NeumorphicInput
                blueprint={inputBlueprint}
                type={"text"}
                className={'w-16 py-2 text-center'}
                value={props.value}
                onChange={event => onChange(event.target.value)}
                disabled={props.disabled}
            />

            <VerticalRuler style={DIVIDER_STYLE}/>

            <NeumorphicButton
                blueprint={rightButtonBlueprint}
                style={BUTTON_STYLE}
                className={'p-2 rounded-r-xl text-[1.3rem] leading-none'}
                onClick={increment}
                disabled={props.disabled || (props.upperLimit != undefined && props.value == props.upperLimit)}
            >
                +
            </NeumorphicButton>
        </div>
    );
}

const BUTTON_STYLE: CSSProperties = { height: '2.5rem', width: '3rem' };
const DIVIDER_STYLE: CSSProperties = { height: BUTTON_STYLE.height, zIndex: 20 };

const distance = NeumorphicBlueprintFactory.createMedium().shadow.distance as number;
const blur = NeumorphicBlueprintFactory.createMedium().shadow.blur;

const leftButtonBlueprint: NeumorphicBlueprint = {
    active: true,
    margin: 0,
    shadow: {
        distance: {
            left: distance,
            bottom: distance,
            top: distance,
            right: 0
        },
        blur
    }
}
const inputBlueprint: NeumorphicBlueprint = {
    margin: 0,
    inverted: true,
    shadow: {
        distance,
        blur
    }
}
const rightButtonBlueprint: NeumorphicBlueprint = {
    active: true,
    margin: 0,
    shadow: {
        distance: {
            left: 0,
            bottom: distance,
            top: distance,
            right: distance
        },
        blur
    }
}
