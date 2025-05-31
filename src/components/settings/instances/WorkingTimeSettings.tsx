import Settings from "@/components/settings/Settings";
import TimeSpan from "@/time/TimeSpan";
import useMutatingConfigurationValue from "@/hooks/configuration/UseMutatingConfigurationValue";
import SignedTimeSpanPicker from "@/components/primitives/control/SignedTimeSpanPicker";
import TimeSpanPicker from "@/components/primitives/control/TimeSpanPicker";


export default function WorkingTimeSettings() {
    const [dailyWorkingTime, setDailyWorkingTime] = useMutatingConfigurationValue(config => config.workingTime.dailyWorkingTime);
    const [timeBalance, setTimeBalance] = useMutatingConfigurationValue(config => config.workingTime.timeBalance);

    return (
        <div>
            <Settings
                sections={[
                    {
                        hideHorizontalRuler: true,
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
                    }
                ]}
            />
        </div>
    );
}
