import NeumorphicInput from "@/components/primitives/neumorphic/NeumorphicInput";
import { NeumorphicBlueprint, NeumorphicBlueprintFactory } from "@/neumorphic/NeumorphicStyle";
import NeumorphicButton from "@/components/primitives/neumorphic/NeumorphicButton";
import { CSSProperties, useEffect, useState } from "react";
import VerticalRuler from "@/components/layout/VerticalRuler";

type NumberPickerProps = {
    value: number,
    onValueChange: (value: number) => void
}

export default function NumberPicker(props: NumberPickerProps) {
    const distance = NeumorphicBlueprintFactory.createMedium().shadow.distance as number;
    const blur = NeumorphicBlueprintFactory.createMedium().shadow.blur;

    const style: CSSProperties = { height: '2.5rem', width: '3rem' };

    const [inputText, setInputText] = useState<string>('');

    useEffect(() => {
        setInputText(props.value.toString());
    }, [props.value]);

    useEffect(() => {
        props.onValueChange(
            parseInt(inputText) || 0
        );
    }, [inputText]);

    function increment() {
        const textAsInteger = parseInt(inputText);

        setInputText(
            isNaN(textAsInteger)
                ? '0'
                : (textAsInteger + 1).toString()
        );
    }

    function decrement() {
        const textAsInteger = parseInt(inputText);

        setInputText(
            isNaN(textAsInteger)
                ? '0'
                : (textAsInteger - 1).toString()
        );
    }


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


    return (
        <div className={'flex flex-row'}>

            <NeumorphicButton
                blueprint={leftButtonBlueprint}
                className={'p-2 rounded-l-2xl text-[1.3rem] leading-none'}
                style={style}
                onClick={increment}
            >
                +
            </NeumorphicButton>

            <VerticalRuler style={{ height: style.height, zIndex: 20 }}/>

            <NeumorphicInput
                blueprint={inputBlueprint}
                type={"number"}
                className={'w-16 py-2 text-center'}
                value={inputText}
                onChange={i => setInputText(i.target.value)}
            />

            <VerticalRuler style={{ height: style.height, zIndex: 20 }}/>

            <NeumorphicButton
                blueprint={rightButtonBlueprint}
                style={style}
                className={'p-2 rounded-r-2xl text-[1.3rem] leading-none'}
                onClick={decrement}
            >
                -
            </NeumorphicButton>


        </div>
    );

}