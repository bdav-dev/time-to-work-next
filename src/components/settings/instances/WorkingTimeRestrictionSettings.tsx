import Settings from "@/components/settings/Settings";
import useMutatingConfigurationValue from "@/hooks/configuration/UseMutatingConfigurationValue";
import TimeSpanPicker from "@/components/primitives/control/TimeSpanPicker";

export default function WorkingTimeRestrictionSettings() {
    const [minBreak, setMinBreak] = useMutatingConfigurationValue(config => config.workingTimeRestrictions.minBreak);

    return (

        <div>
            <Settings
                sections={[
                    {
                        settings: [
                            {
                                label: "Mindestpause",
                                setting: <TimeSpanPicker
                                    value={minBreak}
                                    onValueChange={setMinBreak}
                                />
                            }
                        ]
                    }


                ]}

            />
        </div>

    );


}



