import Settings from "@/components/settings/Settings";
import TimeSpan from "@/time/TimeSpan";
import useMutatingConfigurationValue from "@/hooks/configuration/UseMutatingConfigurationValue";
import SignedTimeSpanPicker from "@/components/primitives/control/SignedTimeSpanPicker";
import TimeSpanPicker from "@/components/primitives/control/TimeSpanPicker";
import Toggle from "@/components/primitives/control/Toggle";


export default function WorkingTimeSettings() {
    const [dailyWorkingTime, setDailyWorkingTime] = useMutatingConfigurationValue(config => config.workingTime.dailyWorkingTime);
    const [timeBalance, setTimeBalance] = useMutatingConfigurationValue(config => config.workingTime.timeBalance);
    const [minBreak, setMinBreak] = useMutatingConfigurationValue(config => config.workingTime.minBreak);
    //const [maxWorkTimeBlockDuration, setMaxWorkTimeBlockDuration] = useMutatingConfigurationValue(config => config.workingTime.maxWorkTimeBlockDuration);
    const [showOptimalBreakTime, setShowOptimalBreakTime] = useMutatingConfigurationValue(config => config.workingTime.showOptimalBreakTime);

    return (
        <div>
            <Settings
                sections={[
                    {
                        settings: [
                            {
                                label: 'Tägliche Sollarbeitszeit',
                                setting: <TimeSpanPicker
                                    value={dailyWorkingTime}
                                    onValueChange={setDailyWorkingTime}
                                    invalid={!dailyWorkingTime || dailyWorkingTime.equals(TimeSpan.empty())}
                                />
                            },
                            {
                                label: 'Zeitsaldo',
                                setting: <SignedTimeSpanPicker
                                    value={timeBalance}
                                    setValue={setTimeBalance}
                                    invalid={!timeBalance}
                                />
                            }
                        ]
                    },
                    {
                        title: "Einschränkungen",
                        settings: [
                            /* {
                                label: "Maximale Arbeitszeit am Stück",
                                setting: <TimeSpanPicker
                                    value={maxWorkTimeBlockDuration}
                                    onValueChange={setMaxWorkTimeBlockDuration}
                                />
                            }, */
                            {
                                label: "Mindestpause",
                                setting: <TimeSpanPicker
                                    value={minBreak}
                                    onValueChange={setMinBreak}
                                />
                            },
                            {
                                label: "Zeige Ende von optimaler Pause auf Timeline",
                                setting: disabled => <Toggle disabled={disabled} value={!minBreak ? false : showOptimalBreakTime} onValueChange={setShowOptimalBreakTime}/>,
                                disabled: !minBreak
                            }
                        ]
                    }
                ]}
            />
        </div>
    );
}
