import Settings from "@/components/settings/Settings";
import TimeSpan from "@/time/TimeSpan";
import TimePicker from "@/components/primitives/control/TimePicker";
import useMutatingConfigurationValue from "@/hooks/configuration/UseMutatingConfigurationValue";
import SignedTimePicker from "@/components/control/SignedTimePicker";


export default function WorkingTimeSettings() {
    const [dailyWorkingTime, setDailyWorkingTime] = useMutatingConfigurationValue(config => config.workingTime.dailyWorkingTime);
    const [timeBalance, setTimeBalance] = useMutatingConfigurationValue<TimeSpan | undefined>(config => config.workingTime.timeBalance);

    return (
        <div>
            <Settings
                sections={[
                    {
                        hideHorizontalRuler: true,
                        settings: [
                            {
                                label: 'Tägliche Sollarbeitszeit',
                                setting: <TimePicker
                                    value={dailyWorkingTime?.asTime()}
                                    onValueChange={dailyWorkingTime => setDailyWorkingTime(dailyWorkingTime?.asTimeSpan())}
                                    invalid={!dailyWorkingTime || dailyWorkingTime.equals(TimeSpan.empty())}
                                />
                            },
                            {
                                label: 'Zeitsaldo',
                                setting: <SignedTimePicker
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
