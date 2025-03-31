import NeumorphicInput from "@/components/neumorphic-primitives/NeumorphicInput";
import { NeumorphicBlueprintFactory } from "@/neumorphic/neumorphic";

export default function TimePicker() {
    const blueprint = NeumorphicBlueprintFactory.createMedium();
    blueprint.inverted = true;

    return (
        <NeumorphicInput
            blueprint={blueprint}
            type={'time'}
            className={'px-2 py-1.5 rounded-full outline-none'}
            onKeyUp={(e) => {
                if (e.key === 'Enter') {
                    console.log("test");
                }
            }}
        />
    );

}