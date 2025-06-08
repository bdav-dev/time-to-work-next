import Settings from "@/components/settings/Settings";
import TimePicker from "@/components/primitives/control/TimePicker";
import Toggle from "@/components/primitives/control/Toggle";
import Checkbox from "@/components/primitives/control/Checkbox";
import NumberPicker from "@/components/primitives/control/NumberPicker";
import useMutatingConfigurationValue from "@/hooks/configuration/UseMutatingConfigurationValue";
import { DefaultTimelineConfiguration } from "@/hooks/configuration/instances/UseTimelineConfiguration";
import ConfiguredTimeline from "@/components/timeline/ConfiguredTimeline";
import Time from "@/time/Time";
import { compare } from "@/util/CompareUtils";
import TimeSpan from "@/time/TimeSpan";
import useSchedule from "@/hooks/UseSchedule";
import useInputGuard from "@/hooks/UseInputGuard";
import { SemanticKeys } from "@/shortcuts/SemanticKeys";


export default function TimelineSettings() {
    const { schedule } = useSchedule();

    const [startTime, setStartTime] = useMutatingConfigurationValue(config => config.timeline.startTime);
    const [endTime, setEndTime] = useMutatingConfigurationValue(config => config.timeline.endTime);
    const [startTimeInput, setStartTimeInput, applyStartTimeFallback, isStartTimeInputInvalid] = useInputGuard<Time | undefined, Time>(
        startTimeInput => {
            const createFallback = () => (
                compare(DefaultTimelineConfiguration.startTime, 'greaterOrEqualThan', endTime)
                    ? endTime.subtract(TimeSpan.ofMinutes(1))
                    : DefaultTimelineConfiguration.startTime
            );

            return (!startTimeInput || compare(startTimeInput, 'greaterOrEqualThan', endTime))
                ? { fallback: createFallback() }
                : { value: startTimeInput };
        },
        startTime => startTime,
        [startTime, setStartTime]
    );
    const [endTimeInput, setEndTimeInput, applyEndTimeFallback, isEndTimeInputInvalid] = useInputGuard<Time | undefined, Time>(
        endTimeInput => {
            const createFallback = () => (
                compare(DefaultTimelineConfiguration.endTime, 'lessOrEqualThan', startTime)
                    ? startTime.add(TimeSpan.ofMinutes(1))
                    : DefaultTimelineConfiguration.endTime
            );

            return (!endTimeInput || compare(endTimeInput, 'lessOrEqualThan', startTime))
                ? { fallback: createFallback() }
                : { value: endTimeInput };
        },
        endTime => endTime,
        [endTime, setEndTime]
    );
    const [amountOfTimesteps, setAmountOfTimesteps] = useMutatingConfigurationValue(config => config.timeline.amountOfTimeSteps);
    const [amountOfSubTimesteps, setAmountOfSubTimesteps] = useMutatingConfigurationValue(config => config.timeline.amountOfSubTimeSteps);

    const [automaticTimeBoundsOnOverflow, setAutomaticTimeBoundsOnOverflow] = useMutatingConfigurationValue(config => config.timeline.automaticTimeBoundsOnOverflow);
    const [automaticAmountOfTimeSteps, setAutomaticAmountOfTimeSteps] = useMutatingConfigurationValue(config => config.timeline.automaticAmountOfTimeSteps);

    const [marginSize, setMarginSize] = useMutatingConfigurationValue(config => config.timeline.marginSize);

    return (
        <>
            <ConfiguredTimeline schedule={schedule}/>

            <Settings
                className={'mt-2'}
                sections={[
                    {
                        settings: [
                            {
                                label: 'Startzeit',
                                setting: <TimePicker
                                    value={startTimeInput}
                                    onValueChange={setStartTimeInput}
                                    onKeyUp={{
                                        [SemanticKeys.SET_TO_DEFAULT]: { setValue: DefaultTimelineConfiguration.startTime }
                                    }}
                                    showInvalidEvenWhenFocused
                                    onBlur={applyStartTimeFallback}
                                    invalid={isStartTimeInputInvalid}
                                />
                            },
                            {
                                label: 'Endzeit',
                                setting: <TimePicker
                                    value={endTimeInput}
                                    onValueChange={endTimeInput => setEndTimeInput(endTimeInput)}
                                    onKeyUp={{
                                        [SemanticKeys.SET_TO_DEFAULT]: { setValue: DefaultTimelineConfiguration.endTime }
                                    }}
                                    onBlur={applyEndTimeFallback}
                                    showInvalidEvenWhenFocused
                                    invalid={isEndTimeInputInvalid}
                                />
                            },
                            {
                                label: 'Automatische Start- & Endzeit bei Überlauf',
                                setting: <Toggle value={automaticTimeBoundsOnOverflow} onValueChange={setAutomaticTimeBoundsOnOverflow}/>,
                                tooltip: <>
                                    TODO
                                </>
                            },
                            {
                                label: 'Anzahl Zeitschritte',
                                setting: <>
                                    <Checkbox
                                        value={automaticAmountOfTimeSteps}
                                        setValue={setAutomaticAmountOfTimeSteps}
                                        label={'Automatisch'}
                                    />
                                    <NumberPicker
                                        className={'ml-4'}
                                        lowerLimit={2}
                                        upperLimit={20}
                                        value={amountOfTimesteps}
                                        onValueChange={setAmountOfTimesteps}
                                        disabled={automaticAmountOfTimeSteps}
                                    />
                                </>
                            },
                            {
                                label: 'Anzahl Nebenzeitschritte',
                                setting: <NumberPicker
                                    upperLimit={20}
                                    lowerLimit={0}
                                    value={amountOfSubTimesteps}
                                    onValueChange={setAmountOfSubTimesteps}
                                />
                            },
                            {
                                label: 'Randgröße',
                                setting: <NumberPicker
                                    upperLimit={20}
                                    lowerLimit={1}
                                    value={marginSize}
                                    onValueChange={setMarginSize}
                                />
                            }
                        ]
                    }
                ]}
            />
        </>
    );
}
