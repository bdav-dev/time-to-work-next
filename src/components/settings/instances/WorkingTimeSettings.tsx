import Settings from "@/components/settings/Settings";
import TimeSpan from "@/time/TimeSpan";
import useMutatingConfigurationValue from "@/hooks/configuration/UseMutatingConfigurationValue";
import SignedTimeSpanPicker from "@/components/primitives/control/SignedTimeSpanPicker";
import TimeSpanPicker from "@/components/primitives/control/TimeSpanPicker";
import Toggle from "@/components/primitives/control/Toggle";
import useBrowserNotifications from "@/hooks/UseBrowserNotifications";
import Checkbox from "@/components/primitives/control/Checkbox";
import useInputGuard from "@/hooks/UseInputGuard";


export default function WorkingTimeSettings() {
    const [dailyWorkingTime, setDailyWorkingTime] = useMutatingConfigurationValue(config => config.workingTime.dailyWorkingTime);
    const [timeBalance, setTimeBalance] = useMutatingConfigurationValue(config => config.workingTime.timeBalance);
    const [minBreak, setMinBreak] = useMutatingConfigurationValue(config => config.workingTime.minBreak);
    const [showOptimalBreakTime, setShowOptimalBreakTime] = useMutatingConfigurationValue(config => config.workingTime.showOptimalBreakTime);
    const [maxWorkTimeBlockViolationNotificationThreshold, setMaxWorkTimeBlockViolationNotificationThreshold] = useMutatingConfigurationValue(config => config.workingTime._impendingWorkTimeViolation.threshold);
    const [notifyOnImpendingMaxWorkTimeBlockViolation, setNotifyOnImpendingMaxWorkTimeBlockViolation] = useMutatingConfigurationValue(config => config.workingTime._impendingWorkTimeViolation.notify);
    const [maxWorkTimeBlockDuration, setMaxWorkTimeBlockDuration, applyMaxWorkTimeBlockDurationFallback] =
        useInputGuard<TimeSpan | undefined, TimeSpan | undefined>({
            guard: inputValue => {
                if (inputValue?.equals(TimeSpan.zero())) {
                    return { fallback: undefined };
                }
                return { value: inputValue };
            },
            encode: s => s,
            state: useMutatingConfigurationValue(config => config.workingTime.maxWorkTimeBlockDuration)
        });

    const browserNotification = useBrowserNotifications();

    const isViolationNotificationInputDisabled = !maxWorkTimeBlockDuration || !notifyOnImpendingMaxWorkTimeBlockViolation;

    function askForNotificationPermission(wasChecked: boolean) {
        if (!wasChecked || browserNotification.availability.value != "default") {
            return;
        }
        browserNotification.requestPermission();
    }

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
                                    invalid={!dailyWorkingTime || dailyWorkingTime.equals(TimeSpan.zero())}
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
                        title: "Pausenregulierungen",
                        settings: [
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
                    },
                    {
                        title: "Arbeitszeitregulierungen",
                        settings: [
                            {
                                label: "Maximale Arbeitszeit am Stück",
                                setting: <TimeSpanPicker
                                    value={maxWorkTimeBlockDuration}
                                    onValueChange={setMaxWorkTimeBlockDuration}
                                    onBlur={applyMaxWorkTimeBlockDurationFallback}
                                />
                            },
                            {
                                label: "Benachrichtige bei bevorstehender Überschreitung",
                                disabled: !maxWorkTimeBlockDuration,
                                setting: disabled => <>
                                    <Checkbox
                                        disabled={disabled}
                                        value={!disabled && notifyOnImpendingMaxWorkTimeBlockViolation}
                                        setValue={value => {
                                            setNotifyOnImpendingMaxWorkTimeBlockViolation(value);
                                            if (value) askForNotificationPermission(value);
                                        }}
                                    />
                                    <span className={`${isViolationNotificationInputDisabled && 'opacity-60'} mr-0.5`}>Benachrichtige</span>
                                    <TimeSpanPicker
                                        value={maxWorkTimeBlockViolationNotificationThreshold}
                                        onValueChange={setMaxWorkTimeBlockViolationNotificationThreshold}
                                        disabled={isViolationNotificationInputDisabled}
                                        invalid={notifyOnImpendingMaxWorkTimeBlockViolation && !maxWorkTimeBlockViolationNotificationThreshold}
                                    />
                                    <span className={`${isViolationNotificationInputDisabled && 'opacity-60'} ml-0.5`}>davor</span>
                                </>
                            }
                        ]
                    }
                ]}
            />
        </div>
    );
}
