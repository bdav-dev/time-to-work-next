import Settings from "@/components/layout/Settings";
import TimePicker from "@/components/primitives/control/TimePicker";
import Toggle from "@/components/primitives/control/Toggle";
import Checkbox from "@/components/primitives/control/Checkbox";
import NumberPicker from "@/components/primitives/control/NumberPicker";
import useMutatingConfigurationValue from "@/hooks/configuration/UseMutatingConfigurationValue";
import { DefaultTimelineConfiguration } from "@/hooks/configuration/settings/UseTimelineConfiguration";
import useMutatingConfigurationValueWithFallback from "@/hooks/configuration/UseMutatingConfigurationValueWithFallback";
import ConfiguredTimeline from "@/components/control/ConfiguredTimeline";

// TODO: handle situation where starttime > endtime
export default function TimelineSettings() {
    const [amountOfTimesteps, setAmountOfTimesteps] = useMutatingConfigurationValue(config => config.timeline.amountOfMajorTimeSteps);
    const [amountOfSubTimesteps, setAmountOfSubTimesteps] = useMutatingConfigurationValue(config => config.timeline.amountOfMinorTimeSteps);
    const [startTime, setStartTime] = useMutatingConfigurationValueWithFallback(
        config => config.timeline.startTime,
        DefaultTimelineConfiguration.startTime
    );
    const [endTime, setEndTime] = useMutatingConfigurationValueWithFallback(
        config => config.timeline.endTime,
        DefaultTimelineConfiguration.endTime
    );

    const [dynamicScaling, setDynamicScaling] = useMutatingConfigurationValue(config => config.timeline.automaticTimeBoundsIfOverflow);
    const [auto, setAuto] = useMutatingConfigurationValue(config => config.timeline.automaticAmountOfMajorTimeSteps);

    const [offTimeSize, setOffTimeSize] = useMutatingConfigurationValue(config => config.timeline.offTimeSize);

    return (
        <>
            <ConfiguredTimeline
                data={[]}
            />

            <Settings
                className={'mt-2'}
                settingSections={[
                    {
                        settings: [
                            {
                                label: 'Startzeit',
                                setting: <TimePicker value={startTime} onValueChange={setStartTime}/>
                            },
                            {
                                label: 'Endzeit',
                                setting: <TimePicker value={endTime} onValueChange={setEndTime}/>
                            },
                            {
                                label: 'Automatische Start- & Endzeit bei Überlauf',
                                setting: <Toggle isOn={dynamicScaling} onChange={setDynamicScaling}/>
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
