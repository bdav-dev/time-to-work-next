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

export default function TimelineSettings() {
    const [schedule] = useSchedule();

    const [amountOfTimesteps, setAmountOfTimesteps] = useMutatingConfigurationValue(config => config.timeline.amountOfMajorTimeSteps);
    const [amountOfSubTimesteps, setAmountOfSubTimesteps] = useMutatingConfigurationValue(config => config.timeline.amountOfMinorTimeSteps);
    const [startTime, setStartTime] = useMutatingConfigurationValue(config => config.timeline.startTime);
    const [endTime, setEndTime] = useMutatingConfigurationValue(config => config.timeline.endTime);

    const [dynamicScaling, setDynamicScaling] = useMutatingConfigurationValue(config => config.timeline.automaticTimeBoundsIfOverflow);
    const [auto, setAuto] = useMutatingConfigurationValue(config => config.timeline.automaticAmountOfMajorTimeSteps);

    const [offTimeSize, setOffTimeSize] = useMutatingConfigurationValue(config => config.timeline.offTimeSize);

    function rectifyStartTimeInput(startTimeInput?: Time) {
        const fallback = (
            compare(DefaultTimelineConfiguration.startTime, 'greaterOrEqualThan', endTime)
                ? endTime.subtract(TimeSpan.ofMinutes(1))
                : DefaultTimelineConfiguration.startTime
        );
        return (!startTimeInput || compare(startTimeInput, 'greaterOrEqualThan', endTime))
            ? fallback
            : startTimeInput;
    }

    function rectifyEndTimeInput(endTimeInput?: Time) {
        const fallback = (
            compare(DefaultTimelineConfiguration.endTime, 'lessOrEqualThan', startTime)
                ? startTime.add(TimeSpan.ofMinutes(1))
                : DefaultTimelineConfiguration.endTime
        );
        return (!endTimeInput || compare(endTimeInput, 'lessOrEqualThan', startTime))
            ? fallback
            : endTimeInput;
    }

    return (
        <>
            <ConfiguredTimeline schedule={schedule}/>

            <Settings
                className={'mt-2'}
                settingSections={[
                    {
                        settings: [
                            {
                                label: 'Startzeit',
                                setting: <TimePicker
                                    value={startTime}
                                    onValueChange={startTimeInput => setStartTime(rectifyStartTimeInput(startTimeInput))}
                                    valueOnSpaceKeyPressed={DefaultTimelineConfiguration.startTime}
                                />
                            },
                            {
                                label: 'Endzeit',
                                setting: <TimePicker
                                    value={endTime}
                                    onValueChange={endTimeInput => setEndTime(rectifyEndTimeInput(endTimeInput))}
                                    valueOnSpaceKeyPressed={DefaultTimelineConfiguration.endTime}
                                />
                            },
                            {
                                label: 'Automatische Start- & Endzeit bei Überlauf',
                                setting: <Toggle value={dynamicScaling} onValueChange={setDynamicScaling}/>
                            },
                            {
                                label: 'Anzahl Hauptzeitschritte',
                                setting: <>
                                    <Checkbox value={auto} setValue={setAuto} label={'Automatisch'}/>
                                    <NumberPicker
                                        lowerLimit={2}
                                        upperLimit={20}
                                        value={amountOfTimesteps}
                                        onValueChange={setAmountOfTimesteps}
                                        disabled={auto}
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
                                    value={offTimeSize}
                                    onValueChange={setOffTimeSize}
                                />
                            }
                        ]
                    }
                ]}
            />
        </>
    );
}


